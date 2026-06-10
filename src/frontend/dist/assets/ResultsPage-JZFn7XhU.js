import { r as reactExports, j as jsxRuntimeExports } from "./index-B1BWNsRw.js";
import { B as Button } from "./button-Cgsb7QQx.js";
import { C as Card, a as CardContent } from "./card-RCIsdzkg.js";
import { B as useGetAllResults } from "./useQueries-BcZfokyK.js";
import { T as Trophy } from "./trophy-7Z7goRxl.js";
import { E as ExternalLink } from "./external-link-BqZHunkX.js";
import "./utils-CfM1yiz7.js";
import "./createLucideIcon-D8JpplVV.js";
const ITEMS_PER_PAGE = 9;
function ResultsPage() {
  const { data: results = [], isLoading } = useGetAllResults();
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const paginatedData = reactExports.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return results.slice(startIndex, endIndex);
  }, [results, currentPage]);
  const totalPages = reactExports.useMemo(() => {
    return Math.ceil(results.length / ITEMS_PER_PAGE);
  }, [results]);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-b from-background to-background/80", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold text-primary mb-4 glow-text", children: "Tournament Results" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Check out the latest tournament outcomes" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Loading results..." })
      ] }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-b from-background to-background/80", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold text-primary mb-4 glow-text", children: "Tournament Results" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Check out the latest tournament outcomes" })
    ] }),
    results.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-20 h-20 mx-auto mb-6 text-muted-foreground opacity-50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-foreground mb-2", children: "No results posted yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Check back later for tournament results" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-8", children: paginatedData.map((result) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 overflow-hidden group",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "relative w-full overflow-hidden",
                style: { aspectRatio: "4857 / 4428" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: result.image.getDirectURL(),
                      alt: result.title,
                      className: "w-full h-full object-contain bg-background/50 transition-transform duration-300 group-hover:scale-105",
                      loading: "lazy",
                      decoding: "async"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-primary mb-2 glow-text-sm", children: result.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-4 line-clamp-3", children: result.description }),
              result.link && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: result.link,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium text-sm group/link",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "View Details" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4 transition-transform group-hover/link:translate-x-1" })
                  ]
                }
              )
            ] })
          ]
        },
        result.id
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
    ] })
  ] }) });
}
export {
  ResultsPage as default
};
