import {
  AppLayout,
  Cards,
  ContentLayout,
  Header,
  Icon,
  Link,
} from "@cloudscape-design/components";

export default function Home() {
  const MenuCards = () => {
    return (
      <Cards
        ariaLabels={{
          itemSelectionLabel: (e, t) => `select ${t.name}`,
          selectionGroupLabel: "Item selection"
        }}
        cardDefinition={{
          header: item => (
            <>
            <span style={{position: "relative", top: -8}}>
              <Icon name={item.icon} size="big" />
            </span>
            <span style={{position: "relative", left: 8}}>
              <Link 
                fontSize="heading-m"
                href={item.href}
              >
                  {item.name}
                </Link>
            </span>
            </>
          ),
          sections: [
            {
              id: "description",
              // header: "Description",
              content: item => item.description
            },
          ]
        }}
        cardsPerRow={[
          { cards: 1 },
          { minWidth: 500, cards: 2 }
        ]}
        items={[
          {
            name: "API Client - SendGrid Web API v3",
            alt: "sendgrid-api-client",
            description: "SendGridのWeb APIを試す",
            icon: "upload-download",
            href: "#/api/v3",
          },
          {
            name: "API Client - Custom",
            alt: "custom-api-client",
            description: "任意の外部APIを呼び出す",
            icon: "upload-download",
            href: "#/api/custom",
          },
          // {
          //   name: "API Client - Reseller API",
          //   alt: "reseller-api-client",
          //   description: "Reseller APIを呼び出す",
          //   icon: "upload-download",
          //   href: "#",
          // },
          {
            name: "Activity Viewer",
            alt: "activity-viewer",
            description: "アカウントのActivityを見る",
            icon: "search",
            href: "#/activity",
          },
          {
            name: "Stats Viewer",
            alt: "stats-viewer",
            description: "アカウントのGlobal Statsを見る",
            icon: "angle-up",
            href: "#/stats",
          },          
          {
            name: "Email Analyzer",
            alt: "email-analyzer",
            description: "メールソースをデコードする",
            icon: "envelope",
            href: "#/email-decode",
          },
          {
            name: "JSON Formatter",
            alt: "json-formatter",
            description: "JSONをきれいにする",
            icon: "script",
            href: "#/json",
          },
        ]}
        // loadingText="Loading resources"
        // empty={
        //   <Box textAlign="center" color="inherit">
        //     <b>No resources</b>
        //     <Box
        //       padding={{ bottom: "s" }}
        //       variant="p"
        //       color="inherit"
        //     >
        //       No resources to display.
        //     </Box>
        //     <Button>Create resource</Button>
        //   </Box>
        // }
        //header={<Header>Menu</Header>}
      />
    );
  }
  return (
    <AppLayout
    toolsHide={true}
    navigationHide={true}
    content={
      <ContentLayout
        header={
          <Header
            variant="h1"
          >
            Home
          </Header>
        }
      >
        <MenuCards/>
      </ContentLayout>
    }
  />
  );
}