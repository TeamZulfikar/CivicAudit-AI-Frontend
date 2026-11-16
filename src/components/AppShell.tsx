"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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

        {/* Diagonal Hatched Divider above footer */}
        <div
          aria-hidden="true"
          className="h-6 w-full border-y border-[#d1d5db] dark:border-white/10 hatched-divider"
        />

        {/* Global Footer */}
        <footer className="py-6 text-center text-xs text-muted-foreground/80 bg-card/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">CivicAudit AI</span>
              <span>&bull;</span>
              <span>Autonomous Multi-Agent Procurement Integrity Engine</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground/70">
              <span className="flex items-center gap-1">
                <span className="size-1 rounded-full bg-[#19c7e8]" />
                FastAPI : 8000
              </span>
              <span>&bull;</span>
              <span>Next.js : 3000</span>
              <span>&bull;</span>
              <span>PostgreSQL : 5435</span>
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
