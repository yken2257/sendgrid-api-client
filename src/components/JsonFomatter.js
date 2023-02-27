import  { useState } from "react";
import {
  AppLayout,
  Button,
  CodeEditor,
  Container,
  ContentLayout,
  Header,
  Popover,
  SideNavigation,
  SpaceBetween,
  StatusIndicator
} from "@cloudscape-design/components";
import MenuSideNavigation from "./MenuSideNavigation";

import ace from "ace-builds/src-noconflict/ace";
import 'ace-builds/webpack-resolver'
import "ace-builds/src-noconflict/theme-dawn";
import "ace-builds/src-noconflict/theme-tomorrow_night_bright";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/worker-json";

ace.config.set("useStrictCSP", true);
ace.config.set("loadWorkerFromBlob", false);

export default function JsonFormatter () {
  const [json, setJson] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [preferences, setPreferences] = useState(undefined);
  const [editorHeight, setEditorHeight] = useState();

  const copyToClipboard = async (text) => {
    await global.navigator.clipboard.writeText(text);
  };


  const handleInputChange = ({detail}) => {
    try {
      const parsed = JSON.parse(detail.value);
      const formatted = JSON.stringify(parsed, null, 4);
      setJson(formatted);
      setIsValid(true);
    } catch (e) {
      setIsValid(false);
    }  
  };

  return (
    <AppLayout
    toolsHide={true}
    navigation={<MenuSideNavigation/>}
    content={
      <ContentLayout
        header={
          <Header
            variant="h1"
            description="JSONデータの自動整形ツール"
          >
            JSON Formatter
          </Header>
        }
      >
        <Container
          header={
            <Header
              variant="h2"
              actions={
                <SpaceBetween
                  direction="horizontal"
                  size="xs"
                >
                  <Button 
                    onClick={() => setJson("")}
                  >
                    Clear
                  </Button>
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
                      variant="primary"
                      onClick={() => copyToClipboard(json)}
                    >
                      Copy
                    </Button>
                  </Popover>
                </SpaceBetween>
              }
            ></Header>
          }        
        >
        <CodeEditor
          ace={ace}
          language="json"
          value={json}
          themes={{ light: ["dawn"], dark: ["tomorrow_night_bright"] }}
          editorContentHeight={600}
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
        </Container>
      </ContentLayout>
    }
  />
  );
}