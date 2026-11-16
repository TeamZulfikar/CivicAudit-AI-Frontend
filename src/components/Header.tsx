"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  LogIn,
  LogOut,
  User,
  SlidersHorizontal,
  UserPlus,
  Database,
  Users,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { useSidebar } from "@/components/SidebarContext";

interface HeaderProps {
  activeBrain?: string;
  councilMode?: string;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeBrain,
  councilMode,
  onOpenSettings = () => {},
}) => {
  const router = useRouter();
  const sidebar = useSidebar();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  // Backend Health Ping
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/settings`, {
          cache: "no-store",
          signal: AbortSignal.timeout(3000),
        });
        setBackendOnline(res.ok);
      } catch {
        setBackendOnline(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  const userRole =
    (session?.user as { role?: string } | undefined)?.role || "user";
  const isAdmin = userRole === "admin";
  const userName = session?.user?.name || "Auditor";
  const userEmail = session?.user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto h-14 px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Brand Logo & Title + Navigation */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer transition-opacity hover:opacity-90"
          >
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-foreground">
                CivicAudit
              </span>
              <span className="text-[9px] font-mono font-medium tracking-wide text-primary uppercase bg-primary/10 px-1 py-0.5 rounded">
                AI
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Hero6 Standard) */}
          <nav aria-label="Main" className="hidden md:flex items-center gap-5 text-xs font-medium ml-2">
            <Link
              href="/tribunal"
              className="text-muted-foreground transition-colors hover:text-[#19c7e8]"
            >
              Tribunal Engine
            </Link>
            <Link
              href="/#statutory-standards"
              className="text-muted-foreground transition-colors hover:text-[#19c7e8]"
            >
              Statutory Standards
            </Link>
            {/* Accessible to both user and admin roles */}
            {session && (
              <button
                type="button"
                onClick={sidebar?.toggleSidebar}
                className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-[#19c7e8] cursor-pointer"
                title="Toggle Forensic Dossier Vault (⌘K)"
              >
                <span>Dossier Vault</span>
                <span className="text-[9px] font-mono text-[#19c7e8] bg-[#19c7e8]/10 px-1 py-0.2 rounded border border-[#19c7e8]/30">
                  ⌘K
                </span>
              </button>
            )}
            {isAdmin && (
              <Link
                href="/admin/users"
                className="flex items-center gap-1.5 text-foreground hover:text-[#19c7e8] font-medium transition-colors cursor-pointer"
              >
                <span>Admin Operations</span>
                <span className="text-[9px] font-mono uppercase px-1 py-0.2 bg-[#19c7e8]/15 text-[#19c7e8] border border-[#19c7e8]/30 rounded">
                  Admin
                </span>
              </Link>
            )}
            {session && (
              <button
                type="button"
                onClick={onOpenSettings}
                className="text-muted-foreground transition-colors hover:text-[#19c7e8] cursor-pointer"
              >
                AI Council
              </button>
            )}
          </nav>
        </div>

        {/* Right: Theme Switcher & Minimalist User Avatar Dropdown */}
        <div className="flex items-center gap-3">
          {/* Technical Telemetry Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-[3px] border border-border/80 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
            <span
              className={`size-1.5 rounded-full ${
                backendOnline === true
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                  : backendOnline === false
                    ? "bg-rose-500"
                    : "bg-amber-500 animate-pulse"
              }`}
            />
            <span>{backendOnline ? "Tribunal Live" : "Connecting"}</span>
          </div>

          {/* Single Theme Toggle Button */}
          <ThemeToggle />

          {/* User Avatar with Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            {sessionPending ? (
              <div className="w-8 h-8 rounded-full bg-muted/40 animate-pulse" />
            ) : session ? (
              /* Authenticated User Avatar Button */
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all duration-150 cursor-pointer shadow-xs ${
                  isAdmin
                    ? "bg-primary text-primary-foreground hover:ring-2 hover:ring-primary/40"
                    : "bg-secondary text-secondary-foreground border border-border/80 hover:bg-muted"
                }`}
                title={`Account: ${userName} (${userRole})`}
                aria-expanded={dropdownOpen}
              >
                {userInitial}
              </button>
            ) : (
              /* Guest Avatar Button */
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-8 h-8 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60 flex items-center justify-center transition-colors cursor-pointer"
                title="Account & Sign In"
                aria-expanded={dropdownOpen}
              >
                <User className="w-4 h-4" />
              </button>
            )}

            {/* Dropdown Menu Box */}
            {dropdownOpen && (
              <div className="absolute right-0 top-10 mt-1.5 w-60 rounded-xl border border-border/60 bg-popover text-popover-foreground p-1.5 shadow-xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100 z-50">
                {session ? (
                  /* Authenticated Menu */
                  <div className="space-y-1">
                    {/* User Identity Header */}
                    <div className="px-3 py-2.5 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-foreground truncate max-w-[140px]">
                          {userName}
                        </span>
                        <Badge
                          variant={isAdmin ? "default" : "secondary"}
                          className={`text-[9px] uppercase font-mono px-1.5 py-0.2 tracking-wider ${
                            isAdmin
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {userRole}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                        {userEmail}
                      </p>
                    </div>

                    <div className="my-1 border-t border-border/50" />

                    {/* Action: Dossier Vault for both roles */}
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        sidebar?.toggleSidebar();
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-foreground/90 hover:text-foreground hover:bg-muted/60 rounded-md transition-colors cursor-pointer text-left"
                    >
                      <span className="flex items-center gap-2">
                        <Database className="w-3.5 h-3.5 text-[#19c7e8]" />
                        <span>Dossier Vault</span>
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">⌘K</span>
                    </button>

                    {/* AI Council & Settings (Available for all authenticated users) */}
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenSettings();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-foreground/90 hover:text-foreground hover:bg-muted/60 rounded-md transition-colors cursor-pointer text-left"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                      <span>AI Council & Settings</span>
                    </button>

                    {/* Admin Action: User Registry */}
                    {isAdmin && (
                      <Link
                        href="/admin/users"
                        onClick={() => setDropdownOpen(false)}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-foreground/90 hover:text-foreground hover:bg-muted/60 rounded-md transition-colors cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5 text-[#19c7e8]" />
                        <span>User Registry</span>
                      </Link>
                    )}

                    {/* Switch Account */}
                    <Link
                      href="/login"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md transition-colors cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Switch Account</span>
                    </Link>

                    <div className="my-1 border-t border-border/50" />

                    {/* Sign Out */}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10 rounded-md transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  /* Guest Menu */
                  <div className="space-y-1">
                    <div className="px-3 py-2 bg-muted/30 rounded-lg text-left">
                      <p className="text-xs font-semibold text-foreground">
                        Guest Access
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Sign in to unlock full audits
                      </p>
                    </div>

                    <div className="my-1 border-t border-border/50" />

                    {/* Main Sign In Link */}
                    <Link
                      href="/login"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 rounded-md transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </Link>

                    {/* Register Link */}
                    <Link
                      href="/register"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-foreground hover:bg-muted/60 rounded-md transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Create Account</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
