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
  Grid,
  Header,
  Input,
  Popover,
  Select,
  SideNavigation,
  SpaceBetween,
  StatusIndicator,
  Textarea
} from "@cloudscape-design/components";
import { ApiKeyContext } from "./ApiKeyProvider";
import { Amplify, API } from "aws-amplify";
import awsconfig from "../aws-exports";
Amplify.configure(awsconfig);

import { simpleParser, MailParser } from "mailparser";

export default function EmailDecoder () {
  const { apiKey, setApiKey } = useContext(ApiKeyContext);
  const [input, setInput] = useState(undefined);
  const [output, setOutput] = useState(undefined);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [errMsg, setErrMsg] = useState();

  const handleDataChange = ({detail}) => {
    setInput(detail.value);
  };

  const parseData = async () => {
    // console.log(input)
    // const apiName = "EmailDecodeApi";
    // const path = "/decode";
    // const params = {
    //   body: String.raw`${input}`,
    // };
    // const response = await API.post(apiName, path, params);
    // console.log(response);
    // setOutput(response.headers[0]["value"]);

    const parsed = await simpleParser(input);
    console.log(parsed);
    const headers = parsed.headers;
    headers.forEach((v,k) => {
      console.log(k);
      if (typeof v === 'string') {
        console.log(v);
      } else if (typeof v === 'object') {
        console.log(v.value);
      }
    });
    
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const err = new Error();
    try {
      parseData();
    } catch (error) {
      setFetchFailed(true);
      setErrMsg(error.message);
    }
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

  return (
    <AppLayout
    toolsHide={true}
    navigation={
      <SideNavigation
        activeHref={document.location.hash}
        header={{ href: "/#/index", text: "Home" }}
      />}
    content={
      <ContentLayout
        header={
          <Header
            variant="h1"
            description="メールヘッダのデコードツール"
          >
            Email Decoder
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Container
            header={
              <Header variant="h2">
                Mail Source
              </Header>
              }
          >
            <Form
              actions={
                <Button 
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={!input}
                >
                  Decode
                </Button>
              }
              // header={<Header variant="h2">Fetch data</Header>}
            >
              <FormField
                description="This is a description."
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
            output &&
            <Container
              header={
                <Header variant="h2">
                  Result
                </Header>
              }
            > 
              {output}
            </Container>
          }
        </SpaceBetween>
      </ContentLayout>
    }
  />
  );
}