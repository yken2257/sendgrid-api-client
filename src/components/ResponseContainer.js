import {
    Alert,
    Box,
    Container,
    Header,
  } from "@cloudscape-design/components";

export default function ResponseContainer(props) {
    return (
      <Container header={<Header variant="h4">Response</Header>}>
        <Alert
          type={props.response.ok ? "success" : "warning"}
          header={
            <Header>
              {props.response.status} {props.response.statusText}
            </Header>
          }
        ></Alert>
        <Box variant="pre">
          {props.response.contentType === "application/json"
            ? JSON.stringify(JSON.parse(props.response.body), null, 2)
            : props.response.body}
        </Box>
      </Container>
    );
  }
