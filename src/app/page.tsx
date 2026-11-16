"use client";

import React from "react";
import Link from "next/link";
import { CivicHero } from "@/components/CivicHero";
import {
  Scale,
  ArrowRight,
  Database,
  FileText,
  Terminal,
  ShieldCheck,
  Sparkles,
  Layers,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-8 font-sans">
      {/* Architectural Civic Hero Section */}
      <CivicHero />

      {/* Signature Diagonal Hatched Divider */}
      <div
        aria-hidden="true"
        className="h-6 w-full border-y border-[#d1d5db] dark:border-white/10 hatched-divider"
      />

      {/* Autonomous Oversight Framework Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-[4px] border border-[#d1d5db] dark:border-white/10 bg-card/60 backdrop-blur-sm space-y-2.5">
          <div className="w-8 h-8 rounded-[3px] bg-[#19c7e8]/10 border border-[#19c7e8]/30 flex items-center justify-center text-[#19c7e8]">
            <Database className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-foreground tracking-tight">
            Wholesale Price Benchmark Index
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Every line item in a public tender docket is cross-referenced against historical wholesale procurement records, trade commodity schedules, and manufacturer baseline price ceilings.
          </p>
        </div>

        <div className="p-5 rounded-[4px] border border-[#d1d5db] dark:border-white/10 bg-card/60 backdrop-blur-sm space-y-2.5">
          <div className="w-8 h-8 rounded-[3px] bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
            <Scale className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-foreground tracking-tight">
            Multi-Agent Adversarial Cross-Examination
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Red team auditors, benchmark specialists, and legal counsel LLM agents deliberate concurrently inside a secure sandbox to calculate potential fiscal overcharges and detect contractor cartels.
          </p>
        </div>

        <div className="p-5 rounded-[4px] border border-[#d1d5db] dark:border-white/10 bg-card/60 backdrop-blur-sm space-y-2.5">
          <div className="w-8 h-8 rounded-[3px] bg-[#19c7e8]/10 border border-[#19c7e8]/30 flex items-center justify-center text-[#19c7e8]">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-foreground tracking-tight">
            Court-Ready Forensic Dossiers
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Sealed forensic dossiers with line-by-line item anomalies, statutory violations (PPA Form 8-A), and calculated taxpayer loss metrics are permanently recorded in a PostgreSQL ledger.
          </p>
        </div>
      </section>

      {/* Signature Diagonal Hatched Divider */}
      <div
        aria-hidden="true"
        className="h-6 w-full border-y border-[#d1d5db] dark:border-white/10 hatched-divider"
      />

      {/* Redesigned Hero6 Architectural CTA Section */}
      <section className="relative isolate rounded-[4px] border border-[#d1d5db] dark:border-white/15 bg-card/50 backdrop-blur-md overflow-hidden p-6 sm:p-8 md:p-12 shadow-sm">
        {/* Technical Corner Pin Accents */}
        <span aria-hidden="true" className="absolute size-[5px] bg-[#19c7e8] -top-[3px] -left-[3px]" />
        <span aria-hidden="true" className="absolute size-[5px] bg-[#19c7e8] -top-[3px] -right-[3px]" />
        <span aria-hidden="true" className="absolute size-[5px] bg-[#19c7e8] -bottom-[3px] -left-[3px]" />
        <span aria-hidden="true" className="absolute size-[5px] bg-[#19c7e8] -bottom-[3px] -right-[3px]" />

        {/* Diagonal Background Texture Accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-30 [background-image:radial-gradient(ellipse_70%_60%_at_100%_0%,rgba(25,199,232,0.18)_0%,transparent_60%),radial-gradient(ellipse_50%_50%_at_0%_100%,rgba(14,154,184,0.1)_0%,transparent_50%)]"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading, Subtitle & Action Triggers */}
          <div className="lg:col-span-7 space-y-5">
            {/* Telemetry Status Line */}
            <div className="inline-flex items-center gap-2 rounded-[3px] border border-[#19c7e8]/30 bg-[#19c7e8]/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[#19c7e8]">
              <span className="size-1.5 rounded-full bg-[#19c7e8] animate-pulse" />
              <span>Civic Forensic Protocol &bull; Ready for Docket Ingestion</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-[-0.03em] text-foreground leading-[1.08]">
              Interrogate Public Contracts with <span className="text-[#19c7e8] font-medium">Autonomous Rigor</span>.
            </h2>

            {/* Description Paragraph */}
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl font-mono">
              Upload PDF tender books, Excel bills of quantities, or paste raw line items. Our multi-agent tribunal verifies every price against statutory wholesale indexes and exports sealed court-ready audit dossiers.
            </p>

            {/* Micro Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs font-mono text-foreground/90">
                <span className="text-[#19c7e8] font-bold">01.</span>
                <span>PDF & Excel OCR</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-foreground/90">
                <span className="text-[#19c7e8] font-bold">02.</span>
                <span>Market Price Ceilings</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-foreground/90">
                <span className="text-[#19c7e8] font-bold">03.</span>
                <span>PPA Form 8-A Audit</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/tribunal">
                <Button
                  size="default"
                  className="rounded-[3px] border border-[#d1d5db] dark:border-white/20 bg-[#19c7e8] text-black hover:opacity-90 font-mono text-xs font-semibold px-6 py-2.5 shadow-[0_0_25px_rgba(25,199,232,0.35)] cursor-pointer gap-2"
                >
                  <span>Launch Tribunal Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>

              <Link href="/#statutory-standards">
                <Button
                  variant="outline"
                  size="default"
                  className="rounded-[3px] border-[#d1d5db] dark:border-white/20 hover:bg-muted font-mono text-xs px-5 py-2.5 cursor-pointer"
                >
                  <span>Forensic Methodology</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Architectural Terminal Box Preview */}
          <div className="lg:col-span-5">
            <div className="rounded-[4px] border border-white/10 bg-black/95 p-4 sm:p-5 text-white shadow-[0_0_40px_rgba(25,199,232,0.15)] font-mono text-xs backdrop-blur-md">
              {/* Traffic Light Windows Top */}
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#ff5f57]" />
                  <span className="size-2 rounded-full bg-[#febc2e]" />
                  <span className="size-2 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-[10px] text-white/50 tracking-widest uppercase">
                  TRIBUNAL-PIPELINE // v2.5
                </span>
              </div>

              {/* Terminal Execution Body */}
              <div className="space-y-2.5 text-[11px] leading-relaxed">
                <div className="text-white/40 flex items-center gap-1.5">
                  <span className="text-[#19c7e8]">&gt;</span>
                  <span>civic-audit --convene --statutory-check</span>
                </div>

                <div className="text-emerald-400/90 pl-3 border-l border-emerald-500/30">
                  [OK] Ingestion pipeline initialized.
                </div>

                <div className="text-[#8bf0ff] pl-3 border-l border-[#19c7e8]/30">
                  [ORCHESTRATOR] 4 Forensic Agents Active:
                  <ul className="text-white/70 pl-2 mt-1 space-y-0.5 text-[10px]">
                    <li>&bull; Red Team Lead (Price Gouging)</li>
                    <li>&bull; Wholesale Benchmark Specialist</li>
                    <li>&bull; Auditor General AI (Fiscal Quant)</li>
                    <li>&bull; Statutory Procurement Counsel</li>
                  </ul>
                </div>

                <div className="text-amber-400/90 pl-3 border-l border-amber-500/30">
                  [SCAN] Anomaly Detection: 227% overcharge limit.
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/50">
                  <span>POSTGRESQL // LEDGER VERIFIED</span>
                  <span className="text-emerald-400 font-bold">READY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Diagonal Hatched Divider */}
      <div
        aria-hidden="true"
        className="h-6 w-full border-y border-[#d1d5db] dark:border-white/10 hatched-divider"
      />
    </main>
  );
}
