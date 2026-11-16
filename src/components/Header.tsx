"use client";

import React, { useState, useEffect } from "react";
import { Settings, ShieldCheck, Cpu, Wifi, WifiOff } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  activeBrain: string;
  councilMode: string;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeBrain,
  councilMode,
  onOpenSettings,
}) => {
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/75 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto h-14 px-4 sm:px-6 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight text-foreground">
              CivicAudit
            </span>
            <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.2 rounded">
              AI
            </span>
            <div className="h-3.5 w-px bg-border/60 mx-1 hidden sm:block" />
            <span className="text-xs text-muted-foreground hidden sm:inline font-normal">
              Procurement Forensics
            </span>
          </div>
        </div>

        {/* Clean Controls & Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Backend Connection Indicator */}
          <div
            className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground px-2 py-1 rounded-md border border-border/40 bg-muted/20"
            title={`Backend Server: ${API_BASE_URL}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                backendOnline === true
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                  : backendOnline === false
                  ? "bg-rose-500"
                  : "bg-amber-500 animate-pulse"
              }`}
            />
            <span className="text-[11px] hidden sm:inline">
              {backendOnline === true
                ? "API Active"
                : backendOnline === false
                ? "Offline"
                : "Connecting"}
            </span>
          </div>

          {/* Active Brain & Mode Pill */}
          <Badge
            variant="outline"
            className="h-7 px-2.5 gap-1.5 text-[11px] font-mono font-normal text-muted-foreground border-border/50 bg-muted/10 hidden md:flex"
          >
            <Cpu className="w-3 h-3 text-primary/80" />
            <span className="text-foreground/90 font-medium truncate max-w-[140px]">
              {activeBrain ? activeBrain.replace("OpenRouter ", "") : "Auto Cascade"}
            </span>
            <span className="text-muted-foreground/60">&bull;</span>
            <span className="uppercase text-[10px] text-muted-foreground font-semibold">
              {councilMode || "LLM"}
            </span>
          </Badge>

          {/* Theme Switcher (Light / Dark / System) */}
          <ThemeToggle />

          {/* Minimalist Settings Action Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSettings}
            className="h-8 px-2.5 text-xs gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
