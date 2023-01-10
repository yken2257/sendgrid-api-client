import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-dawn";
import {
    Container,
    Header,
    SpaceBetween
  } from "@cloudscape-design/components";

export default function DebugContainer(props) {
    return (
      <Container header={<Header variant="h4">DEBUG</Header>}>
        <SpaceBetween size="xs">
          <AceEditor
            mode="json"
            theme="dawn"
            value={JSON.stringify(props.request, null, 2)}
            width={null} // nullにしておくとwidthを外から変えられる
            minLines={10}
            maxLines={50}
            showGutter={false}
            readOnly={true}
            //focus={false}
            showPrintMargin={false}
            highlightActiveLine={false}
            enableBasicAutocompletion={false}
            // onLoad={editor => {
            //   // readOnlyでも表示されるカーソルを消す
            //   editor.renderer.$cursorLayer.element.style.opacity = 0;
            // }}
          />
          <AceEditor
            mode="json"
            theme="dawn"
            value={JSON.stringify(props.api, null, 2)}
            width={null} // nullにしておくとwidthを外から変えられる
            maxLines={50}
            showGutter={false}
            highlightActiveLine={false}
            readOnly={true}
            showPrintMargin={false}
            enableBasicAutocompletion={false}
          />
        </SpaceBetween>
      </Container>
    );
  }
