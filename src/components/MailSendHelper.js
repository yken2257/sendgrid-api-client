import  { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation, useLoaderData } from "react-router-dom";
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
  SideNavigation,
  SpaceBetween,
  StatusIndicator
} from "@cloudscape-design/components";

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
  const [isValid, setIsValid] = useState(false);
  const [preferences, setPreferences] = useState(undefined);
  const [editorHeight, setEditorHeight] = useState();

  useEffect(() => {
    setRequestJson(JSON.stringify(sample.request, null, 4))
  }, [location.pathname]);

  const copyToClipboard = async (text) => {
    await global.navigator.clipboard.writeText(text);
  };

  const ApiSubmitButton = () => {
    if (apiKey.match(/^SG\.[^.]+\.[^.]+$/)) {
      return (
        <Button
          variant="primary"
          onClick={handleSubmit}
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
      setIsValid(true);
    } catch (e) {
      setIsValid(false);
    }  
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const err = new Error();
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
      const res = await fetch(process.env.FETCH_URL, {
        method: "POST",
        body: JSON.stringify(body)
      });
      const apiResponse = await res.json();
      const ok = apiResponse.ok;
      const status = apiResponse.status;
      const statusText = apiResponse.statusText;
      const responseHeaders = apiResponse.headers;
      const contentType = apiResponse.contentType;
      const responseBody = apiResponse.body;
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
                <SpaceBetween direction="horizontal" size="l">
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
                      onClick={() => copyToClipboard(requestJson)}
                    >
                      Copy
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
            />
          }
          {fetchFailed && <FailFlash/> }
        </SpaceBetween>
      </ContentLayout>
    }
  />
  );
}