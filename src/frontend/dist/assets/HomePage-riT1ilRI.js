import { r as reactExports, j as jsxRuntimeExports, d as ue, b as useInternetIdentity } from "./index-B1BWNsRw.js";
import { a as useGetAllAnnouncements, b as useBanner, c as useSubmitRegistration, d as useGetRegistrationStatus, e as useGetRegistrationSummary, E as ExternalBlob, f as useGetCallerUserProfile } from "./useQueries-BcZfokyK.js";
import { B as Button } from "./button-Cgsb7QQx.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle, d as CardDescription } from "./card-RCIsdzkg.js";
import { M as Megaphone, P as Plus, T as Trash2, a as ProfileSetupModal } from "./ProfileSetupModal-CiJG2GR6.js";
import { E as ExternalLink } from "./external-link-BqZHunkX.js";
import { A as Alert, a as AlertTitle, b as AlertDescription } from "./alert-DDkxh5Kz.js";
import { C as CircleAlert, L as Label, I as Input } from "./label-ChXxB-Aw.js";
import { C as CircleCheckBig } from "./circle-check-big-Jm6aAokV.js";
import { S as SocialMediaLinks } from "./SocialMediaLinks-DgsAvtjr.js";
import "./utils-CfM1yiz7.js";
import "./createLucideIcon-D8JpplVV.js";
import "./index-CCDZJztk.js";
const ITEMS_PER_PAGE = 6;
function AnnouncementsSection() {
  const { data: announcements = [], isLoading } = useGetAllAnnouncements();
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const paginatedData = reactExports.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return announcements.slice(startIndex, endIndex);
  }, [announcements, currentPage]);
  const totalPages = reactExports.useMemo(() => {
    return Math.ceil(announcements.length / ITEMS_PER_PAGE);
  }, [announcements]);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold text-primary mb-4 glow-text", children: "Announcements" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Stay updated with the latest tournament news" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[200px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Loading announcements..." })
      ] }) })
    ] });
  }
  if (announcements.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold text-primary mb-4 glow-text", children: "Announcements" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Stay updated with the latest tournament news" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "No announcements yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-2", children: "Check back later for updates" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold text-primary mb-4 glow-text", children: "Announcements" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Stay updated with the latest tournament news" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8", children: paginatedData.map((announcement) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 overflow-hidden group",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-video overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: announcement.image.getDirectURL(),
                alt: announcement.title,
                className: "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",
                loading: "lazy",
                decoding: "async"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-primary mb-2 glow-text-sm", children: announcement.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-4 line-clamp-3", children: announcement.description }),
            announcement.link && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: announcement.link,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium text-sm group/link",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Learn More" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4 transition-transform group-hover/link:translate-x-1" })
                ]
              }
            )
          ] })
        ]
      },
      announcement.id
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
  ] });
}
function HeroSection() {
  const { data: banner, isLoading } = useBanner();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-8 sm:py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-lg overflow-hidden shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full", children: [
      !isLoading && banner ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: banner.image.getDirectURL(),
          alt: "GameDom",
          className: "w-full h-auto object-contain",
          loading: "eager",
          decoding: "async",
          fetchPriority: "high"
        }
      ) : (
        /* Fallback: dark gradient placeholder when no banner is set */
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-48 sm:h-64 md:h-80 bg-gradient-to-br from-background via-card to-background flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" }) })
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 drop-shadow-lg", children: "GameDom" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm sm:text-base md:text-lg lg:text-xl text-foreground/80 drop-shadow-md", children: "Register your team and compete for glory" })
    ] })
  ] }) }) });
}
function RegistrationForm() {
  const [teamName, setTeamName] = reactExports.useState("");
  const [captainName, setCaptainName] = reactExports.useState("");
  const [captainPhone, setCaptainPhone] = reactExports.useState("");
  const [members, setMembers] = reactExports.useState([
    { name: "", playerId: "" }
  ]);
  const [logoFile, setLogoFile] = reactExports.useState(null);
  const [logoPreview, setLogoPreview] = reactExports.useState("");
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const [isSubmitted, setIsSubmitted] = reactExports.useState(false);
  const [validationErrors, setValidationErrors] = reactExports.useState({});
  const submitRegistration = useSubmitRegistration();
  const { data: isRegistrationOpen = true, isLoading: statusLoading } = useGetRegistrationStatus();
  const { data: summary, isLoading: summaryLoading } = useGetRegistrationSummary();
  const validateForm = reactExports.useCallback(() => {
    const errors = {};
    if (!(teamName == null ? void 0 : teamName.trim())) {
      errors.teamName = "Team name is required";
    }
    if (!(captainName == null ? void 0 : captainName.trim())) {
      errors.captainName = "Captain name is required";
    }
    if (!(captainPhone == null ? void 0 : captainPhone.trim())) {
      errors.captainPhone = "Captain phone is required";
    } else if (!/^[\d\s\-+()]+$/.test(captainPhone)) {
      errors.captainPhone = "Please enter a valid phone number";
    }
    if (!logoFile) {
      errors.logo = "Team logo is required";
    }
    if (members.length === 0 || !members.some((m) => {
      var _a;
      return (_a = m.name) == null ? void 0 : _a.trim();
    })) {
      errors.members = "At least one team member is required";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [teamName, captainName, captainPhone, logoFile, members]);
  const handleLogoChange = reactExports.useCallback(
    (e) => {
      var _a;
      const file = (_a = e.target.files) == null ? void 0 : _a[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setValidationErrors((prev) => ({
          ...prev,
          logo: "Please select an image file"
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors((prev) => ({
          ...prev,
          logo: "Image size must be less than 5MB"
        }));
        return;
      }
      setLogoFile(file);
      setValidationErrors((prev) => {
        const { logo, ...rest } = prev;
        return rest;
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.onerror = () => {
        setValidationErrors((prev) => ({
          ...prev,
          logo: "Failed to load image preview"
        }));
      };
      reader.readAsDataURL(file);
    },
    []
  );
  const addMember = reactExports.useCallback(() => {
    setMembers((prev) => [...prev, { name: "", playerId: "" }]);
  }, []);
  const removeMember = reactExports.useCallback((index) => {
    setMembers((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }, []);
  const updateMember = reactExports.useCallback(
    (index, field, value) => {
      setMembers((prev) => {
        const updated = [...prev];
        if (field === "playerId") {
          updated[index] = { ...updated[index], playerId: value || void 0 };
        } else {
          updated[index] = { ...updated[index], [field]: value };
        }
        return updated;
      });
    },
    []
  );
  const handleSubmit = reactExports.useCallback(
    async (e) => {
      e.preventDefault();
      setValidationErrors({});
      if (!validateForm()) {
        ue.error("Please fix the validation errors");
        return;
      }
      try {
        const arrayBuffer = await logoFile.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const logoBlob = ExternalBlob.fromBytes(bytes).withUploadProgress(
          (percentage) => {
            setUploadProgress(percentage);
          }
        );
        const captain = {
          name: captainName.trim(),
          phone: captainPhone.trim()
        };
        const validMembers = members.filter((m) => {
          var _a;
          return (_a = m.name) == null ? void 0 : _a.trim();
        }).map((m) => {
          var _a;
          return {
            name: m.name.trim(),
            playerId: ((_a = m.playerId) == null ? void 0 : _a.trim()) || void 0
          };
        });
        await submitRegistration.mutateAsync({
          teamName: teamName.trim(),
          logo: logoBlob,
          captain,
          members: validMembers
        });
        ue.success(
          "Registration submitted successfully! Your team has been approved."
        );
        setIsSubmitted(true);
        setTeamName("");
        setCaptainName("");
        setCaptainPhone("");
        setMembers([{ name: "", playerId: "" }]);
        setLogoFile(null);
        setLogoPreview("");
        setUploadProgress(0);
        setValidationErrors({});
      } catch (error) {
        const errorMessage = (error == null ? void 0 : error.message) || "Failed to submit registration";
        if (errorMessage.includes("already registered")) {
          ue.error("You have already registered a team");
        } else if (errorMessage.includes("Registrations are full")) {
          ue.error("Registrations are full. Please try again later.");
        } else if (errorMessage.includes("Registration is closed")) {
          ue.error("Registration is currently closed");
        } else if (errorMessage.includes("Team name already registered")) {
          ue.error(
            "This team name is already taken. Please choose a different name."
          );
        } else {
          ue.error("Registration failed. Please try again.");
        }
      }
    },
    [
      validateForm,
      logoFile,
      captainName,
      captainPhone,
      teamName,
      members,
      submitRegistration
    ]
  );
  const { totalTeams, maxTeams, isLimitReached } = reactExports.useMemo(() => {
    const total = summary ? Number(summary.totalTeams) : 0;
    const max = (summary == null ? void 0 : summary.maxTeams) !== void 0 ? Number(summary.maxTeams) : null;
    const limitReached = max !== null && total >= max;
    return { totalTeams: total, maxTeams: max, isLimitReached: limitReached };
  }, [summary]);
  if (statusLoading || summaryLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container mx-auto px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Loading registration form..." })
    ] }) }) });
  }
  if (isSubmitted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container mx-auto px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "max-w-2xl mx-auto text-center border-primary/50 glow-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-12 pb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-20 h-20 text-primary mx-auto mb-6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold mb-4", children: "Registration Successful!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "Your team has been registered and automatically approved for the BOOYAH Battle of Supremacy tournament. Good luck!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setIsSubmitted(false), variant: "outline", children: "Register Another Team" })
    ] }) }) });
  }
  if (!isRegistrationOpen) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container mx-auto px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "max-w-2xl mx-auto border-yellow-500/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-12 pb-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "border-yellow-500/50 bg-yellow-500/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5 text-yellow-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTitle, { className: "text-yellow-500 text-xl font-bold", children: "Registration is Currently Closed" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-muted-foreground mt-2", children: "Team registration for the BOOYAH Battle of Supremacy is currently closed. Please check back later or contact the tournament organizers for more information." })
    ] }) }) }) });
  }
  if (isLimitReached) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container mx-auto px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "max-w-2xl mx-auto border-red-500/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-12 pb-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "border-red-500/50 bg-red-500/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5 text-red-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTitle, { className: "text-red-500 text-xl font-bold", children: "Registrations are Full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { className: "text-muted-foreground mt-2", children: [
        "We have reached the maximum number of team registrations (",
        maxTeams,
        ") for the BOOYAH Battle of Supremacy tournament. Registration is now closed."
      ] })
    ] }) }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container mx-auto px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "max-w-3xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl", children: "Team Registration" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
        "Fill out the form below to register your team",
        maxTeams !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block mt-1 text-primary font-medium", children: [
          totalTeams,
          " / ",
          maxTeams,
          " teams registered"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block mt-1 text-primary font-medium", children: [
          totalTeams,
          " teams registered"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "teamName", children: [
          "Team Name ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "teamName",
            value: teamName,
            onChange: (e) => {
              setTeamName(e.target.value);
              setValidationErrors((prev) => {
                const { teamName: teamName2, ...rest } = prev;
                return rest;
              });
            },
            placeholder: "Enter your team name",
            className: validationErrors.teamName ? "border-destructive" : ""
          }
        ),
        validationErrors.teamName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: validationErrors.teamName })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "logo", children: [
          "Team Logo ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "logo",
                type: "file",
                accept: "image/*",
                onChange: handleLogoChange,
                className: `cursor-pointer ${validationErrors.logo ? "border-destructive" : ""}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Max size: 5MB" }),
            validationErrors.logo && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive mt-1", children: validationErrors.logo })
          ] }),
          logoPreview && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 border-2 border-border rounded-lg overflow-hidden bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: logoPreview,
              alt: "Logo preview",
              className: "w-full h-full object-cover"
            }
          ) })
        ] }),
        uploadProgress > 0 && uploadProgress < 100 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-muted rounded-full h-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "bg-primary h-2 rounded-full transition-all",
            style: { width: `${uploadProgress}%` }
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 border-t border-border pt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: "Captain Information" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "captainName", children: [
              "Name ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "captainName",
                value: captainName,
                onChange: (e) => {
                  setCaptainName(e.target.value);
                  setValidationErrors((prev) => {
                    const { captainName: captainName2, ...rest } = prev;
                    return rest;
                  });
                },
                placeholder: "Captain's name",
                className: validationErrors.captainName ? "border-destructive" : ""
              }
            ),
            validationErrors.captainName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: validationErrors.captainName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "captainPhone", children: [
              "Phone ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "captainPhone",
                type: "tel",
                value: captainPhone,
                onChange: (e) => {
                  setCaptainPhone(e.target.value);
                  setValidationErrors((prev) => {
                    const { captainPhone: captainPhone2, ...rest } = prev;
                    return rest;
                  });
                },
                placeholder: "+1234567890",
                className: validationErrors.captainPhone ? "border-destructive" : ""
              }
            ),
            validationErrors.captainPhone && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: validationErrors.captainPhone })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 border-t border-border pt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: "Team Members" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              onClick: addMember,
              size: "sm",
              variant: "outline",
              className: "gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                "Add Member"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: members.map((member, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex gap-2 items-start",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 grid sm:grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: member.name,
                    onChange: (e) => updateMember(index, "name", e.target.value),
                    placeholder: "Player name"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: member.playerId || "",
                    onChange: (e) => updateMember(index, "playerId", e.target.value),
                    placeholder: "Player ID (optional)"
                  }
                )
              ] }),
              members.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  onClick: () => removeMember(index),
                  size: "icon",
                  variant: "ghost",
                  className: "text-destructive hover:text-destructive",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                }
              )
            ]
          },
          member.name || `member-${members.indexOf(member)}`
        )) }),
        validationErrors.members && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: validationErrors.members })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          className: "w-full",
          size: "lg",
          disabled: submitRegistration.isPending,
          children: submitRegistration.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" }),
            "Submitting..."
          ] }) : "Submit Registration"
        }
      )
    ] }) })
  ] }) });
}
function HomePage() {
  const { identity, isInitializing } = useInternetIdentity();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched
  } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
  if (isInitializing && isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[60vh] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Loading..." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeroSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnnouncementsSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SocialMediaLinks, {}) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RegistrationForm, {}),
    showProfileSetup && /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileSetupModal, {})
  ] });
}
export {
  HomePage as default
};
