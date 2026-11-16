"use client";

import React, { useState } from "react";
import { Scale, AlertOctagon, CheckSquare, Download, Copy, Check } from "lucide-react";
import { AuditDossier } from "@/types/audit";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LegalAdvisoryProps {
  dossier: AuditDossier;
  markdown: string;
}

export const LegalAdvisory: React.FC<LegalAdvisoryProps> = ({ dossier, markdown }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Audit_Dossier_${dossier.tender_id}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Executive Summary & Legal Violations */}
      <div className="lg:col-span-2 space-y-4">
        {/* Executive Summary */}
        <Card className="border-border/60 bg-card/90">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-primary">
              <Scale className="w-4 h-4" />
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Auditor General Executive Summary
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {dossier.executive_summary}
            </p>
          </CardContent>
        </Card>

        {/* Statutory Violations */}
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-destructive">
              <AlertOctagon className="w-4 h-4" />
              <CardTitle className="text-xs font-bold uppercase tracking-wider">
                Statutory Violations & Forensic Flags
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {dossier.legal_statutory_violations.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No statutory violations detected.</p>
            ) : (
              <ul className="space-y-1.5">
                {dossier.legal_statutory_violations.map((violation, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-destructive">
                    <span className="font-bold">&bull;</span>
                    <span>{violation}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Immediate Recommendations & Export Actions */}
      <div className="space-y-4">
        <Card className="border-border/60 bg-card/90">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckSquare className="w-4 h-4" />
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Immediate Advisory Actions
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {dossier.immediate_actions_recommended.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-foreground/90">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Export Dossier Card */}
        <Card className="border-border/60 bg-card/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Formal Oversight Dossier
            </CardTitle>
            <CardDescription className="text-[11px]">
              Export legally cited audit report formatted under United Nations Convention against Corruption (UNCAC Article 9).
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyMarkdown}
              className="flex-1 gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Dossier"}</span>
            </Button>

            <Button
              size="sm"
              onClick={handleDownload}
              className="flex-1 gap-1.5 shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .MD</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
