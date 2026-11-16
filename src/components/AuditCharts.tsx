"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Scale,
  ShieldAlert,
  ArrowUpDown,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AuditDossier, AnomalyFinding } from "@/types/audit";

interface AuditChartsProps {
  dossier: AuditDossier;
}

export const AuditCharts: React.FC<AuditChartsProps> = ({ dossier }) => {
  const [activeTab, setActiveTab] = useState<"budget" | "items" | "risk">("budget");
  const [sortBy, setSortBy] = useState<"loss" | "gouging" | "original">("loss");
  const [selectedItem, setSelectedItem] = useState<AnomalyFinding | null>(null);

  const {
    total_quoted_budget = 0,
    fair_market_estimated_budget = 0,
    potential_taxpayer_loss = 0,
    overall_gouging_index = 0,
    risk_score = 0,
    findings = [],
  } = dossier;

  // Safe percentage calculations
  const lossPercentage = total_quoted_budget > 0
    ? Math.min(100, Math.max(0, (potential_taxpayer_loss / total_quoted_budget) * 100))
    : 0;

  const fairPercentage = Math.max(0, 100 - lossPercentage);

  // Group findings by risk level for distribution chart
  const distribution = useMemo(() => {
    let critical = 0;
    let warning = 0;
    let normal = 0;

    let criticalLoss = 0;
    let warningLoss = 0;

    findings.forEach((f) => {
      const loss = Math.max(0, f.variance_total || 0);
      if (f.risk_level === "CRITICAL_RED_FLAG") {
        critical++;
        criticalLoss += loss;
      } else if (f.risk_level === "SUSPICIOUS_WARNING") {
        warning++;
        warningLoss += loss;
      } else {
        normal++;
      }
    });

    const total = findings.length || 1;
    return {
      critical,
      warning,
      normal,
      total: findings.length,
      criticalPct: (critical / total) * 100,
      warningPct: (warning / total) * 100,
      normalPct: (normal / total) * 100,
      criticalLoss,
      warningLoss,
    };
  }, [findings]);

  // Sorted findings for item comparison chart
  const sortedFindings = useMemo(() => {
    const list = [...findings];
    if (sortBy === "loss") {
      return list.sort((a, b) => (b.variance_total || 0) - (a.variance_total || 0));
    }
    if (sortBy === "gouging") {
      return list.sort((a, b) => (b.gouging_percentage || 0) - (a.gouging_percentage || 0));
    }
    return list;
  }, [findings, sortBy]);

  // Max quoted amount for bar scaling
  const maxItemTotal = useMemo(() => {
    if (!findings.length) return 1;
    return Math.max(...findings.map((f) => Math.max(f.quoted_total_price || 0, f.fair_market_total_price || 0)), 1);
  }, [findings]);

  // SVG Gauge calculations for Risk Score
  const gaugeRadius = 52;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius;
  const scorePercent = Math.min(100, Math.max(0, risk_score));
  const strokeOffset = gaugeCircumference - (scorePercent / 100) * gaugeCircumference;

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-destructive stroke-destructive";
    if (score >= 40) return "text-amber-500 stroke-amber-500";
    return "text-emerald-500 stroke-emerald-500";
  };

  return (
    <Card className="border-border/60 bg-card/90 overflow-hidden shadow-sm">
      {/* Header with Navigation Pills */}
      <CardHeader className="p-4 sm:p-5 border-b border-border/40 bg-muted/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm sm:text-base font-bold text-foreground">
                Forensic Analytics & Visualizations
              </CardTitle>
              <p className="text-[11px] text-muted-foreground">
                Comparative fiscal modeling, line-item price gouging & risk spectrum
              </p>
            </div>
          </div>

          {/* View Segment Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-muted/50 border border-border/60 text-xs self-start sm:self-auto overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab("budget")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "budget"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-primary" />
              <span>Fiscal Discrepancy</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("items")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "items"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
              <span>Item Price Gouging</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("risk")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "risk"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <PieChart className="w-3.5 h-3.5 text-destructive" />
              <span>Risk Distribution</span>
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {/* ========================================================================= */}
        {/* TAB 1: FISCAL RECONCILIATION & LOSS ALLOCATION */}
        {/* ========================================================================= */}
        {activeTab === "budget" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            {/* Top Comparative Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-xl border border-border/50 bg-background/50 space-y-1.5">
                <div className="flex items-center justify-between text-muted-foreground text-xs">
                  <span>Vendor Quoted Price</span>
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">
                  ${total_quoted_budget.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span>100% Total Billed Procurement Value</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1.5">
                <div className="flex items-center justify-between text-emerald-500 text-xs">
                  <span className="font-medium">Consensus Fair Ceiling</span>
                  <Scale className="w-4 h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-500">
                  ${fair_market_estimated_budget.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{fairPercentage.toFixed(1)}% Legitimate Statutory Rate</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5 space-y-1.5">
                <div className="flex items-center justify-between text-destructive text-xs font-medium">
                  <span>Excess Taxpayer Loss</span>
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-destructive">
                  ${potential_taxpayer_loss.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-destructive/80 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  <span>{lossPercentage.toFixed(1)}% Discrepancy Siphoned</span>
                </div>
              </div>
            </div>

            {/* Visual Budget Allocation Bar Chart */}
            <div className="p-4 sm:p-5 rounded-xl border border-border/60 bg-muted/20 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <span className="font-semibold text-foreground">
                  Budget Capital Allocation Breakdown
                </span>
                <span className="font-mono text-muted-foreground text-[11px]">
                  Net Inflation Index:{" "}
                  <strong className="text-amber-500">
                    {overall_gouging_index >= 0 ? "+" : ""}
                    {overall_gouging_index.toFixed(1)}%
                  </strong>
                </span>
              </div>

              {/* Segmented Proportion Bar */}
              <div className="h-6 w-full rounded-lg bg-muted/60 overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${fairPercentage}%` }}
                  className="bg-emerald-500 hover:bg-emerald-400 transition-all flex items-center justify-center text-[10px] font-mono text-white font-bold tracking-wider px-2 truncate"
                  title={`Legitimate Value: $${fair_market_estimated_budget.toLocaleString()} (${fairPercentage.toFixed(1)}%)`}
                >
                  {fairPercentage > 15 && `Legitimate: ${fairPercentage.toFixed(0)}%`}
                </div>
                <div
                  style={{ width: `${lossPercentage}%` }}
                  className="bg-destructive hover:opacity-90 transition-all flex items-center justify-center text-[10px] font-mono text-white font-bold tracking-wider px-2 truncate"
                  title={`Taxpayer Loss: $${potential_taxpayer_loss.toLocaleString()} (${lossPercentage.toFixed(1)}%)`}
                >
                  {lossPercentage > 15 && `Taxpayer Loss: ${lossPercentage.toFixed(0)}%`}
                </div>
              </div>

              {/* Legend & Details */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                    <span className="text-muted-foreground text-[11px]">
                      Fair Market Allocation (${fair_market_estimated_budget.toLocaleString()})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-destructive" />
                    <span className="text-muted-foreground text-[11px]">
                      Extracted Surcharge (${potential_taxpayer_loss.toLocaleString()})
                    </span>
                  </div>
                </div>

                <Badge
                  variant={lossPercentage > 20 ? "destructive" : "outline"}
                  className="font-mono text-[10px]"
                >
                  {lossPercentage > 20 ? "Fiscal Violation Detected" : "Within Acceptable Range"}
                </Badge>
              </div>
            </div>

            {/* Comparative Dual-Bar Graph */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Comparative Fiscal Ceilings
              </h4>

              <div className="space-y-3">
                {/* Quoted Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground">Vendor Quoted Invoice</span>
                    <span className="font-mono text-foreground font-semibold">
                      ${total_quoted_budget.toLocaleString("en-US", { minimumFractionDigits: 2 })} (100%)
                    </span>
                  </div>
                  <div className="h-3 w-full bg-muted/40 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-full" />
                  </div>
                </div>

                {/* Fair Market Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-emerald-500">Statutory Benchmark Ceiling</span>
                    <span className="font-mono text-emerald-500 font-semibold">
                      ${fair_market_estimated_budget.toLocaleString("en-US", { minimumFractionDigits: 2 })} ({fairPercentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-3 w-full bg-muted/40 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${fairPercentage}%` }}
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                {/* Overcharge Delta Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-destructive">Identified Overcharge Variance</span>
                    <span className="font-mono text-destructive font-semibold">
                      +${potential_taxpayer_loss.toLocaleString("en-US", { minimumFractionDigits: 2 })} ({lossPercentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-3 w-full bg-muted/40 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${lossPercentage}%` }}
                      className="h-full bg-destructive rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ITEM-BY-ITEM PRICE GOUGING BAR CHART */}
        {/* ========================================================================= */}
        {activeTab === "items" && (
          <div className="space-y-5 animate-in fade-in-50 duration-200">
            {/* Sort & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/40">
              <div className="text-xs text-muted-foreground">
                Showing <strong className="text-foreground">{findings.length}</strong> audited tender line items
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3" />
                  Sort:
                </span>
                <div className="flex items-center gap-1 bg-muted/40 p-0.5 rounded-lg border border-border/50 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setSortBy("loss")}
                    className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                      sortBy === "loss" ? "bg-background text-foreground font-semibold shadow-xs" : "text-muted-foreground"
                    }`}
                  >
                    Highest Loss ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy("gouging")}
                    className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                      sortBy === "gouging" ? "bg-background text-foreground font-semibold shadow-xs" : "text-muted-foreground"
                    }`}
                  >
                    Gouging %
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy("original")}
                    className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                      sortBy === "original" ? "bg-background text-foreground font-semibold shadow-xs" : "text-muted-foreground"
                    }`}
                  >
                    Original Order
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Line-Item Bar Chart */}
            <div className="space-y-3.5">
              {sortedFindings.map((finding) => {
                const quoted = finding.quoted_total_price || 0;
                const fair = finding.fair_market_total_price || 0;
                const gouging = finding.gouging_percentage || 0;
                const variance = finding.variance_total || 0;

                const quotedWidth = Math.min(100, Math.max(4, (quoted / maxItemTotal) * 100));
                const fairWidth = Math.min(100, Math.max(4, (fair / maxItemTotal) * 100));

                const isSelected = selectedItem?.item_id === finding.item_id;

                const riskColor =
                  finding.risk_level === "CRITICAL_RED_FLAG"
                    ? "border-destructive/40 bg-destructive/5 hover:border-destructive/60"
                    : finding.risk_level === "SUSPICIOUS_WARNING"
                      ? "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50"
                      : "border-border/40 bg-muted/10 hover:border-border/70";

                return (
                  <div
                    key={finding.item_id}
                    onClick={() => setSelectedItem(isSelected ? null : finding)}
                    className={`p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${riskColor} ${
                      isSelected ? "ring-2 ring-primary/50 shadow-md" : ""
                    }`}
                  >
                    {/* Item Meta Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {finding.item_id}
                        </Badge>
                        <span className="text-xs sm:text-sm font-semibold text-foreground line-clamp-1">
                          {finding.item_name}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          (Qty: {finding.quantity})
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <Badge
                          variant={
                            finding.risk_level === "CRITICAL_RED_FLAG"
                              ? "destructive"
                              : finding.risk_level === "SUSPICIOUS_WARNING"
                                ? "secondary"
                                : "outline"
                          }
                          className="font-mono text-[10px]"
                        >
                          {gouging >= 0 ? "+" : ""}
                          {gouging.toFixed(1)}% Gouging
                        </Badge>

                        <span className="text-xs font-mono font-bold text-destructive">
                          +${variance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    {/* Dual Comparative Bars */}
                    <div className="space-y-1.5">
                      {/* Quoted Billed Bar */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-16 text-[10px] font-mono text-muted-foreground shrink-0">
                          Quoted:
                        </span>
                        <div className="flex-1 h-3.5 bg-muted/40 rounded overflow-hidden">
                          <div
                            style={{ width: `${quotedWidth}%` }}
                            className={`h-full rounded transition-all duration-300 ${
                              finding.risk_level === "CRITICAL_RED_FLAG"
                                ? "bg-destructive"
                                : finding.risk_level === "SUSPICIOUS_WARNING"
                                  ? "bg-amber-500"
                                  : "bg-primary"
                            }`}
                          />
                        </div>
                        <span className="w-24 text-right font-mono font-semibold text-foreground shrink-0 text-[11px]">
                          ${quoted.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Fair Market Bar */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-16 text-[10px] font-mono text-emerald-500 shrink-0">
                          Fair Rate:
                        </span>
                        <div className="flex-1 h-3.5 bg-muted/40 rounded overflow-hidden">
                          <div
                            style={{ width: `${fairWidth}%` }}
                            className="h-full bg-emerald-500 rounded transition-all duration-300"
                          />
                        </div>
                        <span className="w-24 text-right font-mono font-medium text-emerald-500 shrink-0 text-[11px]">
                          ${fair.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    {/* Selected Item Quick Inspection Drawer */}
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-border/50 text-xs space-y-2 animate-in fade-in-50 duration-150">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-background/60 p-2.5 rounded-lg font-mono text-[11px]">
                          <div>
                            <span className="text-muted-foreground block text-[10px]">Quoted Unit</span>
                            <span className="font-semibold text-foreground">
                              ${finding.quoted_unit_price?.toFixed(2)}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[10px]">Fair Unit</span>
                            <span className="font-semibold text-emerald-500">
                              ${finding.fair_market_unit_price?.toFixed(2)}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[10px]">Unit Variance</span>
                            <span className="font-semibold text-destructive">
                              +${finding.variance_unit?.toFixed(2)}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[10px]">Total Extraction</span>
                            <span className="font-semibold text-destructive">
                              +${variance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>

                        {finding.audit_notes && (
                          <div className="flex items-start gap-1.5 text-muted-foreground text-[11px] bg-muted/30 p-2 rounded-md">
                            <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                            <span>{finding.audit_notes}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: RISK DISTRIBUTION & ANOMALY SPECTRUM */}
        {/* ========================================================================= */}
        {activeTab === "risk" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
              {/* Radial Composite Risk Gauge */}
              <div className="p-5 rounded-xl border border-border/50 bg-background/50 flex flex-col items-center justify-center text-center space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Composite Risk Gauge
                </span>

                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    {/* Background Track */}
                    <circle
                      cx="60"
                      cy="60"
                      r={gaugeRadius}
                      className="stroke-muted/40"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    {/* Animated Score Arc */}
                    <circle
                      cx="60"
                      cy="60"
                      r={gaugeRadius}
                      className={`transition-all duration-1000 ease-out ${getRiskColor(risk_score)}`}
                      strokeWidth="10"
                      strokeDasharray={gaugeCircumference}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>

                  {/* Centered Score Readout */}
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-black font-mono tracking-tight text-foreground">
                      {risk_score}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">
                      / 100 Risk
                    </span>
                  </div>
                </div>

                <Badge
                  variant={risk_score >= 70 ? "destructive" : risk_score >= 40 ? "secondary" : "outline"}
                  className="font-mono text-xs px-2.5 py-0.5 uppercase font-bold"
                >
                  {dossier.risk_tier || "EVALUATED"}
                </Badge>
              </div>

              {/* Anomaly Breakdown Cards */}
              <div className="md:col-span-2 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Anomaly Severity Breakdown
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Critical Card */}
                  <div className="p-3.5 rounded-xl border border-destructive/30 bg-destructive/5 space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium text-destructive">
                      <span className="flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Critical
                      </span>
                      <span className="font-mono text-sm font-bold">{distribution.critical}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Severe price gouging & statutory red flags
                    </p>
                    <div className="text-xs font-mono font-semibold text-destructive pt-1">
                      +${distribution.criticalLoss.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                    </div>
                  </div>

                  {/* Warning Card */}
                  <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium text-amber-500">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Warning
                      </span>
                      <span className="font-mono text-sm font-bold">{distribution.warning}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Moderate variance above market median
                    </p>
                    <div className="text-xs font-mono font-semibold text-amber-500 pt-1">
                      +${distribution.warningLoss.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                    </div>
                  </div>

                  {/* Normal Card */}
                  <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium text-emerald-500">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Compliant
                      </span>
                      <span className="font-mono text-sm font-bold">{distribution.normal}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Priced within statutory benchmarks
                    </p>
                    <div className="text-xs font-mono font-semibold text-emerald-500 pt-1">
                      Verified Fair
                    </div>
                  </div>
                </div>

                {/* Severity Spectrum Bar */}
                <div className="pt-2 space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Portfolio Risk Composition</span>
                    <span className="font-mono text-[11px]">
                      {distribution.total} Total Line Items Audited
                    </span>
                  </div>
                  <div className="h-4 w-full rounded-md bg-muted/50 overflow-hidden flex shadow-inner">
                    <div
                      style={{ width: `${distribution.criticalPct}%` }}
                      className="bg-destructive hover:opacity-90 transition-all flex items-center justify-center text-[9px] font-mono text-white font-bold"
                      title={`Critical: ${distribution.critical} (${distribution.criticalPct.toFixed(0)}%)`}
                    >
                      {distribution.criticalPct > 10 && `${distribution.criticalPct.toFixed(0)}%`}
                    </div>
                    <div
                      style={{ width: `${distribution.warningPct}%` }}
                      className="bg-amber-500 hover:opacity-90 transition-all flex items-center justify-center text-[9px] font-mono text-white font-bold"
                      title={`Warning: ${distribution.warning} (${distribution.warningPct.toFixed(0)}%)`}
                    >
                      {distribution.warningPct > 10 && `${distribution.warningPct.toFixed(0)}%`}
                    </div>
                    <div
                      style={{ width: `${distribution.normalPct}%` }}
                      className="bg-emerald-500 hover:opacity-90 transition-all flex items-center justify-center text-[9px] font-mono text-white font-bold"
                      title={`Compliant: ${distribution.normal} (${distribution.normalPct.toFixed(0)}%)`}
                    >
                      {distribution.normalPct > 10 && `${distribution.normalPct.toFixed(0)}%`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
