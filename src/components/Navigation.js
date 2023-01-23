import { SideNavigation, Badge } from "@cloudscape-design/components";
import { navigationArray } from "../parseOpenApi";

export default function Navigation() {
  return (
    <SideNavigation
      activeHref={document.location.hash}
      header={{ href: "/", text: "Home" }}
      items={[
        { type: "link", text: "Custom", href: "#/custom" },
        { type: "divider" },
        ...navigationArray,
        { type: "divider" },
        {
          type: "link",
          text: "Notifications",
          href: "#/",
          info: <Badge color="red">23</Badge>
        },
        {
          type: "link",
          text: "Documentation",
          href: "https://docs.sendgrid.com/api-reference",
          external: true
        }
      ]}
    />
  );
}
