import { SideNavigation } from "@cloudscape-design/components";
import { mailSendNavArray } from "../generate-metadata";

export default function MailSendSideNavigation() {
  return (
    <SideNavigation
      activeHref={document.location.hash}
      header={{ href: "/#/index", text: "Home" }}
      items={mailSendNavArray}
    />
  );
}
