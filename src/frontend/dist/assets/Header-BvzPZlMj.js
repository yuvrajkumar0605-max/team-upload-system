import { u as useNavigate, a as useLocation, b as useInternetIdentity, c as useQueryClient, j as jsxRuntimeExports } from "./index-B1BWNsRw.js";
import { u as useIsCallerAdmin } from "./useQueries-BcZfokyK.js";
import { B as Button } from "./button-Cgsb7QQx.js";
import { U as Users, L as Link } from "./users-BjRV8Hec.js";
import { I as IdCard } from "./id-card-D-hpcERy.js";
import { C as Calendar } from "./calendar-Dl9AQ3q_.js";
import { T as Trophy } from "./trophy-7Z7goRxl.js";
import { U as Upload } from "./upload-S0Re2yte.js";
import { S as Shield, L as LogOut } from "./shield-Bg8KPt5h.js";
import { c as createLucideIcon } from "./createLucideIcon-D8JpplVV.js";
import "./utils-CfM1yiz7.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m10 17 5-5-5-5", key: "1bsop3" }],
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", key: "u53s6r" }]
];
const LogIn = createLucideIcon("log-in", __iconNode);
function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: isAdmin } = useIsCallerAdmin();
  const isAuthenticated = !!identity;
  const disabled = loginStatus === "logging-in";
  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: "/" });
    } else {
      try {
        await login();
      } catch (error) {
        console.error("Login error:", error);
        if (error.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };
  const handleAdminPortal = () => {
    navigate({ to: "/admin" });
  };
  const handleViewTeams = () => {
    navigate({ to: "/teams" });
  };
  const handleViewResults = () => {
    navigate({ to: "/results" });
  };
  const handleIDPass = () => {
    navigate({ to: "/id-pass" });
  };
  const handleIDPassGroupFinder = () => {
    navigate({ to: "/id-pass-group-finder" });
  };
  const handleSchedule = () => {
    navigate({ to: "/schedule" });
  };
  const handleTeamLogoUpload = () => {
    navigate({ to: "/team-logo-upload" });
  };
  const isTeamsPage = location.pathname === "/teams";
  const isResultsPage = location.pathname === "/results";
  const isIDPassPage = location.pathname === "/id-pass";
  const isIDPassGroupFinderPage = location.pathname === "/id-pass-group-finder";
  const isSchedulePage = location.pathname === "/schedule";
  const isTeamLogoUploadPage = location.pathname === "/team-logo-upload";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        className: "flex items-center gap-3 cursor-pointer",
        onClick: () => navigate({ to: "/" }),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "/assets/gamedom-logo.png",
              alt: "GameDom Logo",
              className: "h-8 sm:h-10 w-auto object-contain"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg sm:text-xl font-bold text-black dark:text-black", children: "GameDom" }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: handleViewTeams,
          variant: isTeamsPage ? "default" : "outline",
          className: "gap-2",
          size: "sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Teams" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: handleIDPass,
          variant: isIDPassPage ? "default" : "outline",
          className: "gap-2",
          size: "sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(IdCard, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "ID Pass" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: handleIDPassGroupFinder,
          variant: isIDPassGroupFinderPage ? "default" : "outline",
          className: "gap-2",
          size: "sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Group Finder" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: handleSchedule,
          variant: isSchedulePage ? "default" : "outline",
          className: "gap-2",
          size: "sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Schedule" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: handleViewResults,
          variant: isResultsPage ? "default" : "outline",
          className: "gap-2",
          size: "sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Results" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: handleTeamLogoUpload,
          variant: isTeamLogoUploadPage ? "default" : "outline",
          className: "gap-2",
          size: "sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Upload Logo" })
          ]
        }
      ),
      isAuthenticated && isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: handleAdminPortal,
          variant: "outline",
          className: "gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50",
          size: "sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Admin" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleAuth,
          disabled,
          variant: isAuthenticated ? "outline" : "default",
          className: "gap-2",
          size: "sm",
          children: disabled ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Logging in..." })
          ] }) : isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Logout" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Login" })
          ] })
        }
      )
    ] })
  ] }) }) });
}
export {
  Header as default
};
