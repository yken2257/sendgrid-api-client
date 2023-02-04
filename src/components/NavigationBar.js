import { TopNavigation } from "@cloudscape-design/components";

export default function NavigationBar(props) {
    return (
        <TopNavigation
            identity={{
                href: "",
                title: "SendGrid Support Helper",
                // logo: {
                // src:
                //     "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDNweCIgaGVpZ2h0PSIzMXB4IiB2aWV3Qm94PSIwIDAgNDMgMzEiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxyZWN0IGZpbGw9IiMyMzJmM2UiIHN0cm9rZT0iI2Q1ZGJkYiIgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI0MiIgaGVpZ2h0PSIzMCIgcng9IjIiPjwvcmVjdD4KICAgICAgICA8dGV4dCBmb250LWZhbWlseT0iQW1hem9uRW1iZXItUmVndWxhciwgQW1hem9uIEVtYmVyIiBmb250LXNpemU9IjEyIiBmaWxsPSIjRkZGRkZGIj4KICAgICAgICAgICAgPHRzcGFuIHg9IjkiIHk9IjE5Ij5Mb2dvPC90c3Bhbj4KICAgICAgICA8L3RleHQ+CiAgICA8L2c+Cjwvc3ZnPgo=",
                // alt: "Service"
                // }
            }}
            utilities={[
                {
                    type: "menu-dropdown",
                    // text: "menu",
                    iconName: "menu",
                    ariaLabel: "Menu",
                    title: "Menu",
                    items: [
                        {
                            id: "api-group",
                            text: "API Client",
                            items: [
                                {
                                    id: "sendgrid-api-client",
                                    text: "Web API v3",
                                    href: "#/apiv3/POST_mail-send"
                                },
                                {
                                    id: "custom-api-client",
                                    text: "Custom request",
                                    href: "#/custom"
                                },
                                {
                                    id: "reseller-api-client",
                                    text: "Reseller API",
                                    disabled: true,
                                    disabledReason: "Unauthorized"
                                }
                            ]
                        }
                    ]
                },
                {
                type: "menu-dropdown",
                description: "email@example.com",
                iconName: "user-profile",
                disabled: process.env.ENV == "DEV" ? false : true,
                items: [
                    { id: "profile", text: "Profile" },
                    { id: "preferences", text: "Preferences" },
                    { id: "security", text: "Security" },
                    {
                        id: "support-group",
                        text: "Support",
                        items: [
                            {
                            id: "documentation",
                            text: "Documentation",
                            href: "#",
                            external: true,
                            externalIconAriaLabel:
                                " (opens in new tab)"
                            },
                            { id: "support", text: "Support" },
                            {
                            id: "feedback",
                            text: "Feedback",
                            href: "#",
                            external: true,
                            externalIconAriaLabel:
                                " (opens in new tab)"
                            }
                        ]
                    },
                    { id: "signout", text: "Sign out" }
                ]
                }
            ]}
            i18nStrings={{
                searchIconAriaLabel: "Search",
                searchDismissIconAriaLabel: "Close search",
                overflowMenuTriggerText: "More",
                overflowMenuTitleText: "All",
                overflowMenuBackIconAriaLabel: "Back",
                overflowMenuDismissIconAriaLabel: "Close menu"
            }}
        />
    );
}