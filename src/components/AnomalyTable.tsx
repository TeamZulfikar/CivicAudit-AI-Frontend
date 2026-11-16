"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, AlertCircle, AlertTriangle, CheckCircle, Search, MessageSquare } from "lucide-react";
import { AnomalyFinding } from "@/types/audit";
import { AgentDebateCard } from "@/components/AgentDebateCard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AnomalyTableProps {
  findings: AnomalyFinding[];
}

export const AnomalyTable: React.FC<AnomalyTableProps> = ({ findings }) => {
  const [filter, setFilter] = useState<"ALL" | "CRITICAL" | "WARNING" | "NORMAL">("ALL");
  const [search, setSearch] = useState<string>("");
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedItemId((prev) => (prev === id ? null : id));
  };

  const filtered = findings.filter((f) => {
    if (filter === "CRITICAL" && f.risk_level !== "CRITICAL_RED_FLAG") return false;
    if (filter === "WARNING" && f.risk_level !== "SUSPICIOUS_WARNING") return false;
    if (filter === "NORMAL" && f.risk_level !== "NORMAL") return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return f.item_name.toLowerCase().includes(q) || f.item_id.toLowerCase().includes(q);
    }
    return true;
  });

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "CRITICAL_RED_FLAG":
        return (
          <Badge variant="destructive" className="gap-1 text-[11px] font-bold">
            <AlertCircle className="w-3 h-3" />
            CRITICAL
          </Badge>
        );
      case "SUSPICIOUS_WARNING":
        return (
          <Badge variant="secondary" className="gap-1 text-[11px] font-bold text-amber-400">
            <AlertTriangle className="w-3 h-3" />
            WARNING
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1 text-[11px] font-bold text-emerald-400">
            <CheckCircle className="w-3 h-3" />
            COMPLIANT
          </Badge>
        );
    }
  };

  return (
    <Card className="border-border/60 bg-card/90 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold tracking-tight">Forensic Anomaly Matrix</CardTitle>
            <CardDescription className="text-xs">
              Itemized breakdown of quoted prices against Multi-Agent Consensus Ceilings
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 text-xs w-40 sm:w-48 h-8"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex bg-muted/40 p-1 rounded-lg border border-border/50 text-xs font-semibold gap-1">
              {(["ALL", "CRITICAL", "WARNING", "NORMAL"] as const).map((tab) => (
                <Button
                  key={tab}
                  variant={filter === tab ? "default" : "ghost"}
                  size="xs"
                  onClick={() => setFilter(tab)}
                  className="cursor-pointer"
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="rounded-xl border border-border overflow-x-auto">
          <Table className="min-w-[720px]">
            <TableHeader className="bg-muted/40 font-mono text-[11px] uppercase tracking-wider">
              <TableRow>
                <TableHead className="py-3 px-3.5">Item Ref</TableHead>
                <TableHead className="py-3 px-3.5">Product Description</TableHead>
                <TableHead className="py-3 px-3.5 text-right">Qty</TableHead>
                <TableHead className="py-3 px-3.5 text-right">Quoted Rate</TableHead>
                <TableHead className="py-3 px-3.5 text-right">Consensus Fair</TableHead>
                <TableHead className="py-3 px-3.5 text-right">Fiscal Loss</TableHead>
                <TableHead className="py-3 px-3.5 text-right">Gouging %</TableHead>
                <TableHead className="py-3 px-3.5 text-center">Status</TableHead>
                <TableHead className="py-3 px-3.5 text-center">Tribunal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-8 text-center text-muted-foreground italic">
                    No line items matching your query or filter.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => {
                  const isExpanded = expandedItemId === item.item_id;
                  return (
                    <React.Fragment key={item.item_id}>
                      <TableRow
                        className={`hover:bg-muted/30 transition cursor-pointer ${
                          isExpanded ? "bg-muted/20" : ""
                        }`}
                        onClick={() => toggleExpand(item.item_id)}
                      >
                        <TableCell className="py-3 px-3.5 font-mono text-muted-foreground font-semibold">
                          {item.item_id}
                        </TableCell>
                        <TableCell className="py-3 px-3.5 font-medium text-foreground max-w-[240px] truncate" title={item.item_name}>
                          {item.item_name}
                        </TableCell>
                        <TableCell className="py-3 px-3.5 text-right font-mono">{item.quantity}</TableCell>
                        <TableCell className="py-3 px-3.5 text-right font-mono font-bold text-foreground">
                          ${item.quoted_unit_price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="py-3 px-3.5 text-right font-mono text-emerald-400 font-semibold">
                          ${item.fair_market_unit_price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="py-3 px-3.5 text-right font-mono text-destructive font-semibold">
                          ${item.variance_total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="py-3 px-3.5 text-right font-mono font-bold">
                          <span
                            className={
                              item.gouging_percentage > 50
                                ? "text-destructive"
                                : item.gouging_percentage > 25
                                ? "text-amber-400"
                                : "text-emerald-400"
                            }
                          >
                            {item.gouging_percentage >= 0 ? "+" : ""}
                            {item.gouging_percentage.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-3.5 text-center">{getRiskBadge(item.risk_level)}</TableCell>
                        <TableCell className="py-3 px-3.5 text-center">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="cursor-pointer"
                            title="View 3-Agent Deliberation Transcript"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-primary" />
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-3 h-3 text-muted-foreground" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow>
                          <TableCell colSpan={9} className="p-4 bg-muted/10 border-t border-b border-border">
                            <AgentDebateCard
                              transcript={item.debate_transcript}
                              itemName={item.item_name}
                              consensusPrice={item.fair_market_unit_price}
                              quotedPrice={item.quoted_unit_price}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
