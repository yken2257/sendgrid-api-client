import React, { useState, useEffect } from "react";
import AceEditor from 'react-ace';
import ace from "ace-builds/src-noconflict/ace";
import 'ace-builds/webpack-resolver'
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/theme-dawn";
import "ace-builds/src-noconflict/theme-tomorrow_night_bright";
import "ace-builds/src-noconflict/mode-sh";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/worker-json";
import "ace-builds/css/ace.css";
import "ace-builds/css/theme/dawn.css";
import "ace-builds/css/theme/tomorrow_night_bright.css";
import {
  Box,
  Button,
  Checkbox,
  CodeEditor,
  Container,
  Grid,
  Header,
  Input,
  Popover,
  Select,
  SpaceBetween,
  StatusIndicator,
  Tabs
} from "@cloudscape-design/components";
  
ace.config.set("useStrictCSP", true);
ace.config.set("loadWorkerFromBlob", false);

export default function RequestForm(props) {
  const headers = props.request.headers;
  const queryParams = props.request.queryParams;
  const [activeTab, setActiveTab] = React.useState("header");
  const [preferences, setPreferences] = React.useState(undefined);
  const [editorHeight, setEditorHeight] = React.useState();

  const handleUrlChange = ({ detail }) => {
    props.onRequestChange("urlInput", detail.value);
    try {
      const url = new URL(detail.value);
      const searchParams = url.searchParams;
      const queryList = []; //[...queryParams];
      searchParams.forEach((value, key) => {
        queryList.push({ name: key, value: value, included: true });
      });
      queryParams.forEach((name, value) => {
        if (queryList.some((query) => query.name === name)) {
          searchParams.set(name, value);
        }
      });
      props.onRequestChange("urlEncoded", url);
      props.onRequestChange("queryParams", queryList);
      if (url.protocol === "http:" || url.protocol === "https:") {
        props.onRequestChange("isUrlValid", true);
      } else {
        props.onRequestChange("isUrlValid", false);
      }
    } catch {
      props.onRequestChange("isUrlValid", false);
    }
  };

  const handleMethodChange = (event) => {
    props.onRequestChange("method", event.detail.selectedOption);
    if (event.detail.selectedOption.value === "GET" || event.detail.selectedOption.value === "DELETE") {
      setActiveTab("header");
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
    keyValuePairs.push({ name: "", value: "", included: true, canEditKey: true, canDelete: true});
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

  const canSubmit = (props.request.isUrlValid && props.request.isBodyValid);

  const submitButton = () => (
    <Box float="right">
      <form onSubmit={handleSubmit}>
        <Button
          type="submit"
          variant="primary"
          disabled={!canSubmit}
          loading={props.isLoading}
        >
          Submit
        </Button>
      </form>
    </Box>
  );

  const paramTabs = [
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
    }
  ];

  if (props.request.method.value !== "GET" && props.request.method.value !== "DELETE") {
    paramTabs.push({
      label: "BODY",
      id: "body",
      content: (
        <SpaceBetween size="xs">
        <CodeEditor
          ace={ace}
          language="json"
          value={props.request.bodyInput}
          themes={{ light: ["dawn"], dark: ["tomorrow_night_bright"] }}
          editorContentHeight={120}
          onEditorContentResize={({detail}) => setEditorHeight(detail.height)}
          preferences={preferences}
          onPreferencesChange={(e) => setPreferences(e.detail)}
          onDelayedChange={props.onBodyChange}
          i18nStrings={{
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
    });
  }

  return (
    <SpaceBetween size="xs">
      <Container
      header={
          <Header
            variant="h2"
            description="Custom Request"
          >
            Custom Request
          </Header>
      }>
        <Grid gridDefinition={[{ colspan: 0 }, { colspan: 9 }]}>
          <Select
            selectedOption={props.request.method}
            onChange={handleMethodChange}
            options={[
              { value: "GET" },
              { value: "POST" },
              { value: "PUT" },
              { value: "PATCH" },
              { value: "DELETE" }
            ]}
          />
          <Input
            type="url"
            placeholder="https://api.example.com/users"
            value={props.request.urlInput}
            onChange={handleUrlChange}
          />
        </Grid>
      </Container>
      <Grid
        gridDefinition={[
          { colspan: { default: 12, xxs: 6 } },
          { colspan: { default: 12, xxs: 6 } }
        ]}
      >
        <Tabs
          variant="container"
          tabs={paramTabs}
          activeTabId={activeTab}
          onChange={({detail}) => setActiveTab(detail.activeTabId)}
        />
        <Container
          header={
            <Header
              variant="h3"
              actions={
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
                    disabled={!canSubmit}
                    onClick={props.onCopy}
                  >
                    Copy cURL
                  </Button>
                </Popover>
              }
            >
              cURL example
            </Header>
          }
        >
          <AceEditor
            mode="sh"
            theme="textmate"
            value={props.request.curl}
            width={null}
            maxLines={10}
            showGutter={false}
            highlightActiveLine={false}
            readOnly={true}
            showPrintMargin={false}
            enableBasicAutocompletion={false}
          />
        </Container>
      </Grid>
    </SpaceBetween>
  );
}
