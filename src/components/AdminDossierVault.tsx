"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Plus,
  RefreshCw,
  X,
  FileText,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Database,
  Command,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSidebar } from "@/components/SidebarContext";

export interface AuditHistoryItem {
  id: string;
  tenderId: string;
  title: string;
  procuringEntity: string;
  mode: string;
  status: string;
  totalQuoted?: number | null;
  fairMarket?: number | null;
  excessAmount?: number | null;
  riskRating?: string | null;
  findingsCount?: number | null;
  anomaliesCount?: number | null;
  createdAt: string;
}

export const AdminDossierVault: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const sidebar = useSidebar();

  const isOpen = sidebar?.isOpen ?? false;
  const setIsOpen = sidebar?.setIsOpen ?? (() => {});

  const [audits, setAudits] = useState<AuditHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "CRITICAL" | "COMPLETED">("ALL");
  const [isLoading, setIsLoading] = useState(false);

  // Active audit id from current route
  const activeAuditId = pathname?.startsWith("/audit/") ? pathname.split("/")[2] : undefined;

  const fetchAudits = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/audits", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setAudits(data.audits || []);
      }
    } catch (err) {
      console.warn("Failed to fetch audit history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();

    const handleAuditCreated = () => {
      fetchAudits();
    };

    window.addEventListener("audit-created", handleAuditCreated);
    return () => window.removeEventListener("audit-created", handleAuditCreated);
  }, []);

  // Keyboard shortcut listener (Cmd/Ctrl + K or Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  const filteredAudits = audits.filter((a) => {
    if (statusFilter === "CRITICAL" && (!a.riskRating || !a.riskRating.includes("CRITICAL"))) {
      return false;
    }
    if (statusFilter === "COMPLETED" && a.status !== "completed") {
      return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.tenderId.toLowerCase().includes(q) ||
      a.title.toLowerCase().includes(q) ||
      a.procuringEntity.toLowerCase().includes(q) ||
      (a.riskRating && a.riskRating.toLowerCase().includes(q))
    );
  });

  const formatCurrency = (val?: number | null) => {
    if (val === null || val === undefined) return "$0";
    return "$" + Number(val).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const handleSelectAudit = (id: string) => {
    setIsOpen(false);
    router.push(`/audit/${id}`);
  };

  const handleNewAudit = () => {
    setIsOpen(false);
    router.push("/");
  };

  return (
    <>
      {/* Floating Architectural HUD Pill Trigger (Bottom Right) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-[4px] border border-[#19c7e8]/40 bg-[#061f28]/95 text-white px-3.5 py-2 font-mono text-xs shadow-[0_0_35px_rgba(25,199,232,0.25)] backdrop-blur-md transition-all hover:scale-105 hover:border-[#19c7e8] cursor-pointer"
        title="Toggle Forensic Dossier Vault (⌘K)"
      >
        <span className="size-2 rounded-full bg-[#19c7e8] animate-pulse" />
        <span className="font-semibold tracking-tight">Dossier Vault</span>
        <span className="text-[10px] text-white/50 bg-white/10 px-1.5 py-0.5 rounded font-mono">
          {audits.length}
        </span>
        <span className="hidden sm:inline-block text-[10px] text-white/40 border border-white/15 px-1 rounded">
          ⌘K
        </span>
      </button>

      {/* Slide-Over Dossier Vault Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Body */}
          <aside className="relative w-full max-w-md sm:max-w-lg bg-[#040d12] border-l border-[#d1d5db]/30 dark:border-white/15 text-foreground shadow-2xl flex flex-col h-full z-10 font-sans">
            {/* Top Mac Terminal Traffic Lights Bar */}
            <div className="px-5 py-4 border-b border-[#d1d5db]/20 dark:border-white/10 bg-[#061f28] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="size-2 rounded-full bg-[#ff5f57]" />
                  <span className="size-2 rounded-full bg-[#febc2e]" />
                  <span className="size-2 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-[#19c7e8]" />
                  <span className="font-mono text-xs font-semibold text-white tracking-wide uppercase">
                    Forensic Dossier Vault
                  </span>
                  <Badge variant="outline" className="text-[9px] font-mono text-[#19c7e8] border-[#19c7e8]/30">
                    {audits.length} Records
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchAudits}
                  className="p-1 rounded text-white/60 hover:text-white transition-colors cursor-pointer"
                  title="Refresh Audit Ledger"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#19c7e8]" : ""}`} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded text-white/60 hover:text-white transition-colors cursor-pointer"
                  title="Close Vault (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Signature Diagonal Hatched Divider */}
            <div
              aria-hidden="true"
              className="h-4 w-full border-b border-[#d1d5db]/20 dark:border-white/10 hatched-divider shrink-0 text-white"
            />

            {/* Actions Bar: New Audit + Search */}
            <div className="p-4 space-y-3 bg-[#061720]/80 border-b border-white/10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleNewAudit}
                  className="flex-1 flex items-center justify-center gap-2 rounded-[3px] border border-[#19c7e8]/40 bg-[#19c7e8] text-black px-4 py-2 font-mono text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Tender Investigation</span>
                </button>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Filter by docket #, title, authority..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-8 h-8 text-xs bg-black/60 border-white/15 text-white placeholder:text-white/40 rounded-[3px] focus-visible:ring-1 focus-visible:ring-[#19c7e8]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                {(["ALL", "CRITICAL", "COMPLETED"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setStatusFilter(filter)}
                    className={`px-2.5 py-1 rounded-[3px] border transition-colors cursor-pointer ${
                      statusFilter === filter
                        ? "border-[#19c7e8] bg-[#19c7e8]/10 text-[#19c7e8] font-bold"
                        : "border-white/10 text-white/50 hover:text-white/80"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Audit Dossier List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {isLoading && audits.length === 0 ? (
                <div className="py-16 text-center space-y-2 text-white/50 text-xs">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#19c7e8]" />
                  <p>Synchronizing with PostgreSQL ledger...</p>
                </div>
              ) : filteredAudits.length === 0 ? (
                <div className="py-16 text-center space-y-2 text-white/40 text-xs">
                  <FileText className="w-6 h-6 mx-auto stroke-1 text-white/30" />
                  <p className="font-mono">No audit dossiers found.</p>
                  <p className="text-[11px]">Run a tender audit to seal it in the immutable ledger.</p>
                </div>
              ) : (
                filteredAudits.map((item) => {
                  const isCurrent = activeAuditId === item.id;
                  const isCritical = item.riskRating?.includes("CRITICAL");

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectAudit(item.id)}
                      className={`group p-3.5 rounded-[4px] border transition-all cursor-pointer ${
                        isCurrent
                          ? "border-[#19c7e8] bg-[#0c2734] shadow-[0_0_20px_rgba(25,199,232,0.15)]"
                          : "border-white/10 bg-black/40 hover:border-white/25 hover:bg-black/60"
                      }`}
                    >
                      {/* Top Row: Docket ID + Status Dot */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`size-2 rounded-full ${
                              item.status === "completed"
                                ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                                : item.status === "in_progress"
                                  ? "bg-blue-400 animate-pulse"
                                  : "bg-rose-400"
                            }`}
                            title={`Status: ${item.status}`}
                          />
                          <span className="font-mono text-xs font-bold text-white group-hover:text-[#19c7e8] transition-colors">
                            #{item.tenderId}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/50">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-medium text-white/90 line-clamp-1 mb-1">
                        {item.title}
                      </h4>

                      {/* Procuring Entity */}
                      <p className="text-[11px] text-white/50 line-clamp-1 font-mono mb-2">
                        {item.procuringEntity}
                      </p>

                      {/* Metrics Footer Strip */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-white/40">Quoted: {formatCurrency(item.totalQuoted)}</span>
                          {item.excessAmount && item.excessAmount > 0 ? (
                            <span className="text-rose-400 font-semibold">
                              +{formatCurrency(item.excessAmount)} Loss
                            </span>
                          ) : null}
                        </div>

                        {item.riskRating && (
                          <Badge
                            variant={isCritical ? "destructive" : "outline"}
                            className="text-[9px] font-mono uppercase px-1.5 py-0"
                          >
                            {item.riskRating.replace("_RISK", "")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Keyboard Shortcut Hint */}
            <div className="p-3 border-t border-white/10 bg-[#061720] text-center text-[10px] font-mono text-white/40 flex items-center justify-center gap-3">
              <span>Press <strong className="text-white">⌘K</strong> to toggle</span>
              <span>&bull;</span>
              <span><strong className="text-white">Esc</strong> to dismiss</span>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
