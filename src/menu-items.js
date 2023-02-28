export const menuItems = [
  {
    id: "sendgrid-api-client",
    text: "Web API v3",
    href: "#/api/v3/GET_legacy-activity",
    category: "API Client"
  },
  {
    id: "custom-api-client",
    text: "Custom Request",
    href: "#/api/custom",
    category: "API Client"
  },
  {
    id: "mail-send-helper",
    text: "Mail Send Helper",
    href: "#/mailsend",
    category: "API Client"
  },
  // {
  //   id: "reseller-api-client",
  //   text: "Reseller API",
  //   category: "API Client",
  //   disabled: true,
  //   disabledReason: "Unauthorized"
  // },
  {
    id: "activity",
    text: "Email Activity",
    href: "#/activity",
    category: "Viewer"
  },
  {
    id: "stats-viewer",
    text: "Global Stats",
    href: "#/stats",
    category: "Viewer"
  },
  {
    id: "email-decoder",
    text: "Email Analyzer",
    href: "#/email-decode",
    category: "Tools"
  },
  {
    id: "json-formatter",
    text: "JSON Formatter",
    href: "#/json",
    category: "Tools"
  },
]

export const menuNavArray = menuItems.reduce((acc, curr) => {
  const sectionExists = acc.find(category => category.text === curr.category);
  if (sectionExists) {
    sectionExists.items.push({
      type: "link",
      text: curr.text,
      href: curr.href
    });
  } else {
    acc.push({
      type: "section",
      text: curr.category,
      items: [
        {
          type: "link",
          text: curr.text,
          href: curr.href
        }
      ]
    });
  }
  return acc;
}, []);

menuNavArray.push({ type: "divider" });