import { r as reactExports, j as jsxRuntimeExports } from "./index-B1BWNsRw.js";
import { A as Alert, a as AlertTitle, b as AlertDescription } from "./alert-DDkxh5Kz.js";
import { B as Button } from "./button-Cgsb7QQx.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-RCIsdzkg.js";
import { L as Label, I as Input, C as CircleAlert } from "./label-ChXxB-Aw.js";
import { V as useSearchGroupLinkByTeam } from "./useQueries-BcZfokyK.js";
import { L as Link, U as Users } from "./users-BjRV8Hec.js";
import { L as LoaderCircle } from "./loader-circle-Bwiw72Ws.js";
import { S as Search } from "./search-DKT7qh8N.js";
import { E as ExternalLink } from "./external-link-BqZHunkX.js";
import "./utils-CfM1yiz7.js";
import "./createLucideIcon-D8JpplVV.js";
function IDPassGroupFinderPage() {
  const [teamName, setTeamName] = reactExports.useState("");
  const [phoneNumber, setPhoneNumber] = reactExports.useState("");
  const searchMutation = useSearchGroupLinkByTeam();
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!teamName.trim() || !phoneNumber.trim()) {
      return;
    }
    await searchMutation.mutateAsync({
      teamName: teamName.trim(),
      phoneNumber: phoneNumber.trim()
    });
  };
  const handleReset = () => {
    setTeamName("");
    setPhoneNumber("");
    searchMutation.reset();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl font-bold mb-4 text-primary glow-primary flex items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "w-10 h-10" }),
        "ID Pass Group Finder"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "Enter your team name and phone number to find your assigned group link" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mb-8 border-primary/20 bg-card/50 backdrop-blur-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Find Your Group Link" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Enter your team name and captain's phone number to access your group assignment" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSearch, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "teamName", children: "Team Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "teamName",
              value: teamName,
              onChange: (e) => setTeamName(e.target.value),
              placeholder: "Enter your team name...",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phoneNumber", children: "Captain Phone Number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "phoneNumber",
              value: phoneNumber,
              onChange: (e) => setPhoneNumber(e.target.value),
              placeholder: "Enter captain's phone number...",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: searchMutation.isPending || !teamName.trim() || !phoneNumber.trim(),
              className: "flex-1 gap-2",
              children: searchMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
                "Searching..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4" }),
                "Search"
              ] })
            }
          ),
          (searchMutation.data || searchMutation.isError) && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: handleReset, children: "Reset" })
        ] })
      ] }) })
    ] }),
    searchMutation.isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "border-red-500/50 bg-red-500/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5 text-red-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTitle, { className: "text-red-500", children: "Team Not Found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-muted-foreground", children: "You must register your team before accessing ID Pass group links. Please check your team name and phone number, or register your team first." })
    ] }),
    searchMutation.data && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/50 bg-card/50 backdrop-blur-sm glow-primary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl", children: "Your Group Assignment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
          "Group information for ",
          teamName
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-base", children: "Group Number" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-3xl font-bold text-primary", children: [
              "Group ",
              searchMutation.data.groupNumber.toString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "w-5 h-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-base", children: "Group ID" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-3xl font-bold text-primary", children: [
              "#",
              searchMutation.data.groupId.toString()
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-6 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-base", children: "Your Group Link" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: searchMutation.data.groupLink,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-5 h-5" }),
                "Open Group Link"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground break-all", children: searchMutation.data.groupLink })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { className: "border-green-500/50 bg-green-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-muted-foreground", children: "Your group assignment has been found! Click the link above to access your group." }) })
      ] })
    ] }),
    !searchMutation.data && !searchMutation.isError && !searchMutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-16 h-16 mx-auto mb-4 opacity-50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Enter your team name and phone number to find your group link" })
    ] })
  ] }) });
}
export {
  IDPassGroupFinderPage as default
};
