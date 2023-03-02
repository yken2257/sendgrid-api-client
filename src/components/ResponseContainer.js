import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/theme-dawn";
import {
    Alert,
    Button,
    Container,
    Grid,
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
    const headersString = Object.entries(props.response.headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    
    return (
      <SpaceBetween size="xxs">
        <Alert
          type={props.response.ok ? "success" : "warning"}
          header={
            <Header>
              {props.response.status} {props.response.statusText}
            </Header>
          }
          dismissible
          onDismiss={props.handleResponseDismiss}
        ></Alert>
        <Grid
          gridDefinition={[
            { colspan: { default: 12, xxs: 6 } },
            { colspan: { default: 12, xxs: 6 } }
          ]}
        >
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
                      onClick={props.onCopy}
                    >
                      Copy body
                    </Button>
                  </Popover>
                }
              >
                Body
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
          <Container 
            header={
              <Header 
                variant="h3"
              >
                Header
              </Header>
            }
          >
            <AceEditor
              mode="text"
              theme="dawn"
              value={headersString}
              width={null}
              maxLines={50}
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
