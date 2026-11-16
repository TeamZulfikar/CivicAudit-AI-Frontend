"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { SettingsModal } from "@/components/SettingsModal";
import { TenderIngestion } from "@/components/TenderIngestion";
import { ExecutiveMetrics } from "@/components/ExecutiveMetrics";
import { AnomalyTable } from "@/components/AnomalyTable";
import { LegalAdvisory } from "@/components/LegalAdvisory";
import { AuditLogs } from "@/components/AuditLogs";
import { LiveAuditProgress } from "@/components/LiveAuditProgress";
import {
  fetchSettings,
  streamAudit,
} from "@/lib/api";
import { AuditResponse, SettingsResponse, AuditProgressData } from "@/types/audit";
import { AlertCircle, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [activeBrain, setActiveBrain] = useState<string>("Auto Cascade");
  const [councilMode, setCouncilMode] = useState<string>("llm");
  const [currentSettings, setCurrentSettings] = useState<SettingsResponse | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [liveProgress, setLiveProgress] = useState<AuditProgressData | null>(null);
  const [liveLogs, setLiveLogs] = useState<string[]>([]);
  const [auditResult, setAuditResult] = useState<AuditResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load initial settings from backend server
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchSettings();
        setCurrentSettings(data);
        setActiveBrain(data.active_brain);
        setCouncilMode(data.council_mode);
      } catch (err: unknown) {
        console.warn("Backend settings fetch error:", err);
      }
    };
    loadSettings();
  }, []);

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

    try {
      const res = await streamAudit(
        { mode: "sample", sample },
        (ev) => {
          if (ev.log) {
            setLiveLogs((prev) => [...prev, ev.log!]);
          }
          if (ev.progress) {
            setLiveProgress(ev.progress);
          }
        }
      );
      setAuditResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Audit execution failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuditCustom = async (
    title: string,
    entity: string,
    tenderId: string,
    text: string
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
        }
      );
      setAuditResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Custom audit failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadAndAudit = async (
    file: File,
    title: string,
    entity: string,
    tenderId: string
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
        }
      );
      setAuditResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload audit failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAuditResult(null);
    setError(null);
    setLiveProgress(null);
    setLiveLogs([]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground font-sans">
      {/* Navigation Header */}
      <Header
        activeBrain={activeBrain}
        councilMode={councilMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Hero Section */}
        {!auditResult && !isLoading && (
          <div className="text-center max-w-2xl mx-auto space-y-3 pt-2 pb-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Public Procurement Integrity Tribunal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Autonomous Multi-Agent{" "}
              <span className="text-primary">Procurement Forensics</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Cross-examines tender line items against wholesale market telemetry to detect statutory markups, fiscal leakage, and contractor price collusion.
            </p>
          </div>
        )}

        {/* Input & Ingestion Section */}
        {!auditResult && !isLoading ? (
          <TenderIngestion
            onAuditPreloaded={handleAuditPreloaded}
            onAuditCustom={handleAuditCustom}
            onUploadAndAudit={handleUploadAndAudit}
            isLoading={isLoading}
          />
        ) : auditResult && !isLoading ? (
          <Card className="flex flex-row justify-between items-center px-4 py-3 border-border/50 bg-card/60 shadow-sm">
            <div className="text-xs text-muted-foreground">
              Auditing Docket: <strong className="text-foreground">#{auditResult.dossier.tender_id}</strong> &bull; {auditResult.dossier.findings.length} line items reviewed
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-8 text-xs gap-1.5 cursor-pointer border-border/60"
            >
              <RotateCcw className="w-3.5 h-3.5 text-primary" />
              <span>Audit Another Tender</span>
            </Button>
          </Card>
        ) : null}

        {/* Real-Time Live Streaming Progress Tracker */}
        {isLoading && (
          <LiveAuditProgress
            progress={liveProgress}
            liveLogs={liveLogs}
          />
        )}

        {/* Error notification */}
        {error && (
          <Card className="p-4 border-destructive/40 bg-destructive/10 text-destructive text-xs flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
              <div>
                <span className="font-bold">Investigation Encountered an Error:</span>
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

            {/* Anomaly Table with Expandable Tribunal Deliberation Cards */}
            <AnomalyTable findings={auditResult.dossier.findings} />

            {/* Executive Memorandum, Statutory Violations & Advisory */}
            <LegalAdvisory
              dossier={auditResult.dossier}
              markdown={auditResult.markdown}
            />

            {/* Live Telemetry Log Stream */}
            <AuditLogs logs={auditResult.logs} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-5 text-center text-xs text-muted-foreground/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <span>CivicAudit AI &bull; Autonomous Public Procurement Oversight</span>
          <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground/60">
            <span>FastAPI: 8000</span>
            <span>&bull;</span>
            <span>Next.js: 3000</span>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
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
  );
}
