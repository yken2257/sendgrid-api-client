import React, { useEffect } from "react";
import ace from "ace-builds/src-noconflict/ace";
import 'ace-builds/webpack-resolver'
import "ace-builds/src-noconflict/theme-dawn";
import "ace-builds/src-noconflict/theme-tomorrow_night_bright";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/worker-json";
import "ace-builds/css/ace.css";
import "ace-builds/css/theme/dawn.css";
import "ace-builds/css/theme/tomorrow_night_bright.css";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  CodeEditor,
  Container,
  Grid,
  Header,
  Input,
  SpaceBetween,
  Tabs
} from "@cloudscape-design/components";
  
ace.config.set("useStrictCSP", true);
ace.config.set("loadWorkerFromBlob", false);

export default function RequestForm(props) {
  const api = props.api;
  const headers = props.request.headers;
  const queryParams = props.request.queryParams;
  const bodyInput = props.request.bodyInput;
  const [preferences, setPreferences] = React.useState(undefined);

  let badgeColor = null;
  switch (props.request.method.value) {
    case 'GET':
      badgeColor = {'color': 'green'};
      break;
    case 'POST':
      badgeColor = {'color': 'blue'};
      break;
    case 'DELETE':
      badgeColor = {'color': 'red'}
      break;
    default:
      badgeColor = {};
  }

  useEffect(() => {
    try {
      JSON.parse(bodyInput);
      props.onRequestChange("isBodyValid", true);
    } catch (e) {
      props.onRequestChange("isBodyValid", false);
    }
  }, [bodyInput]);

  const handleBodyChange = (event) => {
    props.onRequestChange("bodyInput", event.detail.value);
    try {
      const parsed = JSON.parse(event.detail.value);
      props.onRequestChange("body", parsed);
    } catch (e) {
    }
  };

  const handleParamChange = (index, param, param_name, isValue) => (event) => {
    const keyValuePairs = [...param];
    if (isValue) {
      keyValuePairs[index]["value"] = event.detail.value;
    } else {
      keyValuePairs[index]["name"] = event.detail.value;
    }
    props.onRequestChange(param_name, keyValuePairs);
  };

  const handleParamInclude = (index, param, param_name) => (event) => {
    const included = event.detail.checked;
    const keyValuePairs = [...param];
    keyValuePairs[index]["included"] = included;
    props.onRequestChange(param_name, keyValuePairs);
  };

  const handleParamRemove = (index, param, param_name) => () => {
    const keyValuePairs = [...param];
    keyValuePairs.splice(index, 1);
    props.onRequestChange(param_name, keyValuePairs);
  };

  const handleParamAdd = (param, param_name) => {
    const keyValuePairs = [...param];
    keyValuePairs.push({ name: "", value: "", included: true });
    props.onRequestChange(param_name, keyValuePairs);
  };

  const handleSubmit = (event) => {
    props.onSubmitRequest(event);
  };

  const paramsForm = (param, param_name) =>
    param.map((pair, index) => (
      <SpaceBetween key={index} size="s" direction="horizontal">
        <div style={{position: "relative", top: 6}}>
        <Checkbox
          checked={pair.included}
          onChange={handleParamInclude(index, param, param_name)}
        />
        </div>
        <Input
          name="name"
          value={pair.name}
          onChange={handleParamChange(index, param, param_name, false)}
        />
        <Input
          name="value"
          value={pair.value}
          onChange={handleParamChange(index, param, param_name, true)}
        />
        <Button
          iconName="status-negative"
          variant="icon"
          onClick={handleParamRemove(index, param, param_name)}
        />
      </SpaceBetween>
    ));

  const addButton = (param, param_name) => (
    <>
      <Button
        onClick={() => handleParamAdd(param, param_name)}
      >
        Add new item
      </Button>
    </>
  );

  const submitButton = () => (
    <Box float="right">
      <form onSubmit={handleSubmit}>
        <Button
          type="submit"
          variant="primary"
          disabled={!(props.request.isUrlValid && props.request.isBodyValid)}
        >
          Submit
        </Button>
      </form>
    </Box>
  );

  return (
    <SpaceBetween size="xxs">
      <Container
      header={
          <Header
            variant="h2"
            description={api.description}
          >
            {api.summary}
          </Header>
      }>
        <Grid gridDefinition={[{ colspan: 0 }, { colspan: 9 }]}>
          <div style={{position: "relative", top: 6}}>
            <Badge {...badgeColor}>
              <div style={{fontSize: 18}}>
                {props.request.method.value}
              </div>
            </Badge>
          </div>
          <Input
            type="url"
            placeholder="https://"
            value={props.request.urlInput}
            readOnly
          />
        </Grid>
      </Container>
      <Tabs
        variant="container"
        tabs={[
          {
            label: "HEADER",
            id: "header",
            content: (
              <SpaceBetween size="xs">
                {paramsForm(headers, "headers")}
                {addButton(headers, "headers")}
                {submitButton()}
              </SpaceBetween>
            )
          },
          {
            label: "QUERY PARAMS",
            id: "query",
            content: (
              <SpaceBetween size="xs">
                {paramsForm(queryParams, "queryParams")}
                {addButton(queryParams, "queryParams")}
                {submitButton()}
              </SpaceBetween>
            )
          },
          {
            label: "BODY",
            id: "body",
            content: (
              <SpaceBetween size="xs">
              <CodeEditor
                ace={
                  props.request.method.value === "GET" || props.request.method.value === "DELETE"
                  ? undefined
                  : ace
                }
                language="json"
                value={props.request.bodyInput}
                themes={{ light: ["dawn"], dark: ["tomorrow_night_bright"] }}
                editorContentHeight={120}
                //onEditorContentResize={handleBodyChange}
                preferences={preferences}
                onPreferencesChange={(e) => setPreferences(e.detail)}
                onDelayedChange={handleBodyChange}
                i18nStrings={{
                  loadingState: "Loading code editor",
                  errorState: `${props.request.method.value} request must not have body`,
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
              {submitButton()}
              </SpaceBetween>
            )
          }
        ]}
      />
    </SpaceBetween>
  );
}
