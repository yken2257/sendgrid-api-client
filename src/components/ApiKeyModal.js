import { 
    Box,
    Button,
    FormField,
    Input,
    Modal,
    SpaceBetween
} from "@cloudscape-design/components";

export default function ApiKeyMordal(props) {
  return (
    <Modal
      onDismiss={props.onDismissApiKeyMordal}
      visible={props.visible}
      closeAriaLabel="Close modal"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button 
              variant="link"
              onClick={props.onDismissApiKeyMordal}
              >
                Cancel
            </Button>
            <Button 
              variant="primary"
              onClick={props.onDismissApiKeyMordal}
            >
              Ok
            </Button>
          </SpaceBetween>
        </Box>
      }
      header="API Key"
    >
      <FormField
        label="Enter your API key"
        //description="This is a description"
      >
        <Input 
          onChange={({ detail }) => props.onChangeApiKey(detail.value)}
          value={props.apiKey}    
        />
      </FormField>
    </Modal>
  );
}