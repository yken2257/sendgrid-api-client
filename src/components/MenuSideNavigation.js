import { SideNavigation } from "@cloudscape-design/components";
import { menuNavArray } from "../menu-items";

export default function MenuSideNavigation() {
  return (
    <SideNavigation
      activeHref={document.location.hash}
      header={{ href: "/#/index", text: "Home" }}
      items={menuNavArray}
    />
  );
}
