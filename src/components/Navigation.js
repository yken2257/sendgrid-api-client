import { SideNavigation, Badge } from "@cloudscape-design/components";
import { navigationArray } from "../parseOpenApi";

export default function Navigation() {
  return (
    <SideNavigation
      activeHref={document.location.hash}
      header={{ href: "#/custom", text: "Index" }}
      items={[
        { type: "link", text: "Custom", href: "#/custom" },
        { type: "divider" },
        ...navigationArray,
        { type: "divider" },
        {
          type: "link",
          text: "Notifications",
          href: "#/notifications",
          info: <Badge color="red">23</Badge>
        },
        {
          type: "link",
          text: "Documentation",
          href: "https://example.com",
          external: true
        }
      ]}
    />
  );
}
