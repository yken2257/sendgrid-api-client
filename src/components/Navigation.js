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
        { type: "divider" }
      ]}
    />
  );
}
