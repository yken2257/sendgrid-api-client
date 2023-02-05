import { useState } from "react";
import { 
    Box,
    Button,
    FormField,
    Input,
    Modal,
    SpaceBetween
} from "@cloudscape-design/components";

export default function ApiKeyMordal(props) {
  const [tmpApiKey, setTmpApiKey] = useState(props.apiKey);

  const handleDismissMordal = () => {
    setTmpApiKey(props.apiKey);
    props.onDismissApiKeyMordal();
  }

  const handleRegisterApiKey = () => {
    props.onChangeApiKey(tmpApiKey);
    props.onDismissApiKeyMordal();
  };

  return (
    <Modal
      onDismiss={handleDismissMordal}
      visible={props.visible}
      closeAriaLabel="Close modal"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button 
              variant="link"
              onClick={handleDismissMordal}
              >
                Cancel
            </Button>
            <Button 
              variant="primary"
              onClick={handleRegisterApiKey}
            >
              OK
            </Button>
          </SpaceBetween>
        </Box>
      }
      header="API Key"
    >
      <FormField
        label="Register your API key"
        //description="This is a description"
      >
        <Input 
          onChange={({ detail }) => setTmpApiKey(detail.value)}
          value={tmpApiKey}    
        />
      </FormField>
    </Modal>
  );
}