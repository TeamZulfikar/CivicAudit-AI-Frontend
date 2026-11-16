"use client";

import React, { useEffect, useRef } from "react";
import {
  ShieldAlert,
  Terminal,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Clock,
  Sparkles,
  Search,
  Scale,
  FileCheck,
} from "lucide-react";
import { AuditProgressData } from "@/types/audit";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface LiveAuditProgressProps {
  progress: AuditProgressData | null;
  liveLogs: string[];
}

export const LiveAuditProgress: React.FC<LiveAuditProgressProps> = ({
  progress,
  liveLogs,
}) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the terminal to the latest line
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [liveLogs]);

  const percentage = Math.min(100, Math.max(5, progress?.percentage ?? 10));
  const stage = progress?.stage ?? 1;
  const stageName = progress?.stage_name ?? "Initializing Investigation";
  const currentStep = progress?.step ?? "Setting up forensic workspace and agent telemetry...";
  const anomaliesCount = progress?.anomalies_count ?? 0;

  const pipelineStages = [
    { num: 1, label: "Decomposition", desc: "BOQ Line Item Extraction" },
    { num: 2, label: "Market Telemetry", desc: "Wholesale Inquiry & 3-Agent Council" },
    { num: 3, label: "Statutory Law", desc: "25% Allowance & Tax Reconciliation" },
    { num: 4, label: "Synthesis", desc: "Legal Memorandum & Dossier Compilation" },
  ];

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-300">
      {/* Main Mission Control Card */}
      <Card className="border-border/60 bg-card/90 shadow-xl overflow-hidden backdrop-blur-md">
        {/* Top Header Row */}
        <div className="p-5 sm:p-6 border-b border-border/50 bg-muted/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
                  Forensic Multi-Agent Investigation Live
                </h3>
                <Badge variant="outline" className="font-mono text-[10px] text-emerald-400 border-emerald-500/40 bg-emerald-500/10">
                  Active Telemetry
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time streaming consensus deliberation between Scout, Advocate, and Arbiter
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-mono font-bold text-primary">
                {percentage}%
              </span>
              <span className="text-[11px] text-muted-foreground block font-mono">
                Pipeline Progress
              </span>
            </div>
          </div>
        </div>

        <CardContent className="p-5 sm:p-6 space-y-6">
          {/* Animated Glowing Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>{stageName}</span>
              </span>
              <span className="text-muted-foreground font-mono text-[11px]">
                {percentage < 100 ? "Processing live..." : "Complete"}
              </span>
            </div>
            <div className="w-full bg-muted/40 h-2.5 rounded-full overflow-hidden border border-border/40 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-primary/80 via-primary to-cyan-400 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(56,189,248,0.5)]"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground/90 font-mono truncate">
              &gt; {currentStep}
            </p>
          </div>

          {/* 4-Stage Stepper Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {pipelineStages.map((stg) => {
              const isPast = stage > stg.num;
              const isCurrent = stage === stg.num;
              return (
                <div
                  key={stg.num}
                  className={cn(
                    "p-3 rounded-xl border text-xs transition-all duration-200",
                    isCurrent
                      ? "border-primary/80 bg-primary/10 shadow-[0_0_12px_rgba(56,189,248,0.12)] ring-1 ring-primary/40"
                      : isPast
                      ? "border-emerald-500/40 bg-emerald-500/5 text-muted-foreground"
                      : "border-border/40 bg-muted/5 text-muted-foreground/60"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold">
                      STAGE 0{stg.num}
                    </span>
                    {isPast ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isCurrent ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-border" />
                    )}
                  </div>
                  <div className={cn("font-semibold text-xs truncate", isCurrent ? "text-foreground" : "")}>
                    {stg.label}
                  </div>
                  <p className="text-[10px] text-muted-foreground/80 mt-0.5 truncate">
                    {stg.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Current Active Item Card (when evaluating items in Stage 2) */}
          {progress?.current_item_name && (
            <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">
                    Currently Evaluating Item [{progress.current_item_index}/{progress.total_items}]:
                  </span>
                </div>
                {anomaliesCount > 0 && (
                  <Badge variant="destructive" className="text-[10px] gap-1 px-2 py-0.5">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{anomaliesCount} {anomaliesCount === 1 ? "Anomaly" : "Anomalies"} Flagged</span>
                  </Badge>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                <div className="text-xs font-bold text-foreground">
                  {progress.current_item_name}
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  {progress.quoted_price !== undefined && (
                    <span className="text-muted-foreground">
                      Quoted: <strong className="text-foreground">${progress.quoted_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                    </span>
                  )}
                  {progress.consensus_price !== undefined && (
                    <span className="text-primary font-bold">
                      Consensus: ${progress.consensus_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Live Terminal Streaming Log */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 font-mono">
                <Terminal className="w-3.5 h-3.5 text-primary" />
                <span>Live Telemetry Event Log</span>
              </div>
              <span className="text-[11px] font-mono">{liveLogs.length} events streamed</span>
            </div>

            <div className="h-44 sm:h-52 bg-slate-950/90 border border-border/70 rounded-xl p-3.5 font-mono text-[11px] leading-relaxed overflow-y-auto shadow-inner text-slate-300">
              {liveLogs.length === 0 ? (
                <div className="text-slate-500 italic py-2">
                  Connecting to streaming forensic telemetry pipe...
                </div>
              ) : (
                <div className="space-y-1">
                  {liveLogs.map((logLine, idx) => {
                    const isAlert = logLine.includes("ALERT") || logLine.includes("CRITICAL");
                    const isDebate = logLine.includes("DEBATE");
                    const isStage = logLine.includes("STAGE_");

                    return (
                      <div
                        key={idx}
                        className={cn(
                          "transition-colors",
                          isAlert
                            ? "text-rose-400 font-semibold bg-rose-950/20 px-1 rounded"
                            : isDebate
                            ? "text-cyan-300"
                            : isStage
                            ? "text-amber-300 font-medium"
                            : "text-slate-300"
                        )}
                      >
                        {logLine}
                      </div>
                    );
                  })}
                  <div ref={terminalEndRef} />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
