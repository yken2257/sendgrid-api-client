import re, json
from email import message_from_string
from email.header import decode_header

class Payloads:
  def __init__(self) -> None:
    self.bodies_list = []
  
  def preprocess(self, msg):
    msg = msg.strip('" ')
    msg = re.sub(r"\\([btnrf])", lambda match: {
    "b": "\b",
    "t": "\t",
    "n": "\n",
    "v": "\v",
    "r": "\r",
    "f": "\f"
    }[match.group(1)], msg)
    msg = message_from_string(msg)
    return msg


  def get_decoded_headers(self, msg):
    msg = self.preprocess(msg)
    self.headers_list = msg.keys()
    decoded_headers_list = []
    for header in self.headers_list:
      header_value = msg[header].replace("\r\n", "").replace("\n", "").replace("\t", " ")
      #print(f"{header_value=}")
      decoded_str = ""
      mime_encoded = False
      for part_str, charset in decode_header(header_value):
        if charset is not None:
            mime_encoded = True
            decoded_str += part_str.decode(encoding=charset)
        elif type(part_str) == bytes:
            decoded_str += part_str.decode()
        elif type(part_str) == str:
            decoded_str += part_str
      if mime_encoded:
          decoded_headers_list.append({"key": header, "value":decoded_str})
    return decoded_headers_list   

  def get_body(self, msg):
    msg = self.preprocess(msg) if type(msg) == str else msg
    ctype = msg.get_content_type()
    print(ctype)
    cdispo = str(msg.get_content_disposition())
    print(cdispo)
    charset = msg.get_content_charset()
    print(charset)
    if msg.get_content_maintype() == "text":
      body = msg.get_payload(decode=True).decode(encoding=charset)
      self.bodies_list.append({
        "Content-Type": ctype,
        "Charset": charset,
        "Body": body
      })
    if msg.is_multipart() and 'attachment' not in cdispo:
      for subpart in msg.get_payload():
        self.get_body(subpart)
    return self.bodies_list

def handler(event, context):
  input_data = event["body"]

  print('received event:')
  print(input_data)

  payloads = Payloads()
  decoded_headers = payloads.get_decoded_headers(input_data)
  response_data = {"headers": decoded_headers}

  if "Content-Type" in payloads.headers_list:    
    payloads.get_body(input_data)
    response_data["bodies"] = payloads.bodies_list

  print('response body:')
  print(response_data)

  return {
    'statusCode': 200,
    'headers': {
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    },
    'body': json.dumps(response_data)
  }