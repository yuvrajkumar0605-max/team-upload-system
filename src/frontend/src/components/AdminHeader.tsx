import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Home, LogOut, Shield } from "lucide-react";
import { Button } from "./ui/button";

export default function AdminHeader() {
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

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/gamedom-logo.png"
              alt="GameDom Logo"
              className="h-8 sm:h-10 w-auto object-contain"
            />
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-bold text-primary hidden sm:inline">
                Admin Portal
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleHome} variant="ghost" className="gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Public Site</span>
            </Button>
            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
