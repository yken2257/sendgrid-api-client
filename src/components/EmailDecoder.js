import "setimmediate";
import  { useState, useContext } from "react";
import {
  AppLayout,
  Button,
  Box,
  Container,
  ContentLayout,
  Flashbar,
  Form,
  FormField,
  Header,
  HelpPanel,
  Link,
  SideNavigation,
  SpaceBetween,
  Table,
  Tabs,
  Textarea
} from "@cloudscape-design/components";
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/theme-dawn";

import { simpleParser } from "mailparser";
import MenuSideNavigation from "./MenuSideNavigation";

export default function EmailDecoder () {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [input, setInput] = useState(undefined);
  const [parsedHeader, setParsedHeader] = useState([]);
  const [parsedContent, setParsedContent] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [errMsg, setErrMsg] = useState();

  const handleDataChange = ({detail}) => {
    setInput(detail.value);
  };

  const parseData = async () => {
    const parsed = await simpleParser(input);
    // console.log(parsed);
    // const headers = parsed.headers;
    // headers.forEach((v,k) => {
    //   console.log(k);
    //   if (typeof v === 'string') {
    //     console.log(v);
    //   } else if (typeof v === 'object') {
    //     console.log(v.value);
    //   }
    // });
    const addressHeaders = {
      "from": "From",
      "to": "To",
      "cc": "Cc",
      "bcc": "Bcc",
      "reply-to": "Reply-To",
      "in-reply-to": "In-Reply-To",
      "return-path": "Return-Path"
    };
    const tableItemsArray = [];
    for (const itemKey in addressHeaders) {
      if (parsed.headers.has(itemKey)) {
        const textValue = parsed.headers.get(itemKey)["text"];
        tableItemsArray.push({
          key: addressHeaders[itemKey],
          value: textValue
        });
      }
    };
    const textHeaders = {
      "message-id": "Message-ID",
      "subject": "Subject"
    };
    for (const itemKey in textHeaders) {
      if (parsed.headers.has(itemKey)) {
        const textValue = parsed.headers.get(itemKey);
        tableItemsArray.push({
          key: textHeaders[itemKey],
          value: textValue
        });
      }
    };
    setParsedHeader(tableItemsArray);
    setParsedContent({
      textContent: parsed.text,
      htmlContent: parsed.html
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const err = new Error();
    try {
      parseData();
    } catch (error) {
      setFetchFailed(true);
      setErrMsg(error.message);
    }
    setIsLoading(false);
  };

  const failFlash = (
    <Flashbar
      items={[{
      header: "Fetch API execution failed",
      type: "error",
      content: (<>{errMsg}</>),
      dismissible: true,
      onDismiss: () => setFetchFailed(false),
      id: "fetch_failed"
      }]}
    />
  );

  const emptyBox = (
    <Box textAlign="center" color="inherit">
      <b>No resources</b>
      <Box
        padding={{ bottom: "s" }}
        variant="p"
        color="inherit"
      >
        No resources to display.
      </Box>
    </Box>
  );

  const TextContentTab = () => {
    if (parsedContent.textContent) {
      return (
        <AceEditor
        mode="text"
        theme="dawn"
        value={parsedContent.textContent}
        width={null}
        maxLines={50}
        showGutter={false}
        highlightActiveLine={false}
        readOnly={true}
        showPrintMargin={false}
        enableBasicAutocompletion={false}
      />
      );
    } else {
      return (
        emptyBox
      );
    }
  }
  const HtmlContentTab = () => {
    if (parsedContent.htmlContent) {
      return (
        <AceEditor
        mode="html"
        theme="dawn"
        value={parsedContent.htmlContent}
        width={null}
        maxLines={50}
        showGutter={false}
        highlightActiveLine={false}
        readOnly={true}
        showPrintMargin={false}
        enableBasicAutocompletion={false}
      />
      );
    } else {
      return (
        emptyBox
      );
    }
  }
  const Tools = () => {
    return (
      <HelpPanel
        header={<h2>Email Analyzer</h2>}
      >
        <div>
          <p>
            メールソースを解析して情報を表示します。一部ヘッダはMIMEデコードします。
          </p>
          <h3>Mail source</h3>
          <p>
            メールソースを入力してください。本文なしのヘッダ部だけでもOKです。
          </p>
          <h3>Headers</h3>
          <p>
            メールソースから以下のヘッダを抽出して表示します。
          </p>
          <ul>
            <li>From</li>
            <li>To</li>
            <li>Cc</li>
            <li>Bcc</li>
            <li>Reply-To</li>
            <li>In-Reply-To</li>
            <li>Return-Path</li>
            <li>Message-ID</li>
            <li>Subject</li>
          </ul>
          <h3>Body</h3>
          <p>
            メールソースのボディ（本文）をデコードして表示します。
          </p>
        </div>
      </HelpPanel>
    )
  }
  return (
    <AppLayout
      toolsOpen={toolsOpen}
      onToolsChange={({ detail }) => setToolsOpen(detail.open)}
      navigation={<MenuSideNavigation/>}
      tools={<Tools/>}
      content={
        <ContentLayout
          header={
            <Header
              variant="h1"
              description="メールソースの解析ツール"
            >
              Email Analyzer
            </Header>
          }
        >
          <SpaceBetween size="s">
            <Container
              header={
                <Header
                  variant="h2"
                  info={
                  <Link 
                    variant="info"
                    onFollow={() => setToolsOpen(true)}
                  >
                    Info
                  </Link>
                  }
                >
                  Mail source
                </Header>
                }
            >
              <Form
                actions={
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button 
                      onClick={() => setInput()}
                      disabled={!input}
                    >
                      Clear
                    </Button>
                    <Button 
                      variant="primary"
                      onClick={handleSubmit}
                      disabled={!input}
                      loading={isLoading}
                    >
                      Analyze
                    </Button>
                  </SpaceBetween>
                }
              >
                <FormField
                  description="メールソースを入力してください"
                  //label="Mail source"
                  stretch
                >
                  <Textarea
                    onChange={handleDataChange}
                    value={input}
                  />
                </FormField>          
              </Form>
            </Container>
            {fetchFailed && failFlash } 
            { 
              parsedHeader.length > 0 &&
              <Table
                columnDefinitions={[
                  {
                    id: "key",
                    header: "Header key",
                    cell: item => item.key || "-"
                  },
                  {
                    id: "value",
                    header: "Header value",
                    cell: item => item.value || "-"
                  },
                ]}
                items={parsedHeader}
                loadingText="Loading resources"
                sortingDisabled
                empty={emptyBox}
                header={
                  <Header
                    info={
                      <Link 
                        variant="info"
                        onFollow={() => setToolsOpen(true)}
                      >
                        Info
                      </Link>
                    }
                  > 
                    Headers
                  </Header>
                }
              />
            }
            {
              parsedContent &&
              <Container
                header={
                  <Header
                    variant="h2"
                    info={
                      <Link 
                        variant="info"
                        onFollow={() => setToolsOpen(true)}
                      >
                        Info
                      </Link>
                    }  
                  >
                    Body
                  </Header>
                  }
              >
                <Tabs
                  tabs={[
                    {
                      label: "text/plain",
                      id: "text",
                      content: <TextContentTab/>,
                      disabled: !parsedContent.textContent
                    },
                    {
                      label: "text/html",
                      id: "html",
                      content: <HtmlContentTab/>,
                      disabled: !parsedContent.htmlContent
                    }
                  ]}
                />
              </Container>
            }
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}