"use client";

import React from "react";
import Link from "next/link";
import { motion, MotionConfig } from "motion/react";
import { ShieldCheck, ArrowRight, Play, Terminal, Database, FileCheck } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

interface CivicHeroProps {
  onLaunchAudit?: () => void;
}

export const CivicHero: React.FC<CivicHeroProps> = ({ onLaunchAudit }) => {
  const scrollToIngestion = () => {
    if (onLaunchAudit) {
      onLaunchAudit();
      return;
    }
    const elem = document.getElementById("tender-ingestion-console");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="w-full overflow-x-clip font-sans text-foreground">
        {/* Main Hero Framing Section */}
        <section className="border border-[#d1d5db] dark:border-white/15 bg-card/40 backdrop-blur-sm">
          <div className="flex flex-col items-center px-3 sm:px-6 pb-12 pt-14 sm:pb-16 sm:pt-20 text-center">
            {/* Top Announcement Pill */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
              className="mb-6 inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground text-center max-w-full px-2"
            >
              <span className="inline-flex items-center gap-1.5 shrink-0">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-[#19c7e8] animate-pulse shrink-0" />
                <span>Autonomous Procurement Integrity Tribunal</span>
              </span>
              <span aria-hidden="true" className="text-muted-foreground/60 hidden xs:inline sm:inline">-</span>
              <button
                type="button"
                onClick={scrollToIngestion}
                className="text-[#19c7e8] hover:underline cursor-pointer font-semibold whitespace-nowrap"
              >
                Launch Audit Console
              </button>
            </motion.div>

            {/* Architectural Headline */}
            <h1 className="max-w-4xl text-[clamp(1.65rem,6vw,4.2rem)] font-normal leading-[1.08] sm:leading-[1.03] tracking-[-0.03em] text-foreground">
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block font-medium"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                >
                  The autonomous tribunal
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block text-[#19c7e8]"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, delay: 0.32, ease: EASE }}
                >
                  for public procurement
                </motion.span>
              </span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 max-w-[500px] font-mono text-xs sm:text-[13px] leading-relaxed text-muted-foreground"
            >
              CivicAudit AI runs multi-agent forensic tribunals against government tender dockets — cross-examining line items against statutory wholesale benchmarks to expose bid inflation, contractor cartels, and taxpayer fiscal loss.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
              className="mt-8 flex flex-wrap justify-center gap-3.5"
            >
              <button
                type="button"
                onClick={scrollToIngestion}
                className="rounded-[3px] border border-[#d1d5db] dark:border-white/20 bg-[#19c7e8] text-black px-6 py-2.5 font-mono text-xs font-semibold transition-all hover:opacity-90 hover:shadow-[0_0_20px_rgba(25,199,232,0.4)] cursor-pointer"
              >
                Launch Tribunal Audit
              </button>

              <a
                href="#statutory-standards"
                className="relative rounded-[3px] border border-[#d1d5db]/80 dark:border-white/20 px-6 py-2.5 font-mono text-xs text-foreground transition-colors hover:bg-muted/70 cursor-pointer"
              >
                <span aria-hidden="true" className="absolute size-[5px] bg-[#d1d5db] dark:bg-white/40 -left-[3px] -top-[3px]" />
                <span aria-hidden="true" className="absolute size-[5px] bg-[#d1d5db] dark:bg-white/40 -right-[3px] -top-[3px]" />
                <span aria-hidden="true" className="absolute size-[5px] bg-[#d1d5db] dark:bg-white/40 -bottom-[3px] -left-[3px]" />
                <span aria-hidden="true" className="absolute size-[5px] bg-[#d1d5db] dark:bg-white/40 -bottom-[3px] -right-[3px]" />
                Forensic Standards
              </a>
            </motion.div>
          </div>

          {/* Interactive Dual-Window Browser & Terminal Live Demonstration */}
          <div className="px-3 pb-5 sm:px-6 md:mx-[4%] md:px-0 md:pb-14">
            <div className="relative isolate grid gap-4 bg-[#061f28] p-4 sm:p-6 md:p-8 [background-image:radial-gradient(ellipse_55%_75%_at_80%_15%,#8bf0ff_0%,transparent_55%),radial-gradient(ellipse_70%_50%_at_15%_95%,#0e9ab8_0%,transparent_60%),radial-gradient(ellipse_60%_45%_at_45%_55%,#0a4a5f_0%,transparent_70%)] md:grid-cols-[1.1fr_0.9fr] md:items-start rounded-[4px] border border-white/10 shadow-[0_0_50px_rgba(25,199,232,0.18)]">
              {/* Noise Texture Overlay */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 opacity-50 mix-blend-overlay noise-overlay"
              />

              {/* Window 1: Multi-Agent Tribunal Deliberations */}
              <div
                role="region"
                aria-label="Multi-Agent Tribunal Deliberation Preview"
                className="rounded-[4px] border border-white/10 bg-black/90 p-4 sm:p-5 text-white shadow-[0_0_40px_rgba(25,199,232,0.14)] text-xs backdrop-blur-md"
              >
                {/* Traffic Lights */}
                <div aria-hidden="true" className="mb-4 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <span className="size-2 rounded-full bg-[#ff5f57]" />
                    <span className="size-2 rounded-full bg-[#febc2e]" />
                    <span className="size-2 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">
                    Multi-Agent Consensus Matrix
                  </span>
                </div>

                <ul className="flex flex-col gap-3.5">
                  <li className="flex gap-2.5 leading-snug">
                    <span className="mt-0.5 size-3.5 shrink-0 rounded-[3px] bg-[#3d5afe]" title="Red Team Agent" />
                    <div>
                      <span className="text-[10px] font-mono text-white/60 block">Red Team Lead:</span>
                      <span className="text-white/95">Auditing Tender #DOT-2024-884: Municipal Asphalt Resurfacing Project.</span>
                    </div>
                  </li>

                  <li className="flex gap-2.5 leading-snug">
                    <span className="mt-0.5 size-3.5 shrink-0 rounded-[3px] bg-[#3bb8a4]" title="Benchmark Specialist" />
                    <div>
                      <span className="text-[10px] font-mono text-[#3bb8a4] block">Market Benchmark Agent:</span>
                      <span className="font-mono text-white/80">
                        Quoted Asphalt Binder at $420.00/ton. Statutory fair market index: $128.50/ton (+227% gouging detected).
                      </span>
                    </div>
                  </li>

                  <li className="flex gap-2.5 leading-snug">
                    <span className="mt-0.5 size-3.5 shrink-0 rounded-[3px] bg-[#f87171]" title="Auditor General AI" />
                    <div>
                      <span className="text-[10px] font-mono text-[#f87171] block">Auditor General AI:</span>
                      <span className="text-white/90">
                        Composite taxpayer fiscal loss calculated at <strong className="text-[#f87171] font-mono">$1,420,000</strong>. Statutory overcharge threshold exceeded.
                      </span>
                    </div>
                  </li>

                  <li className="flex gap-2.5 leading-snug">
                    <span className="mt-0.5 size-3.5 shrink-0 rounded-[3px] bg-[#19c7e8]" title="Statutory Legal Counsel" />
                    <div>
                      <span className="text-[10px] font-mono text-[#19c7e8] block">Statutory Counsel:</span>
                      <span className="font-mono text-white/80">
                        Violation of Public Procurement Act Art. 42. Form 8-A frozen and audit signed into PostgreSQL ledger.
                      </span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Window 2: Forensic Execution Trail & Schedule */}
              <div
                role="region"
                aria-label="Forensic Automation Trail"
                className="rounded-[4px] border border-white/10 bg-black/90 p-4 sm:p-5 text-white shadow-[0_0_40px_rgba(25,199,232,0.14)] font-mono text-xs backdrop-blur-md"
              >
                {/* Traffic Lights */}
                <div aria-hidden="true" className="mb-4 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <span className="size-2 rounded-full bg-[#ff5f57]" />
                    <span className="size-2 rounded-full bg-[#febc2e]" />
                    <span className="size-2 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="text-[10px] text-white/50 uppercase tracking-widest">
                    Telemetry Schedule
                  </span>
                </div>

                <ul className="flex flex-col gap-4 pt-1">
                  <li>
                    <div className="flex items-baseline gap-2 text-[12px] sm:text-[13px]">
                      <span className="text-[#19c7e8]">09:10</span>
                      <span aria-hidden="true" className="flex-1 border-b border-dotted border-white/40" />
                      <span>09:22</span>
                    </div>
                    <div className="mt-1 flex justify-between text-[10px] text-white/60">
                      <span>Docket Ingestion</span>
                      <span>OCR Line Extraction</span>
                    </div>
                  </li>

                  <li>
                    <div className="flex items-baseline gap-2 text-[12px] sm:text-[13px]">
                      <span className="text-[#19c7e8]">09:35</span>
                      <span aria-hidden="true" className="flex-1 border-b border-dotted border-white/40" />
                      <span>09:50</span>
                    </div>
                    <div className="mt-1 flex justify-between text-[10px] text-white/60">
                      <span>Multi-LLM Debate</span>
                      <span>Statutory Consensus</span>
                    </div>
                  </li>

                  <li>
                    <div className="flex items-baseline gap-2 text-[12px] sm:text-[13px]">
                      <span className="text-[#19c7e8]">10:05</span>
                      <span aria-hidden="true" className="flex-1 border-b border-dotted border-white/40" />
                      <span>10:15</span>
                    </div>
                    <div className="mt-1 flex justify-between text-[10px] text-white/60">
                      <span>Loss Quantification</span>
                      <span>Collusion Detection</span>
                    </div>
                  </li>

                  <li>
                    <div className="flex items-baseline gap-2 text-[12px] sm:text-[13px]">
                      <span className="text-[#19c7e8]">10:30</span>
                      <span aria-hidden="true" className="flex-1 border-b border-dotted border-white/40" />
                      <span className="text-emerald-400 font-bold">SAVED</span>
                    </div>
                    <div className="mt-1 flex justify-between text-[10px] text-white/60">
                      <span>Dossier Sealed</span>
                      <span>PostgreSQL Ledger</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Diagonal Hatched Divider */}
        <div
          aria-hidden="true"
          className="h-8 border-x border-[#d1d5db] dark:border-white/15 border-t-0 hatched-divider"
        />

        {/* 3-Column Key Figures & Telemetry Strip */}
        <section
          aria-label="Procurement Oversight Figures"
          className="grid border border-[#d1d5db] dark:border-white/15 sm:grid-cols-3 bg-card/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0, ease: EASE }}
            className="p-4 sm:p-5"
          >
            <p className="text-2xl sm:text-3xl font-normal tracking-tight text-foreground font-mono">
              &lt;1.2s
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              From Tender Ingestion to Market Ceilings
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            className="p-4 sm:p-5 border-t border-[#d1d5db] dark:border-white/15 sm:border-l sm:border-t-0"
          >
            <p className="text-2xl sm:text-3xl font-normal tracking-tight text-[#19c7e8] font-mono">
              $48.6M+
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Public Procurement Capital Audited
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
            className="p-4 sm:p-5 border-t border-[#d1d5db] dark:border-white/15 sm:border-l sm:border-t-0"
          >
            <p className="text-2xl sm:text-3xl font-normal tracking-tight text-foreground font-mono">
              100%
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Deterministic Ledger Immutability
            </p>
          </motion.div>
        </section>

        {/* Diagonal Hatched Divider */}
        <div
          aria-hidden="true"
          className="h-8 border-x border-[#d1d5db] dark:border-white/15 hatched-divider"
        />

        {/* Use Cases / Core Capabilities Strip */}
        <motion.section
          id="statutory-standards"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="border-x border-b border-[#d1d5db] dark:border-white/15 px-5 pb-16 pt-12 md:px-8 bg-card/30 backdrop-blur-sm"
        >
          <p className="mb-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
            <span aria-hidden="true" className="size-1 rounded-full bg-[#19c7e8]" />
            Tribunal Capabilities & Integrity Standards
          </p>
          <h2 className="max-w-2xl text-[clamp(1.8rem,4vw,2.8rem)] font-normal leading-[1.05] tracking-[-0.03em] text-foreground">
            What Oversight Authorities Power with CivicAudit AI
          </h2>
          <p className="mt-4 max-w-xl font-mono text-xs leading-relaxed text-muted-foreground">
            From municipal infrastructure dockets to national healthcare acquisitions, CivicAudit AI runs autonomous cross-examinations inside multi-agent sandboxes — detecting overbilling, vendor collusions, and generating court-admissible forensic dossiers.
          </p>
        </motion.section>
      </div>
    </MotionConfig>
  );
};
