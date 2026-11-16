"use client";

import React, { useState } from "react";
import { UploadCloud, FileText, Database, ArrowRight, Loader2, Sparkles, ChevronDown, ChevronUp, FileCheck } from "lucide-react";
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
}

type IngestionTab = "samples" | "upload" | "paste";

export const TenderIngestion: React.FC<TenderIngestionProps> = ({
  onAuditPreloaded,
  onAuditCustom,
  onUploadAndAudit,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<IngestionTab>("samples");
  const [title, setTitle] = useState<string>("Municipal Procurement Docket");
  const [entity, setEntity] = useState<string>("Public Procurement Directorate");
  const [tenderId, setTenderId] = useState<string>("TND-2025-089");
  const [rawText, setRawText] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showMetadata, setShowMetadata] = useState<boolean>(false);

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
                    ? "border-primary/80 bg-primary/10 shadow-[0_0_15px_rgba(56,189,248,0.12)] ring-1 ring-primary/40"
                    : "border-border/50 bg-card/40 hover:bg-card hover:border-border/80 text-muted-foreground hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/40 text-muted-foreground border-border/40"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-xs sm:text-sm font-semibold tracking-tight",
                        isSelected ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {tab.label}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground/80 mt-0.5 truncate">
                    {tab.sublabel}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* TAB 1 CONTENT: Preloaded Dockets */}
        {activeTab === "samples" && (
          <div className="space-y-3 pt-1 animate-in fade-in-50 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {[
                {
                  file: "test_procurement_tender.json",
                  tag: "Healthcare IT",
                  title: "Digital Health Center IT",
                  desc: "Medical workstations, DICOM displays, 10kVA UPS, and inflated USB/Cat6 cables.",
                  highlight: "Contains extreme anomalies",
                },
                {
                  file: "municipal_it_tender_2025.json",
                  tag: "IT & Hardware",
                  title: "Smart City Administration",
                  desc: "Core i7 laptops, 27\" monitors, Cisco network switches, and ergonomic office chairs.",
                  highlight: "Standard municipal BOQ",
                },
                {
                  file: "civil_works_lighting_2025.json",
                  tag: "Civil Works",
                  title: "Highway LED Lighting",
                  desc: "Solar LED luminaires, 50kVA diesel generators, PTZ cameras, and Portland cement.",
                  highlight: "Heavy infrastructure",
                },
                {
                  file: "real_world_tender.csv",
                  tag: "CSV Spreadsheet",
                  title: "Government BOQ (CSV)",
                  desc: "Header-agnostic spreadsheet with mixed pricing, monitors, and laser printers.",
                  highlight: "Raw tabular format",
                },
              ].map((sample, idx) => (
                <div
                  key={idx}
                  className="group relative flex flex-col justify-between p-4 rounded-xl border border-border/50 bg-card/40 hover:bg-card hover:border-primary/40 transition duration-200"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] font-mono px-2 py-0 border-border/70 text-muted-foreground">
                        {sample.tag}
                      </Badge>
                      <span className="text-[10px] text-primary font-medium">{sample.highlight}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
                        {sample.title}
                      </h4>
                      <p className="text-xs text-muted-foreground/90 mt-1 line-clamp-2 leading-relaxed">
                        {sample.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-border/40">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-8 text-xs gap-1.5 font-medium border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition cursor-pointer"
                      onClick={() => onAuditPreloaded(sample.file)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          <span>Audit Docket</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2 CONTENT: Upload Document */}
        {activeTab === "upload" && (
          <div className="space-y-4 pt-1 animate-in fade-in-50 duration-200">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 sm:p-10 text-center transition-all cursor-pointer ${
                selectedFile
                  ? "border-primary/50 bg-primary/5"
                  : "border-border/60 hover:border-primary/40 hover:bg-muted/15 bg-muted/5"
              }`}
            >
              <input
                type="file"
                id="fileInput"
                onChange={handleFileChange}
                accept=".pdf,.xlsx,.xls,.csv,.json,.txt"
                className="hidden"
              />
              <label htmlFor="fileInput" className="cursor-pointer block space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20">
                  {selectedFile ? <FileCheck className="w-5 h-5 text-emerald-400" /> : <UploadCloud className="w-5 h-5" />}
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
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Procuring Authority</label>
                    <Input
                      type="text"
                      value={entity}
                      onChange={(e) => setEntity(e.target.value)}
                      className="text-xs h-8"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Docket Reference</label>
                    <Input
                      type="text"
                      value={tenderId}
                      onChange={(e) => setTenderId(e.target.value)}
                      className="text-xs font-mono h-8"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
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
              />
            </div>

            <div className="flex justify-end pt-1">
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
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
