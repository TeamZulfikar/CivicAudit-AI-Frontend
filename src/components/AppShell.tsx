"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { AdminDossierVault } from "@/components/AdminDossierVault";
import { SettingsModal } from "@/components/SettingsModal";
import { SidebarProvider } from "@/components/SidebarContext";
import { authClient } from "@/lib/auth-client";
import { fetchSettings } from "@/lib/api";
import { SettingsResponse } from "@/types/audit";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const userRole = (session?.user as { role?: string } | undefined)?.role || null;
  const isAdmin = userRole === "admin";
  const isAuthenticated = !!session?.user;

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<SettingsResponse | null>(null);
  const [activeBrain, setActiveBrain] = useState<string>("Auto Cascade");
  const [councilMode, setCouncilMode] = useState<string>("llm");

  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (isAuthPage) return;
    const loadSettings = async () => {
      try {
        const data = await fetchSettings();
        setCurrentSettings(data);
        setActiveBrain(data.active_brain);
        setCouncilMode(data.council_mode);
      } catch (err) {
        console.warn("Settings fetch error in AppShell:", err);
      }
    };
    loadSettings();
  }, [isAuthPage]);

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
        {/* Navigation Header */}
        <Header
          activeBrain={activeBrain}
          councilMode={councilMode}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Signature Diagonal Hatched Divider under Header */}
        <div
          aria-hidden="true"
          className="h-4 sm:h-6 w-full border-b border-[#d1d5db] dark:border-white/10 hatched-divider shrink-0"
        />

        {/* Main Application Canvas (Full Width Architectural Symmetry) */}
        <div className="flex-1 flex flex-col min-h-0">
          {children}
        </div>

        {/* Forensic Dossier Vault (Accessible to both user and admin roles) */}
        {!isAuthPage && isAuthenticated && <AdminDossierVault />}

        {/* Signature Diagonal Hatched Divider above footer */}
        <div
          aria-hidden="true"
          className="h-4 sm:h-6 w-full border-y border-[#d1d5db] dark:border-white/10 hatched-divider"
        />

        {/* Responsive Global Architectural Footer */}
        <footer className="w-full py-6 sm:py-8 bg-card/40 backdrop-blur-sm text-foreground/90 font-sans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-5 sm:gap-6">
            {/* Top Row: Brand & Quick Navigation */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
              {/* Brand Title & Tagline */}
              <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2.5">
                <Link
                  href="/"
                  className="flex items-center gap-2 group transition-opacity hover:opacity-90"
                >
                  <span className="font-semibold text-xs tracking-tight text-foreground">
                    CivicAudit AI
                  </span>
                  <span className="text-[9px] font-mono text-[#19c7e8] bg-[#19c7e8]/10 px-1.5 py-0.5 rounded border border-[#19c7e8]/20">
                    v2.5
                  </span>
                </Link>
                <span aria-hidden="true" className="hidden sm:inline text-muted-foreground/40">
                  &bull;
                </span>
                <span className="text-[11px] sm:text-xs text-muted-foreground">
                  Autonomous Multi-Agent Procurement Integrity Engine
                </span>
              </div>

              {/* Quick Navigation Links */}
              <nav
                aria-label="Footer"
                className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-5 gap-y-1.5 text-[11px] font-mono text-muted-foreground"
              >
                <Link
                  href="/tribunal"
                  className="hover:text-[#19c7e8] transition-colors"
                >
                  Tribunal Engine
                </Link>
                <Link
                  href="/#statutory-standards"
                  className="hover:text-[#19c7e8] transition-colors"
                >
                  Forensic Standards
                </Link>
                <a
                  href="https://github.com/TeamZulfikar/CivicAudit-AI-Frontend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#19c7e8] transition-colors"
                >
                  GitHub
                </a>
              </nav>
            </div>

            {/* Bottom Row: Micro Telemetry Badges & Copyright */}
            <div className="pt-3 border-t border-border/40 flex flex-col-reverse md:flex-row items-center justify-between gap-3 text-center md:text-left">
              {/* Disclaimer / Copyright */}
              <p className="text-[10px] sm:text-[11px] font-mono text-muted-foreground/70">
                &copy; {new Date().getFullYear()} CivicAudit AI &bull; Autonomous Tribunal Framework for Public Procurement Integrity.
              </p>

              {/* Service Telemetry Nodes */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-[10px] sm:text-[11px] font-mono text-muted-foreground/80">
                <span className="inline-flex items-center gap-1.5 rounded-[3px] border border-border/70 bg-muted/40 px-2 py-0.5">
                  <span className="size-1.5 rounded-full bg-[#19c7e8] animate-pulse" />
                  FastAPI : 8000
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-[3px] border border-border/70 bg-muted/40 px-2 py-0.5">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Next.js : 3000
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-[3px] border border-border/70 bg-muted/40 px-2 py-0.5">
                  <span className="size-1.5 rounded-full bg-cyan-400" />
                  PostgreSQL : 5435
                </span>
              </div>
            </div>
          </div>
        </footer>

        {/* AI Council & Model Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          currentSettings={currentSettings}
          onSettingsUpdated={(newBrain, newMode) => {
            setActiveBrain(newBrain);
            setCouncilMode(newMode);
          }}
        />
      </div>
    </SidebarProvider>
  );
};
