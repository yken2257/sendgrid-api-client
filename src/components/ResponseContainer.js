import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-dawn";
import {
    Alert,
    Button,
    Container,
    Header,
    Popover,
    SpaceBetween,
    StatusIndicator
  } from "@cloudscape-design/components";

export default function ResponseContainer(props) {
    const contentType = props.response.contentType;
    let mode = "";
    let text = props.response.body;
    if (contentType === "application/json") {
      mode = "json";
      if (props.response.body) {
        text = JSON.stringify(JSON.parse(props.response.body), null, 2);
      } else {
        text = null;
      }
    } else if (contentType === "text/html") {
      mode = "html"
    }
    return (
      <SpaceBetween size="xxs">
        <Alert
          type={props.response.ok ? "success" : "warning"}
          header={
            <Header>
              {props.response.status} {props.response.statusText}
            </Header>
          }
        ></Alert>
        <Container 
          header={
            <Header 
              variant="h3"
              actions={
                <Popover
                  size="small"
                  position="top"
                  triggerType="custom"
                  dismissButton={false}
                  content={<StatusIndicator type="success">Copied!</StatusIndicator>}
                >
                  <Button
                    iconAlign="left"
                    iconName="copy"
                    onClick={props.onCopy}
                  >
                    Copy code
                  </Button>
                </Popover>
              }
            >
              Response body
            </Header>
          }
        >
        { text &&
          <AceEditor
            mode={mode}
            theme="dawn"
            value={text}
            width={null}
            maxLines={50}
            showGutter={false}
            highlightActiveLine={false}
            readOnly={true}
            showPrintMargin={false}
            enableBasicAutocompletion={false}
          />
        }
        </Container>
      </SpaceBetween>
    );
  }
