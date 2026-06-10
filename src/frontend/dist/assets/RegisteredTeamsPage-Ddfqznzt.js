import { r as reactExports, j as jsxRuntimeExports } from "./index-B1BWNsRw.js";
import { B as Button } from "./button-Cgsb7QQx.js";
import { T as useGetPublicRegistrations, e as useGetRegistrationSummary } from "./useQueries-BcZfokyK.js";
import { L as LoaderCircle } from "./loader-circle-Bwiw72Ws.js";
import { T as Trophy } from "./trophy-7Z7goRxl.js";
import "./utils-CfM1yiz7.js";
import "./createLucideIcon-D8JpplVV.js";
const ITEMS_PER_PAGE = 12;
function RegisteredTeamsPage() {
  const { data: registrations, isLoading, error } = useGetPublicRegistrations();
  const { data: summary, isLoading: summaryLoading } = useGetRegistrationSummary();
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const paginatedData = reactExports.useMemo(() => {
    if (!registrations) return [];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return registrations.slice(startIndex, endIndex);
  }, [registrations, currentPage]);
  const totalPages = reactExports.useMemo(() => {
    if (!registrations) return 0;
    return Math.ceil(registrations.length / ITEMS_PER_PAGE);
  }, [registrations]);
  if (isLoading || summaryLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[60vh] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-16 h-16 text-primary animate-spin mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Loading registered teams..." })
    ] }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold mb-2", children: "Unable to Load Teams" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "We're having trouble loading the registered teams. Please try again later." })
    ] }) }) });
  }
  if (!registrations || registrations.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold mb-2", children: "No Teams Registered Yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Be the first to register your team for the tournament!" })
    ] }) }) });
  }
  const totalTeams = summary ? Number(summary.totalTeams) : registrations.length;
  const maxTeams = (summary == null ? void 0 : summary.maxTeams) !== void 0 ? Number(summary.maxTeams) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold mb-4 text-primary glow-primary", children: "Registered Teams" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: maxTeams !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-semibold", children: [
        totalTeams,
        " / ",
        maxTeams,
        " teams registered"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-semibold", children: [
        totalTeams,
        " teams registered"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8", children: paginatedData.map((team, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32 h-32 rounded-lg overflow-hidden bg-muted flex items-center justify-center border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: team.logo.getDirectURL(),
              alt: `${team.teamName} logo`,
              className: "w-full h-full object-cover",
              loading: "lazy",
              decoding: "async",
              onError: (e) => {
                const target = e.target;
                target.src = "/assets/generated/default-team-logo-transparent.dim_200x200.png";
              }
            }
          ) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-center text-foreground", children: team.teamName })
        ]
      },
      `${team.teamName}-${index}`
    )) }),
    totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: () => setCurrentPage((prev) => Math.max(1, prev - 1)),
          disabled: currentPage === 1,
          children: "Previous"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
        "Page ",
        currentPage,
        " of ",
        totalPages
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: () => setCurrentPage((prev) => Math.min(totalPages, prev + 1)),
          disabled: currentPage === totalPages,
          children: "Next"
        }
      )
    ] })
  ] }) });
}
export {
  RegisteredTeamsPage as default
};
