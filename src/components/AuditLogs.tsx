"use client";

import React, { useState } from "react";
import { Terminal, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AuditLogsProps {
  logs: string[];
}

export const AuditLogs: React.FC<AuditLogsProps> = ({ logs }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (!logs || logs.length === 0) return null;

  const getLogStyle = (log: string) => {
    if (log.includes("[ALERT]") || log.includes("CRITICAL")) return "text-destructive font-bold";
    if (log.includes("[DEBATE]") || log.includes("🏛️")) return "text-purple-300";
    if (log.includes("[COMPLETED]") || log.includes("✅")) return "text-emerald-400 font-bold";
    if (log.includes("[STAGE_2]") || log.includes("🌐")) return "text-primary";
    if (log.includes("[STAGE_1]") || log.includes("📄")) return "text-cyan-400";
    return "text-muted-foreground";
  };

  return (
    <Card className="border-border/60 overflow-hidden shadow-lg">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3.5 h-auto text-left rounded-none hover:bg-muted/30 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-foreground uppercase tracking-wider">
            Forensic Telemetry Stream ({logs.length} events)
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </Button>

      {isOpen && (
        <div className="p-4 max-h-60 overflow-y-auto font-mono text-[11px] space-y-1.5 bg-black/40 border-t border-border">
          {logs.map((log, idx) => (
            <div key={idx} className={`leading-relaxed ${getLogStyle(log)}`}>
              {log}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
