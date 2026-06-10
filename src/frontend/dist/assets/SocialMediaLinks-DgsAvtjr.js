import { j as jsxRuntimeExports } from "./index-B1BWNsRw.js";
import { S as SiInstagram, a as SiDiscord, b as SiYoutube, M as MessageCircle } from "./index-CCDZJztk.js";
import { g as useGetSocialMediaLinks } from "./useQueries-BcZfokyK.js";
function SocialMediaLinks() {
  const { data: socialLinks, isLoading } = useGetSocialMediaLinks();
  if (isLoading || !socialLinks) {
    return null;
  }
  const links = [
    {
      name: "Instagram",
      url: socialLinks.instagram,
      icon: SiInstagram,
      color: "hover:text-pink-500",
      glow: "hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]"
    },
    {
      name: "Discord",
      url: socialLinks.discord,
      icon: SiDiscord,
      color: "hover:text-indigo-500",
      glow: "hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]"
    },
    {
      name: "YouTube",
      url: socialLinks.youtube,
      icon: SiYoutube,
      color: "hover:text-red-500",
      glow: "hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"
    },
    {
      name: "WhatsApp",
      url: socialLinks.whatsapp,
      icon: MessageCircle,
      color: "hover:text-green-500",
      glow: "hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
    }
  ];
  const activeLinks = links.filter((link) => link.url);
  if (activeLinks.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-6", children: activeLinks.map((link) => {
    const Icon = link.icon;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "a",
      {
        href: link.url,
        target: "_blank",
        rel: "noopener noreferrer",
        className: `text-muted-foreground transition-all duration-300 ${link.color} ${link.glow}`,
        "aria-label": link.name,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-6 h-6" })
      },
      link.name
    );
  }) });
}
export {
  SocialMediaLinks as S
};
