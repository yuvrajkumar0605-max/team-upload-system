import { j as jsxRuntimeExports } from "./index-B1BWNsRw.js";
import { A as Alert, a as AlertTitle, b as AlertDescription } from "./alert-DDkxh5Kz.js";
import { C as Card, a as CardContent } from "./card-RCIsdzkg.js";
import { C as Calendar } from "./calendar-Dl9AQ3q_.js";
import { c as createLucideIcon } from "./createLucideIcon-D8JpplVV.js";
import "./utils-CfM1yiz7.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode);
function SchedulePage() {
  const hasSchedule = false;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl font-bold mb-4 text-primary glow-primary flex items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-10 h-10" }),
        "Tournament Schedule"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "View the IDP group schedule and tournament timeline" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-primary/20 bg-card/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-12 pb-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "border-blue-500/50 bg-blue-500/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-blue-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTitle, { className: "text-blue-500 text-xl font-bold", children: "Schedule Coming Soon" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-muted-foreground mt-2", children: "The tournament schedule will be published here soon. Please check back later for updates on match timings and group schedules." })
    ] }) }) }),
    hasSchedule
  ] }) });
}
export {
  SchedulePage as default
};
