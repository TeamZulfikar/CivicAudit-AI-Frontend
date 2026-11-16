"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Building2,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  ShieldCheck,
  User,
  Loader2,
  Trash2,
  Copy,
  Check,
  BarChart3,
  Layers,
  Scale,
  Terminal,
  ExternalLink,
  ShieldAlert,
  RotateCcw,
} from "lucide-react";
import { ExecutiveMetrics } from "@/components/ExecutiveMetrics";
import { AuditCharts } from "@/components/AuditCharts";
import { AnomalyTable } from "@/components/AnomalyTable";
import { LegalAdvisory } from "@/components/LegalAdvisory";
import { AuditLogs } from "@/components/AuditLogs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { AuditDossier } from "@/types/audit";

interface SavedAuditRecord {
  id: string;
  tenderId: string;
  title: string;
  procuringEntity: string;
  mode: string;
  status: string;
  sampleName?: string | null;
  filename?: string | null;
  totalQuoted?: number | null;
  fairMarket?: number | null;
  excessAmount?: number | null;
  riskRating?: string | null;
  findingsCount?: number | null;
  anomaliesCount?: number | null;
  dossier?: AuditDossier | null;
  markdown?: string | null;
  logs?: string[] | null;
  error?: string | null;
  createdAt: string;
  user?: {
    name: string;
    email: string;
    role?: string;
  } | null;
}

type ViewSection = "all" | "overview" | "items" | "legal" | "logs";

export default function AuditDetailPage() {
  const params = useParams();
  const router = useRouter();
  const auditId = params?.id as string;

  const { data: session } = authClient.useSession();
  const [audit, setAudit] = useState<SavedAuditRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [copiedDocket, setCopiedDocket] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<ViewSection>("all");

  useEffect(() => {
    if (!auditId) return;

    const fetchAudit = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/audits/${auditId}`);
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 403) {
            router.push("/login?callbackUrl=/audit/" + auditId);
            return;
          }
          throw new Error(data.error || "Failed to load audit record.");
        }

        setAudit(data.audit);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Error loading audit dossier.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudit();
  }, [auditId, router]);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this audit record from the database?",
      )
    ) {
      return;
    }
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/audits/${auditId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/");
      } else {
        const data = await res.json();
        alert(`Deletion failed: ${data.error}`);
      }
    } catch {
      alert("Failed to delete audit record.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadMarkdown = () => {
    if (!audit?.markdown) {
      alert("No markdown dossier available for this audit.");
      return;
    }
    const blob = new Blob([audit.markdown], {
      type: "text/markdown;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CivicAudit_${audit.tenderId || "Report"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyDocket = () => {
    const docketText = audit?.tenderId || auditId;
    navigator.clipboard.writeText(docketText);
    setCopiedDocket(true);
    setTimeout(() => setCopiedDocket(false), 2000);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const isAdmin = userRole === "admin";

  return (
    <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & BREADCRUMB BAR */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-border/50 pb-4 sm:pb-5">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/")}
            className="h-8 px-2.5 text-xs gap-1.5 cursor-pointer border-border/60 hover:bg-muted"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Portal</span>
          </Button>

          <div className="h-4 w-px bg-border/60 hidden sm:block" />

          {/* Docket Title & Status Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-foreground flex items-center gap-1.5">
              <span>Docket #{audit?.tenderId || auditId}</span>
            </h1>

            <button
              type="button"
              onClick={handleCopyDocket}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
              title="Copy Docket ID"
            >
              {copiedDocket ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            {audit?.status === "completed" && (
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-mono"
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
            {audit?.status === "in_progress" && (
              <Badge
                variant="outline"
                className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] font-mono animate-pulse"
              >
                <Clock className="w-3 h-3 mr-1" />
                In Progress
              </Badge>
            )}
            {audit?.status === "failed" && (
              <Badge variant="destructive" className="text-[10px] font-mono">
                <AlertCircle className="w-3 h-3 mr-1" />
                Failed
              </Badge>
            )}

            {audit?.dossier?.risk_tier && (
              <Badge
                variant={
                  audit.dossier.risk_tier.includes("CRITICAL")
                    ? "destructive"
                    : audit.dossier.risk_tier.includes("HIGH")
                      ? "secondary"
                      : "outline"
                }
                className="text-[10px] font-mono font-bold uppercase"
              >
                {audit.dossier.risk_tier}
              </Badge>
            )}
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
          <Link href="/tribunal">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5 cursor-pointer border-[#19c7e8]/40 hover:bg-[#19c7e8]/10 text-foreground"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#19c7e8]" />
              <span className="hidden sm:inline">New Tribunal Audit</span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>

          {audit?.markdown && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadMarkdown}
              className="h-8 text-xs gap-1.5 cursor-pointer border-border/60 hover:bg-muted"
            >
              <Download className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Download Dossier</span>
              <span className="sm:hidden">Export</span>
            </Button>
          )}

          {session?.user && (
            <Button
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={handleDelete}
              className="h-8 text-xs gap-1.5 cursor-pointer text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          )}
        </div>
      </div>

      {/* Signature Diagonal Hatched Divider */}
      <div
        aria-hidden="true"
        className="h-5 w-full border-y border-[#d1d5db] dark:border-white/10 hatched-divider"
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-xs text-muted-foreground">
            Retrieving forensic dossier, audit ledger & line-item telemetry from
            database...
          </p>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <Card className="p-4 border-destructive/40 bg-destructive/10 text-destructive text-xs flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            <div>
              <span className="font-bold">Database Error:</span>
              <p className="text-destructive/90 mt-0.5">{error}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/")}
            className="text-xs"
          >
            Go Back
          </Button>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 2. AUDIT DOSSIER CONTENT */}
      {/* ========================================================================= */}
      {!isLoading && audit && audit.dossier && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* Metadata Provenance Card */}
          <Card className="p-3.5 sm:p-4 border-border/50 bg-muted/20 text-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-sm sm:text-base font-bold text-foreground">
                  {audit.title || audit.dossier.title}
                </h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>
                    Procuring Entity:{" "}
                    {audit.procuringEntity || audit.dossier.procuring_entity}
                  </span>
                </p>
              </div>

              {/* Provenance Pills */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] font-mono text-muted-foreground">
                <div className="flex items-center gap-1 bg-background/60 px-2 py-1 rounded border border-border/50">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span>{formatDate(audit.createdAt)}</span>
                </div>

                <div className="flex items-center gap-1 bg-background/60 px-2 py-1 rounded border border-border/50">
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  <span>Mode: {audit.mode}</span>
                </div>

                {audit.user && (
                  <div className="flex items-center gap-1 bg-background/60 px-2 py-1 rounded border border-border/50">
                    <User className="w-3 h-3 text-muted-foreground" />
                    <span className="truncate max-w-[160px]">
                      {audit.user.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* ===================================================================== */}
          {/* SECTION 1: EXECUTIVE KPIS & VISUAL CHARTS */}
          {/* ===================================================================== */}
          {(activeSection === "all" || activeSection === "overview") && (
            <div className="space-y-6">
              {/* Executive Metrics Cards */}
              <ExecutiveMetrics dossier={audit.dossier} />

              {/* Forensic Graphs & Interactive Visualizer */}
              <AuditCharts dossier={audit.dossier} />
            </div>
          )}

          {activeSection === "all" && (
            <div
              aria-hidden="true"
              className="h-4 w-full border-y border-[#d1d5db] dark:border-white/10 hatched-divider"
            />
          )}

          {/* ===================================================================== */}
          {/* SECTION 2: ANOMALY TABLE & AGENT DELIBERATIONS */}
          {/* ===================================================================== */}
          {(activeSection === "all" || activeSection === "items") && (
            <div className="space-y-4">
              <AnomalyTable findings={audit.dossier.findings} />
            </div>
          )}

          {activeSection === "all" && (
            <div
              aria-hidden="true"
              className="h-4 w-full border-y border-[#d1d5db] dark:border-white/10 hatched-divider"
            />
          )}

          {/* ===================================================================== */}
          {/* SECTION 3: LEGAL ADVISORY, STATUTORY VIOLATIONS & ACTIONS */}
          {/* ===================================================================== */}
          {(activeSection === "all" || activeSection === "legal") && (
            <div className="space-y-4">
              <LegalAdvisory
                dossier={audit.dossier}
                markdown={audit.markdown || ""}
              />
            </div>
          )}

          {activeSection === "all" && audit.logs && audit.logs.length > 0 && (
            <div
              aria-hidden="true"
              className="h-4 w-full border-y border-[#d1d5db] dark:border-white/10 hatched-divider"
            />
          )}

          {/* ===================================================================== */}
          {/* SECTION 4: TELEMETRY EXECUTION LOGS */}
          {/* ===================================================================== */}
          {(activeSection === "all" || activeSection === "logs") &&
            audit.logs &&
            Array.isArray(audit.logs) &&
            audit.logs.length > 0 && (
              <div className="space-y-4">
                <AuditLogs logs={audit.logs} />
              </div>
            )}
        </div>
      )}

      {/* If audit failed during execution */}
      {!isLoading && audit && audit.status === "failed" && (
        <Card className="p-6 sm:p-8 border-destructive/30 bg-destructive/5 space-y-3 text-center">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
          <h3 className="font-bold text-foreground text-sm sm:text-base">
            Forensic Investigation Halted
          </h3>
          <p className="text-xs text-muted-foreground max-w-lg mx-auto">
            {audit.error ||
              "The multi-agent tribunal encountered an unrecoverable parsing or inference failure during procurement analysis."}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/")}
            className="mt-2 text-xs"
          >
            Return to Audit Console
          </Button>
        </Card>
      )}
    </main>
  );
}
