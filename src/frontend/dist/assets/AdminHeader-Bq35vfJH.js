import { u as useNavigate, b as useInternetIdentity, c as useQueryClient, j as jsxRuntimeExports } from "./index-B1BWNsRw.js";
import { B as Button } from "./button-Cgsb7QQx.js";
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
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
];
const House = createLucideIcon("house", __iconNode);
function AdminHeader() {
  const navigate = useNavigate();
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: "/" });
  };
  const handleHome = () => {
    navigate({ to: "/" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: "/assets/gamedom-logo.png",
          alt: "GameDom Logo",
          className: "h-8 sm:h-10 w-auto object-contain"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-primary hidden sm:inline", children: "Admin Portal" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleHome, variant: "ghost", className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Public Site" })
      ] }),
      isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: handleLogout,
          variant: "outline",
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Logout" })
          ]
        }
      )
    ] })
  ] }) }) });
}
export {
  AdminHeader as default
};
