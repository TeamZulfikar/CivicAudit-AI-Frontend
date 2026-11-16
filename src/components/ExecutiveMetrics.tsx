"use client";

import React from "react";
import { DollarSign, ShieldAlert, TrendingUp, AlertTriangle, Scale } from "lucide-react";
import { AuditDossier } from "@/types/audit";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ExecutiveMetricsProps {
  dossier: AuditDossier;
}

export const ExecutiveMetrics: React.FC<ExecutiveMetricsProps> = ({ dossier }) => {
  const getRiskVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 70) return "destructive";
    if (score >= 40) return "secondary";
    return "outline";
  };

  const riskScore = Math.min(100, Math.max(0, dossier.risk_score));

  return (
    <div className="space-y-4">
      {/* Tender Title & Authority Header */}
      <Card className="p-4 border-border/60 bg-card/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                #{dossier.tender_id}
              </Badge>
              <span className="text-xs text-muted-foreground">Date: {dossier.submission_date}</span>
            </div>
            <h2 className="text-lg font-bold text-foreground mt-1">{dossier.title}</h2>
            <p className="text-xs text-muted-foreground">Procuring Authority: {dossier.procuring_entity}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Docket Risk Tier
              </div>
              <Badge variant={getRiskVariant(dossier.risk_score)} className="text-xs font-bold mt-0.5">
                {dossier.risk_tier}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Metric 1: Quoted Budget */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Quoted Budget</span>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl font-bold text-foreground font-mono">
              ${dossier.total_quoted_budget.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Total vendor billed amount</p>
          </CardContent>
        </Card>

        {/* Metric 2: Consensus Fair Budget */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Consensus Ceiling</span>
            <Scale className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl font-bold text-emerald-400 font-mono">
              ${dossier.fair_market_estimated_budget.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Reconciled statutory fair rate</p>
          </CardContent>
        </Card>

        {/* Metric 3: Taxpayer Fiscal Loss */}
        <Card className="flex flex-col justify-between border-destructive/30 bg-destructive/5">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-destructive">Taxpayer Loss</span>
            <ShieldAlert className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl font-bold text-destructive font-mono">
              ${dossier.potential_taxpayer_loss.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Discrepancy at risk of siphoning</p>
          </CardContent>
        </Card>

        {/* Metric 4: Inflation Index */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Price Gouging</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl font-bold text-amber-400 font-mono">
              {dossier.overall_gouging_index >= 0 ? "+" : ""}
              {dossier.overall_gouging_index.toFixed(1)}%
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Variance over fair ceiling</p>
          </CardContent>
        </Card>

        {/* Metric 5: Composite Risk Score */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Risk Score</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-foreground">
                {dossier.risk_score}
              </span>
              <span className="text-xs text-muted-foreground font-mono">/ 100</span>
            </div>
            <Progress value={riskScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
