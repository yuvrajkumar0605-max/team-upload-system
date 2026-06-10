import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  IdCard,
  Link as LinkIcon,
  LogIn,
  LogOut,
  Shield,
  Trophy,
  Upload,
  Users,
} from "lucide-react";
import { useIsCallerAdmin } from "../hooks/useQueries";
import { Button } from "./ui/button";

export default function Header() {
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
      } catch (error: any) {
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

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate({ to: "/" })}
          >
            <img
              src="/assets/gamedom-logo.png"
              alt="GameDom Logo"
              className="h-8 sm:h-10 w-auto object-contain"
            />
            <div className="hidden md:block">
              <h1 className="text-lg sm:text-xl font-bold text-black dark:text-black">
                GameDom
              </h1>
            </div>
          </button>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={handleViewTeams}
              variant={isTeamsPage ? "default" : "outline"}
              className="gap-2"
              size="sm"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Teams</span>
            </Button>
            <Button
              onClick={handleIDPass}
              variant={isIDPassPage ? "default" : "outline"}
              className="gap-2"
              size="sm"
            >
              <IdCard className="w-4 h-4" />
              <span className="hidden sm:inline">ID Pass</span>
            </Button>
            <Button
              onClick={handleIDPassGroupFinder}
              variant={isIDPassGroupFinderPage ? "default" : "outline"}
              className="gap-2"
              size="sm"
            >
              <LinkIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Group Finder</span>
            </Button>
            <Button
              onClick={handleSchedule}
              variant={isSchedulePage ? "default" : "outline"}
              className="gap-2"
              size="sm"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Schedule</span>
            </Button>
            <Button
              onClick={handleViewResults}
              variant={isResultsPage ? "default" : "outline"}
              className="gap-2"
              size="sm"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Results</span>
            </Button>
            <Button
              onClick={handleTeamLogoUpload}
              variant={isTeamLogoUploadPage ? "default" : "outline"}
              className="gap-2"
              size="sm"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Logo</span>
            </Button>
            {isAuthenticated && isAdmin && (
              <Button
                onClick={handleAdminPortal}
                variant="outline"
                className="gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50"
                size="sm"
              >
                <Shield className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            )}
            <Button
              onClick={handleAuth}
              disabled={disabled}
              variant={isAuthenticated ? "outline" : "default"}
              className="gap-2"
              size="sm"
            >
              {disabled ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Logging in...</span>
                </>
              ) : isAuthenticated ? (
                <>
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
