import { r as reactExports, j as jsxRuntimeExports } from "./index-B1BWNsRw.js";
import { A as Alert, a as AlertTitle, b as AlertDescription } from "./alert-DDkxh5Kz.js";
import { B as Button } from "./button-Cgsb7QQx.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-RCIsdzkg.js";
import { L as Label, I as Input, C as CircleAlert } from "./label-ChXxB-Aw.js";
import { U as useSearchTeamsByNameOrPhone } from "./useQueries-BcZfokyK.js";
import { I as IdCard } from "./id-card-D-hpcERy.js";
import { L as LoaderCircle } from "./loader-circle-Bwiw72Ws.js";
import { S as Search } from "./search-DKT7qh8N.js";
import { U as Users, L as Link } from "./users-BjRV8Hec.js";
import "./utils-CfM1yiz7.js";
import "./createLucideIcon-D8JpplVV.js";
function IDPassPage() {
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [searchResult, setSearchResult] = reactExports.useState(
    null
  );
  const searchMutation = useSearchTeamsByNameOrPhone();
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      return;
    }
    try {
      const results = await searchMutation.mutateAsync(searchTerm.trim());
      if (results && results.length > 0) {
        setSearchResult(results[0]);
      } else {
        setSearchResult(null);
      }
    } catch (_error) {
      setSearchResult(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl font-bold mb-4 text-primary glow-primary flex items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(IdCard, { className: "w-10 h-10" }),
        "ID Pass"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "Search for your team to view your Team ID and assigned IDP group" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mb-8 border-primary/20 bg-card/50 backdrop-blur-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Find Your Team" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Enter your team name or captain's phone number to search" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit: handleSearch, className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "search", children: "Team Name or Phone Number" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "search",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              placeholder: "Enter team name or phone number...",
              className: "flex-1"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: searchMutation.isPending || !searchTerm.trim(),
              className: "gap-2",
              children: searchMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
                "Searching..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4" }),
                "Search"
              ] })
            }
          )
        ] })
      ] }) }) })
    ] }),
    searchMutation.isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "border-yellow-500/50 bg-yellow-500/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTitle, { className: "text-yellow-500", children: "No Team Found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-muted-foreground", children: "No teams match your search. Please check your team name or phone number and try again." })
    ] }),
    searchResult && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      !searchResult.idPassAssigned && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "border-amber-500/50 bg-amber-500/10 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5 text-amber-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTitle, { className: "text-amber-500", children: "ID Pass Not Yet Assigned" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-muted-foreground", children: "Your ID Pass is not yet assigned. Please check back later or contact the tournament organizers for more information." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/50 bg-card/50 backdrop-blur-sm glow-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl", children: "Team Information" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 pb-6 border-b border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-lg overflow-hidden bg-muted flex items-center justify-center border-2 border-primary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: searchResult.logo.getDirectURL(),
                alt: `${searchResult.teamName} logo`,
                className: "w-full h-full object-cover",
                loading: "lazy"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-primary", children: searchResult.teamName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
                "Captain: ",
                searchResult.captain.name
              ] })
            ] })
          ] }),
          searchResult.idPassAssigned ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(IdCard, { className: "w-5 h-5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-base", children: "Team ID" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-3xl font-bold text-primary", children: [
                  "#",
                  searchResult.teamId.toString()
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-base", children: "IDP Group" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-3xl font-bold text-primary", children: [
                  "Group ",
                  searchResult.groupNumber.toString()
                ] })
              ] })
            ] }),
            searchResult.groupLink && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-6 border-t border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "w-5 h-5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-base", children: "Group Link" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: searchResult.groupLink,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "inline-flex items-center gap-2 text-primary hover:underline break-all",
                  children: searchResult.groupLink
                }
              )
            ] }),
            !searchResult.groupLink && /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { className: "border-blue-500/50 bg-blue-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-muted-foreground", children: "Group link will be available soon. Please check back later." }) })
          ] }) : (
            /* Message when ID Pass is not assigned */
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-16 h-16 mx-auto mb-4 text-amber-500 opacity-50" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium text-muted-foreground", children: "Your team has been registered successfully, but your ID Pass details are not yet available." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: "Please check back later or contact the organizers for more information." })
            ] })
          )
        ] })
      ] })
    ] }),
    !searchResult && !searchMutation.isError && !searchMutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-16 h-16 mx-auto mb-4 opacity-50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Enter your team name or phone number to search" })
    ] })
  ] }) });
}
export {
  IDPassPage as default
};
