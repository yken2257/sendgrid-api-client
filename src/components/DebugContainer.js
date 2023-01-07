import {
    Box,
    Container,
    Header,
  } from "@cloudscape-design/components";

export default function DebugContainer(props) {
    return (
      <Container header={<Header variant="h4">DEBUG</Header>}>
        <Box variant="pre">{JSON.stringify(props.request, null, 2)}</Box>
      </Container>
    );
  }
