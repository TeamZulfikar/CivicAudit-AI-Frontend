"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UploadCloud,
  FileText,
  Database,
  ArrowRight,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Lock,
  LogIn,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TenderIngestionProps {
  onAuditPreloaded: (sample: string) => Promise<void>;
  onAuditCustom: (title: string, entity: string, tenderId: string, text: string) => Promise<void>;
  onUploadAndAudit: (file: File, title: string, entity: string, tenderId: string) => Promise<void>;
  isLoading: boolean;
  userRole?: string | null;
  isAuthenticated?: boolean;
}

type IngestionTab = "samples" | "upload" | "paste";

export const TenderIngestion: React.FC<TenderIngestionProps> = ({
  onAuditPreloaded,
  onAuditCustom,
  onUploadAndAudit,
  isLoading,
  userRole,
  isAuthenticated = false,
}) => {
  const [activeTab, setActiveTab] = useState<IngestionTab>("samples");
  const [title, setTitle] = useState<string>("Municipal Procurement Docket");
  const [entity, setEntity] = useState<string>("Public Procurement Directorate");
  const [tenderId, setTenderId] = useState<string>("TND-2025-089");
  const [rawText, setRawText] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showMetadata, setShowMetadata] = useState<boolean>(false);

  const isAdmin = isAuthenticated && userRole === "admin";
  const isRegularUser = isAuthenticated && userRole !== "admin";
  const isGuest = !isAuthenticated;
  // Authentication required to convene and run forensic tribunal audits
  const canAudit = isAuthenticated;

  const sampleBoq = `Item 1: 20-Ton Hydraulic Crawler Excavator - Qty: 2 - Quoted: $58,000.00 each
Item 2: Heavy-Duty Tandem Road Roller Compactor - Qty: 3 - Quoted: $42,500.00 each
Item 3: Precast Interlocking Concrete Paving Blocks - Qty: 15,000 pcs - Quoted: $2.85 per block
Item 4: Grade 60 Deformed MS Steel Rebar - Qty: 25,000 kg - Quoted: $1.45 per kg
Item 5: 150W Commercial Outdoor LED Street Luminaires - Qty: 120 units - Quoted: $245.00 each`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const tabsConfig = [
    {
      id: "samples" as IngestionTab,
      label: "Preloaded Dockets",
      sublabel: "4 real-world test dockets",
      icon: Database,
    },
    {
      id: "upload" as IngestionTab,
      label: "Upload Document",
      sublabel: "PDF, Excel (.xlsx), CSV, JSON",
      icon: UploadCloud,
    },
    {
      id: "paste" as IngestionTab,
      label: "Paste Raw Text",
      sublabel: "Custom line items & tables",
      icon: FileText,
    },
  ];

  return (
    <Card className="border-border/50 bg-card/70 shadow-sm backdrop-blur-md overflow-hidden">
      <CardContent className="p-5 sm:p-6 space-y-6">
        {/* Role-Based Access Control Notice Banner */}
        {isGuest && (
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Lock className="w-4 h-4 text-primary shrink-0" />
              <span>
                <strong className="text-foreground">Authentication Required:</strong> You must be signed in to an authorized account to convene tribunal audits, upload tender dockets, and record findings.
              </span>
            </div>
            <Link href="/login?callbackUrl=/tribunal">
              <Button size="xs" className="h-7 text-xs gap-1.5 font-semibold cursor-pointer shrink-0">
                <LogIn className="w-3 h-3" />
                <span>Sign In to Audit</span>
              </Button>
            </Link>
          </div>
        )}

        {isRegularUser && (
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-xs text-primary">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-semibold">Auditor Access Active (Role: {userRole || "user"})</span>
              <span className="text-[11px] text-muted-foreground hidden sm:inline">&bull; Full upload and tribunal convening privileges enabled.</span>
            </div>
            <Badge variant="outline" className="text-[9px] font-mono uppercase bg-background border-primary/30">
              Auditor Verified
            </Badge>
          </div>
        )}

        {isAdmin && (
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-xs text-primary">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-semibold">Admin Authorization Active</span>
              <span className="text-[11px] text-muted-foreground hidden sm:inline">&bull; Full upload and tribunal convening privileges enabled.</span>
            </div>
            <Badge variant="outline" className="text-[9px] font-mono uppercase bg-background border-primary/30">
              Admin Verified
            </Badge>
          </div>
        )}

        {/* Modern 3-Way Mode Tabs Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {tabsConfig.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer outline-none select-none",
                  isSelected
                    ? "bg-primary/10 border-primary shadow-sm"
                    : "border-border/60 hover:border-border hover:bg-muted/40"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "text-xs font-semibold tracking-tight truncate",
                      isSelected ? "text-primary" : "text-foreground"
                    )}
                  >
                    {tab.label}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {tab.sublabel}
                  </div>
                </div>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1 CONTENT: Preloaded Dockets */}
        {activeTab === "samples" && (
          <div className="space-y-4 pt-1 animate-in fade-in-50 duration-200">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                Select Tested Procurement Case
              </label>
              <select
                id="sampleSelect"
                className="w-full bg-background border border-border/80 text-foreground rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-sans"
                defaultValue="municipal_it_tender_2025.json"
              >
                <option value="municipal_it_tender_2025.json">
                  Municipal Official Procurement Docket (TND-2025-089) - IT Hardware [High Corruption Risk]
                </option>
                <option value="clean_public_works_tender.json">
                  Clean Highway Overpass Construction (HWY-2025-042) - Fully Compliant Reference
                </option>
                <option value="hospital_medical_equipment_2025.json">
                  Regional Medical Center ICU Ventilators (MED-2025-014) - Healthcare Procurement
                </option>
                <option value="school_district_construction_2025.json">
                  Civic School District Expansion (EDU-2025-091) - Educational Facility Civil Works
                </option>
              </select>
            </div>

            <div className="flex justify-end pt-1">
              {canAudit ? (
                <Button
                  onClick={() => {
                    const sel = (document.getElementById("sampleSelect") as HTMLSelectElement).value;
                    onAuditPreloaded(sel);
                  }}
                  disabled={isLoading}
                  className="gap-2 h-9 px-4 text-xs font-medium cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Convening Tribunal...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Convene Autonomous Tribunal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>
              ) : (
                <Link href="/login?callbackUrl=/tribunal">
                  <Button variant="outline" className="gap-2 h-9 px-4 text-xs font-medium cursor-pointer border-primary/40 text-primary">
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign in to Convene Tribunal</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* TAB 2 CONTENT: Upload Document */}
        {activeTab === "upload" && (
          <div className="space-y-4 pt-1 animate-in fade-in-50 duration-200">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={canAudit ? handleDrop : undefined}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center transition-colors bg-muted/10",
                !canAudit
                  ? "border-border/40 opacity-70 cursor-not-allowed"
                  : "border-border/80 hover:border-primary/60 cursor-pointer"
              )}
            >
              <input
                type="file"
                id="fileUploadInput"
                className="hidden"
                accept=".pdf,.docx,.xlsx,.xls,.csv,.json,.txt"
                onChange={handleFileChange}
                disabled={!canAudit}
              />
              <label
                htmlFor={canAudit ? "fileUploadInput" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center space-y-2",
                  !canAudit ? "cursor-not-allowed" : "cursor-pointer"
                )}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>

                {selectedFile ? (
                  <div>
                    <div className="text-sm font-semibold text-foreground flex items-center justify-center gap-1.5">
                      <span>{selectedFile.name}</span>
                      <Badge variant="secondary" className="text-[10px] font-mono">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">Click or drag another file to replace</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      Drop tender docket here, or <span className="text-primary underline-offset-4 hover:underline">browse</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports PDF, Excel (.xlsx), CSV, and JSON (max 25MB)
                    </p>
                  </div>
                )}
              </label>
            </div>

            {/* Optional Metadata Toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowMetadata(!showMetadata)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-medium transition cursor-pointer"
              >
                {showMetadata ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>Optional Docket Reference & Authority</span>
              </button>

              {showMetadata && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 mt-2 border-t border-border/40">
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Tender Title</label>
                    <Input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-xs h-8"
                      disabled={!canAudit}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Procuring Authority</label>
                    <Input
                      type="text"
                      value={entity}
                      onChange={(e) => setEntity(e.target.value)}
                      className="text-xs h-8"
                      disabled={!canAudit}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Docket Reference</label>
                    <Input
                      type="text"
                      value={tenderId}
                      onChange={(e) => setTenderId(e.target.value)}
                      className="text-xs font-mono h-8"
                      disabled={!canAudit}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              {canAudit ? (
                <Button
                  onClick={() => selectedFile && onUploadAndAudit(selectedFile, title, entity, tenderId)}
                  disabled={isLoading || !selectedFile}
                  className="gap-2 h-9 px-4 text-xs font-medium cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Deliberating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Execute Forensic Audit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>
              ) : (
                <Link href="/login?callbackUrl=/tribunal">
                  <Button variant="outline" className="gap-2 h-9 px-4 text-xs font-medium cursor-pointer border-primary/40 text-primary">
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign in to Upload & Audit</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* TAB 3 CONTENT: Paste Raw Text */}
        {activeTab === "paste" && (
          <div className="space-y-4 pt-1 animate-in fade-in-50 duration-200">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-muted-foreground">Raw Bill of Quantities</label>
                <button
                  type="button"
                  onClick={() => setRawText(sampleBoq)}
                  className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                >
                  + Load Sample Items
                </button>
              </div>
              <Textarea
                rows={6}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste items with quantities and quoted rates (e.g., '10x Enterprise Core i7 Workstations @ $2,450.00 each')..."
                className="font-mono text-xs leading-relaxed"
                disabled={!canAudit}
              />
            </div>

            <div className="flex justify-end pt-1">
              {canAudit ? (
                <Button
                  onClick={() => rawText.trim() && onAuditCustom(title, entity, tenderId, rawText)}
                  disabled={isLoading || !rawText.trim()}
                  className="gap-2 h-9 px-4 text-xs font-medium cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Auditing Items...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Audit Custom Text</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>
              ) : (
                <Link href="/login?callbackUrl=/tribunal">
                  <Button variant="outline" className="gap-2 h-9 px-4 text-xs font-medium cursor-pointer border-primary/40 text-primary">
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign in to Audit Custom Text</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
