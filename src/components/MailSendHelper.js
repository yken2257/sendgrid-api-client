import  { useState, useContext, useEffect } from "react";
import { useLocation, useLoaderData } from "react-router-dom";
import {
  AppLayout,
  Button,
  CodeEditor,
  Container,
  ContentLayout,
  Flashbar,
  Form,
  FormField,
  Header,
  Input,
  Popover,
  SpaceBetween,
  StatusIndicator
} from "@cloudscape-design/components";

import { Amplify, API } from "aws-amplify";
import awsconfig from "../aws-exports";
Amplify.configure(awsconfig);

import ResponseContainer from "./ResponseContainer";
import MailSendSideNavigation from "./MailSendSideNavigation";
import { ApiKeyContext } from "./ApiKeyProvider";

import ace from "ace-builds/src-noconflict/ace";
import 'ace-builds/webpack-resolver'
import "ace-builds/src-noconflict/theme-dawn";
import "ace-builds/src-noconflict/theme-tomorrow_night_bright";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/worker-json";

ace.config.set("useStrictCSP", true);
ace.config.set("loadWorkerFromBlob", false);

export default function MailSendHelper () {
  const sample = useLoaderData();
  const location = useLocation();
  const { apiKey, setApiKey } = useContext(ApiKeyContext);
  const [requestJson, setRequestJson] = useState(JSON.stringify(sample.request, null, 4));
  const [response, setResponse] = useState();
  const [fetchFailed, setFetchFailed] = useState(false);
  const [errMsg, setErrMsg] = useState();
  const [isJsonValid, setIsJsonValid] = useState(false);
  const [preferences, setPreferences] = useState(undefined);
  const [editorHeight, setEditorHeight] = useState();
  const [curl, setCurl] = useState("");

  useEffect(() => {
    setRequestJson(JSON.stringify(sample.request, null, 4))
    setResponse();
  }, [location.pathname]);

  useEffect(() => {
    let curlStr = `curl -i --request POST \\\n--url https://api.sendgrid.com/v3/mail/send \\\n`;
    curlStr += `--header "Authorization: Bearer ${apiKey}" \\\n`
    curlStr += `--header "Content-Type: application/json" \\\n`
    curlStr += `--data '${requestJson}'` 
    setCurl(curlStr);
  }, [requestJson]);

  const copyToClipboard = async (text) => {
    await global.navigator.clipboard.writeText(text);
  };

  const ApiSubmitButton = () => {
    if (apiKey.match(/^SG\.[^.]+\.[^.]+$/)) {
      return (
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!isJsonValid}
        >
          Submit
        </Button>
      );
    } else {
      return (
        <Popover
          dismissButton={false}
          position="right"
          size="small"
          triggerType="custom"
          content={
            <StatusIndicator type="warning">
              Set API key in menu bar
            </StatusIndicator>
          }
        >
          <Button variant="primary" disabled>Submit</Button>
        </Popover>
      );  
    }
  };

  const FailFlash = () => (
    <Flashbar
      items={[{
      header: "Fetch API execution failed",
      type: "error",
      content: errMsg,
      dismissible: true,
      onDismiss: () => setFetchFailed(false),
      id: "fetch_failed"
      }]}
    />
  );

  const handleInputChange = ({detail}) => {
    try {
      const parsed = JSON.parse(detail.value);
      const formatted = JSON.stringify(parsed, null, 4);
      setRequestJson(formatted);
      setIsJsonValid(true);
    } catch (e) {
      setIsJsonValid(false);
    }  
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const headers = {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
      const endpointUrl = new URL("https://api.sendgrid.com/v3/mail/send");
      const body = {
        resource: endpointUrl,
        options: {
          method: "POST",
          headers: headers,
          body: requestJson  
        }
      };
      const apiName = 'httpClient';
      const path = '/apicall';
      const myInit = {
        body: body,
        headers: {}
      };
      const res = await API.post(apiName, path, myInit);
      const ok = res.ok;
      const status = res.status;
      const statusText = res.statusText;
      const responseHeaders = res.headers;
      const contentType = res.contentType;
      const responseBody = res.body;
      setResponse({
        ok: ok,
        status: status,
        statusText: statusText,
        headers: responseHeaders,
        contentType: contentType,
        body: responseBody
      });
    } catch (error) {
      setFetchFailed(true);
      setErrMsg(error.message);
    }
  };

  return (
    <AppLayout
    toolsHide={true}
    navigation={<MailSendSideNavigation/>}
    content={
      <ContentLayout
        header={
          <Header
            variant="h1"
            description="Mail Send APIのリクエスト編集補助ツール"
            actions={
              <FormField
                label="API Key"
                errorText={apiKey.match(/^SG\.[^.]+\.[^.]+$/)? "" : "Set API key in menu bar."}
              >
                <Popover
                  dismissButton={false}
                  size="small"
                  triggerType="custom"
                  content={
                    <StatusIndicator type="info">Set in menu bar</StatusIndicator>
                  }
                >
                  <Input value={apiKey} disabled/>
                </Popover>
              </FormField>
            }
          >
            Mail Send Helper
          </Header>
        }
      >
        <SpaceBetween size="xs">
          <Container
            header={
              <Header
                variant="h2"
              >
                {sample.name}
              </Header>
            }        
          >
            <Form
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Popover
                    size="small"
                    position="top"
                    triggerType="custom"
                    dismissButton={true}
                    content={<StatusIndicator type="success">Copied!</StatusIndicator>}
                  >
                    <Button
                      iconAlign="left"
                      iconName="copy"
                      disabled={!isJsonValid}
                      onClick={() => copyToClipboard(requestJson)}
                    >
                      Copy JSON
                    </Button>
                  </Popover>
                  <Popover
                    size="small"
                    position="top"
                    triggerType="custom"
                    dismissButton={true}
                    content={<StatusIndicator type="success">Copied!</StatusIndicator>}
                  >
                    <Button
                      iconAlign="left"
                      iconName="copy"
                      disabled={!isJsonValid}
                      onClick={() => copyToClipboard(curl)}
                    >
                      Copy request as cURL
                    </Button>
                  </Popover>
                  <ApiSubmitButton/>
                </SpaceBetween>
              }
            >
              <CodeEditor
                ace={ace}
                language="json"
                value={requestJson}
                themes={{ light: ["dawn"], dark: ["tomorrow_night_bright"] }}
                editorContentHeight={400}
                onEditorContentResize={({detail}) => setEditorHeight(detail.height)}
                preferences={preferences}
                onPreferencesChange={(e) => setPreferences(e.detail)}
                onDelayedChange={handleInputChange}
                i18nStrings={{
                  errorState: "Error",
                  editorGroupAriaLabel: "Code editor",
                  statusBarGroupAriaLabel: "Status bar",
                  cursorPosition: (row, column) => `Ln ${row}, Col ${column}`,
                  errorsTab: "Errors",
                  warningsTab: "Warnings",
                  preferencesButtonAriaLabel: "Preferences",
                  paneCloseButtonAriaLabel: "Close",
                  preferencesModalHeader: "Preferences",
                  preferencesModalCancel: "Cancel",
                  preferencesModalConfirm: "Confirm",
                  preferencesModalWrapLines: "Wrap lines",
                  preferencesModalTheme: "Theme",
                  preferencesModalLightThemes: "Light themes",
                  preferencesModalDarkThemes: "Dark themes"
                }}
              />
            </Form>
          </Container>
          {response && 
            <ResponseContainer 
              response={response}
              onCopy={() => copyToClipboard(response.body)}
              handleResponseDismiss={() => setResponse()}
            />
          }
          {fetchFailed && <FailFlash/> }
        </SpaceBetween>
      </ContentLayout>
    }
  />
  );
}