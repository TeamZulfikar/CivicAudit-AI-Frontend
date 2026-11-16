"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TenderIngestion } from "@/components/TenderIngestion";
import { ExecutiveMetrics } from "@/components/ExecutiveMetrics";
import { AuditCharts } from "@/components/AuditCharts";
import { AnomalyTable } from "@/components/AnomalyTable";
import { LegalAdvisory } from "@/components/LegalAdvisory";
import { AuditLogs } from "@/components/AuditLogs";
import { LiveAuditProgress } from "@/components/LiveAuditProgress";
import { streamAudit } from "@/lib/api";
import { AuditResponse, AuditProgressData } from "@/types/audit";
import {
  AlertCircle,
  RotateCcw,
  ShieldCheck,
  Download,
  ArrowLeft,
  Scale,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export default function TribunalPage() {
  const { data: session } = authClient.useSession();
  const userRole =
    (session?.user as { role?: string } | undefined)?.role || null;
  const isAuthenticated = !!session?.user;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [liveProgress, setLiveProgress] = useState<AuditProgressData | null>(
    null,
  );
  const [liveLogs, setLiveLogs] = useState<string[]>([]);
  const [auditResult, setAuditResult] = useState<AuditResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper to persist audit run state to PostgreSQL and notify sidebar/vault
  const persistAuditRun = async (
    payload: Record<string, unknown>,
  ): Promise<string | null> => {
    if (!isAuthenticated) return null;
    try {
      const res = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        window.dispatchEvent(new Event("audit-created"));
        return data.audit?.id || null;
      }
    } catch (err) {
      console.warn("Failed to persist audit to database:", err);
    }
    return null;
  };

  const handleAuditPreloaded = async (sample: string) => {
    setIsLoading(true);
    setError(null);
    setLiveLogs([]);
    setLiveProgress({
      percentage: 5,
      stage: 1,
      stage_name: "Initialization",
      step: `Connecting to forensic pipeline for ${sample}...`,
      total_items: 0,
      anomalies_count: 0,
    });

    let dbAuditId: string | null = null;
    if (isAuthenticated) {
      dbAuditId = await persistAuditRun({
        tenderId: sample.replace(".json", "").toUpperCase(),
        title: `Benchmark Audit: ${sample}`,
        procuringEntity: "Preloaded Municipal Docket",
        mode: "sample",
        sampleName: sample,
        status: "in_progress",
      });
    }

    try {
      const res = await streamAudit({ mode: "sample", sample }, (ev) => {
        if (ev.log) {
          setLiveLogs((prev) => [...prev, ev.log!]);
        }
        if (ev.progress) {
          setLiveProgress(ev.progress);
        }
      });
      setAuditResult(res);

      if (dbAuditId) {
        await persistAuditRun({
          id: dbAuditId,
          status: "completed",
          totalQuoted: res.dossier.total_quoted_budget,
          fairMarket: res.dossier.fair_market_estimated_budget,
          excessAmount: res.dossier.potential_taxpayer_loss,
          riskRating: res.dossier.risk_tier,
          findingsCount: res.dossier.findings.length,
          anomaliesCount: res.dossier.findings.filter(
            (i) => i.risk_level !== "NORMAL",
          ).length,
          dossier: res.dossier,
          markdown: res.markdown,
          logs: res.logs,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Audit execution failed";
      setError(msg);
      if (dbAuditId) {
        await persistAuditRun({
          id: dbAuditId,
          status: "failed",
          error: msg,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuditCustom = async (
    title: string,
    entity: string,
    tenderId: string,
    text: string,
  ) => {
    setIsLoading(true);
    setError(null);
    setLiveLogs([]);
    setLiveProgress({
      percentage: 5,
      stage: 1,
      stage_name: "Initialization",
      step: `Preparing custom BOQ parsing for Docket #${tenderId}...`,
      total_items: 0,
      anomalies_count: 0,
    });

    let dbAuditId: string | null = null;
    if (isAuthenticated) {
      dbAuditId = await persistAuditRun({
        tenderId: tenderId || "CUSTOM-TND-2025",
        title: title || "Custom Tender Audit",
        procuringEntity: entity || "Public Authority",
        mode: "custom",
        rawText: text,
        status: "in_progress",
      });
    }

    try {
      const res = await streamAudit(
        {
          mode: "custom",
          title,
          procuring_entity: entity,
          tender_id: tenderId,
          raw_text: text,
        },
        (ev) => {
          if (ev.log) {
            setLiveLogs((prev) => [...prev, ev.log!]);
          }
          if (ev.progress) {
            setLiveProgress(ev.progress);
          }
        },
      );
      setAuditResult(res);

      if (dbAuditId) {
        await persistAuditRun({
          id: dbAuditId,
          status: "completed",
          totalQuoted: res.dossier.total_quoted_budget,
          fairMarket: res.dossier.fair_market_estimated_budget,
          excessAmount: res.dossier.potential_taxpayer_loss,
          riskRating: res.dossier.risk_tier,
          findingsCount: res.dossier.findings.length,
          anomaliesCount: res.dossier.findings.filter(
            (i) => i.risk_level !== "NORMAL",
          ).length,
          dossier: res.dossier,
          markdown: res.markdown,
          logs: res.logs,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Custom audit failed";
      setError(msg);
      if (dbAuditId) {
        await persistAuditRun({
          id: dbAuditId,
          status: "failed",
          error: msg,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadAndAudit = async (
    file: File,
    title: string,
    entity: string,
    tenderId: string,
  ) => {
    setIsLoading(true);
    setError(null);
    setLiveLogs([]);
    setLiveProgress({
      percentage: 5,
      stage: 1,
      stage_name: "Document Ingestion",
      step: `Extracting text and tables from ${file.name}...`,
      total_items: 0,
      anomalies_count: 0,
    });

    let dbAuditId: string | null = null;
    if (isAuthenticated) {
      dbAuditId = await persistAuditRun({
        tenderId: tenderId || "UPLOAD-TND-2025",
        title: title || `Document: ${file.name}`,
        procuringEntity: entity || "Public Authority",
        mode: "upload",
        filename: file.name,
        status: "in_progress",
      });
    }

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (e) => reject(e);
      });
      reader.readAsDataURL(file);
      const file_base64 = await base64Promise;

      const res = await streamAudit(
        {
          mode: "upload",
          filename: file.name,
          file_base64,
          title,
          procuring_entity: entity,
          tender_id: tenderId,
        },
        (ev) => {
          if (ev.log) {
            setLiveLogs((prev) => [...prev, ev.log!]);
          }
          if (ev.progress) {
            setLiveProgress(ev.progress);
          }
        },
      );
      setAuditResult(res);

      if (dbAuditId) {
        await persistAuditRun({
          id: dbAuditId,
          status: "completed",
          totalQuoted: res.dossier.total_quoted_budget,
          fairMarket: res.dossier.fair_market_estimated_budget,
          excessAmount: res.dossier.potential_taxpayer_loss,
          riskRating: res.dossier.risk_tier,
          findingsCount: res.dossier.findings.length,
          anomaliesCount: res.dossier.findings.filter(
            (i) => i.risk_level !== "NORMAL",
          ).length,
          dossier: res.dossier,
          markdown: res.markdown,
          logs: res.logs,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Document audit failed";
      setError(msg);
      if (dbAuditId) {
        await persistAuditRun({
          id: dbAuditId,
          status: "failed",
          error: msg,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAuditResult(null);
    setLiveLogs([]);
    setLiveProgress(null);
    setError(null);
  };

  const handleDownloadMarkdown = () => {
    if (!auditResult?.markdown) return;
    const blob = new Blob([auditResult.markdown], {
      type: "text/markdown;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CivicAudit_${auditResult.dossier.tender_id || "Report"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-6 font-sans">
      {/* Top Header & Navigation Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#d1d5db]/70 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[3px] bg-[#19c7e8]/10 border border-[#19c7e8]/30 flex items-center justify-center text-[#19c7e8]">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                <span>Autonomous Procurement Integrity Tribunal</span>
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground hidden md:inline">
            Forensic Cross-Examination Engine
          </span>
          <span className="size-1.5 rounded-full bg-[#19c7e8] animate-pulse" />
        </div>
      </div>

      {/* Signature Diagonal Hatched Divider */}
      <div
        aria-hidden="true"
        className="h-4 w-full border-y border-[#d1d5db] dark:border-white/10 hatched-divider"
      />

      {/* Input & Ingestion Section with RBAC Gates */}
      {!auditResult && !isLoading ? (
        <div id="tender-ingestion-console" className="pt-1">
          <TenderIngestion
            onAuditPreloaded={handleAuditPreloaded}
            onAuditCustom={handleAuditCustom}
            onUploadAndAudit={handleUploadAndAudit}
            isLoading={isLoading}
            userRole={userRole}
            isAuthenticated={isAuthenticated}
          />
        </div>
      ) : auditResult && !isLoading ? (
        <Card className="flex flex-row justify-between items-center px-4 py-3 border-border/50 bg-card/60 shadow-sm">
          <div className="text-xs text-muted-foreground">
            Auditing Docket:{" "}
            <strong className="text-foreground">
              #{auditResult.dossier.tender_id}
            </strong>{" "}
            &bull; {auditResult.dossier.findings.length} line items reviewed
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadMarkdown}
              className="h-8 text-xs gap-1.5 cursor-pointer border-border/60"
            >
              <Download className="w-3.5 h-3.5 text-primary" />
              <span>Download Dossier</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-8 text-xs gap-1.5 cursor-pointer border-border/60"
            >
              <RotateCcw className="w-3.5 h-3.5 text-primary" />
              <span>Audit Another Tender</span>
            </Button>
          </div>
        </Card>
      ) : null}

      {/* Real-Time Live Streaming Progress Tracker */}
      {isLoading && (
        <LiveAuditProgress progress={liveProgress} liveLogs={liveLogs} />
      )}

      {/* Error notification */}
      {error && (
        <Card className="p-4 border-destructive/40 bg-destructive/10 text-destructive text-xs flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            <div>
              <span className="font-bold">
                Investigation Encountered an Error:
              </span>
              <p className="text-destructive/90 mt-0.5">{error}</p>
            </div>
          </div>
          <Button
            variant="link"
            size="xs"
            onClick={() => setError(null)}
            className="text-xs text-destructive hover:underline p-0 h-auto cursor-pointer"
          >
            Dismiss
          </Button>
        </Card>
      )}

      {/* Forensic Results Dashboard */}
      {auditResult && !isLoading && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          {/* Top KPIs & Composite Risk Gauge */}
          <ExecutiveMetrics dossier={auditResult.dossier} />

          {/* Forensic Visualizer & Interactive Charts */}
          <AuditCharts dossier={auditResult.dossier} />

          {/* Diagonal Hatched Divider */}
          <div
            aria-hidden="true"
            className="h-4 w-full border-y border-[#d1d5db] dark:border-white/10 hatched-divider"
          />

          {/* Anomaly Table with Expandable Tribunal Deliberation Cards */}
          <AnomalyTable findings={auditResult.dossier.findings} />

          {/* Diagonal Hatched Divider */}
          <div
            aria-hidden="true"
            className="h-4 w-full border-y border-[#d1d5db] dark:border-white/10 hatched-divider"
          />

          {/* Executive Memorandum, Statutory Violations & Advisory */}
          <LegalAdvisory
            dossier={auditResult.dossier}
            markdown={auditResult.markdown}
          />

          {/* Diagonal Hatched Divider */}
          <div
            aria-hidden="true"
            className="h-4 w-full border-y border-[#d1d5db] dark:border-white/10 hatched-divider"
          />

          {/* Live Telemetry Log Stream */}
          <AuditLogs logs={auditResult.logs} />
        </div>
      )}

      {/* Bottom Diagonal Hatched Divider */}
      <div
        aria-hidden="true"
        className="h-4 w-full border-y border-[#d1d5db] dark:border-white/10 hatched-divider"
      />
    </main>
  );
}
