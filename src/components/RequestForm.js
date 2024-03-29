import React, { useState, useEffect, useContext } from "react";
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
  SpaceBetween,
  StatusIndicator,
  Tabs
} from "@cloudscape-design/components";
  
ace.config.set("useStrictCSP", true);
ace.config.set("loadWorkerFromBlob", false);

import { ApiKeyContext } from "./Contexts";

export default function RequestForm(props) {
  const api = props.api;
  const headers = props.request.headers;
  const queryParams = props.request.queryParams;
  const [activeTab, setActiveTab] = useState("header");
  const [preferences, setPreferences] = useState(undefined);
  const [editorHeight, setEditorHeight] = useState();
  const { selectedKey } = useContext(ApiKeyContext);

  useEffect(()=> {
    setActiveTab("header");
  }, [api]);

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
    keyValuePairs.push({ name: "", value: "", included: true, canEditKey: true, canDelete: true });
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
          readOnly={!pair.canEditKey}
        />
        {pair.name === "Authorization" ?
          <Popover
            dismissButton={false}
            position="right"
            size="small"
            triggerType="custom"
            content={
              <StatusIndicator type="info">Set from header</StatusIndicator>
            }
          >
            <Input
                name="value"
                value={pair.value}
                onChange={handleParamChange(index, param, param_name, true)}
                disabled
                invalid={!selectedKey}
              />
          </Popover>
        :
          <Input
            name="value"
            value={pair.value}
            onChange={handleParamChange(index, param, param_name, true)}
          />
        }
        {pair.canDelete && 
          <Button
            iconName="status-negative"
            variant="icon"
            onClick={handleParamRemove(index, param, param_name)}
          />
        }
        {pair.description &&
        <Popover
          position="right"
          size="small"
          triggerType="custom"
          content={pair.description}
        >
          <div style={{position: "relative", top: 5}}>
            <Button iconName="status-info" variant="inline-icon" />
          </div>
        </Popover>
        }
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

  const isPathParamFilled = pathParams => {
    if (pathParams.length === 0) {
      return true;
    } else if (pathParams.every(item => item.value !== "")) {
      return true;
    } else {
      return false;
    }
  }

  const canSubmit = (props.request.isUrlValid && props.request.isBodyValid && isPathParamFilled(props.request.pathParam) && props.canSubmit)

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
    }
  ];
  if (props.request.queryParams.length > 0) {
    paramTabs.push({
      label: "QUERY",
      id: "query",
      content: (
        <SpaceBetween size="xs">
          {paramsForm(queryParams, "queryParams")}
          {addButton(queryParams, "queryParams")}
          {submitButton()}
        </SpaceBetween>
      )
    });  
  }
  if (props.request.pathParam.length > 0) {
    paramTabs.push({
      label: "PATH",
      id: "path",
      content: (
        <SpaceBetween size="xs">
          <SpaceBetween size="s" direction="horizontal">
            <Input
              readOnly
              name="name"
              value={props.request.pathParam[0].name}
              onChange={handleParamChange(0, props.request.pathParam, "pathParam", false)}
            />
            <Input
              name="value"
              value={props.request.pathParam[0].value}
              onChange={handleParamChange(0, props.request.pathParam, "pathParam", true)}
            />
          </SpaceBetween>
          {submitButton()}
        </SpaceBetween>
      )
    });
  }
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
          editorContentHeight={180}
          onEditorContentResize={({detail}) => setEditorHeight(detail.height)}
          preferences={preferences}
          onPreferencesChange={(e) => setPreferences(e.detail)}
          onDelayedChange={props.onBodyChange}
          i18nStrings={{
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
  );
}
