import { SideNavigation } from "@cloudscape-design/components";
import { navigationArray } from "../parseOpenApi";

export default function ApiSideNavigation() {
  return (
    <SideNavigation
      activeHref={document.location.hash}
      header={{ href: "/#/index", text: "Home" }}
      items={[
        { type: "link", text: "Custom Request", href: "#/api/custom" },
        { type: "divider" },
        {
          type: "section",
          text: "SendGrid Web API",
          defaultExpanded: true,
          items: navigationArray
        },
        { type: "divider" },
      ]}
    />
  );
}
