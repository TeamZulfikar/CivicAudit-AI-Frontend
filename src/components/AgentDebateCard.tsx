"use client";

import React from "react";
import { Scale, ShieldCheck, UserCheck } from "lucide-react";
import { AgentDebateTurn } from "@/types/audit";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AgentDebateCardProps {
  transcript: AgentDebateTurn[];
  itemName: string;
  consensusPrice: number;
  quotedPrice: number;
}

export const AgentDebateCard: React.FC<AgentDebateCardProps> = ({
  transcript,
  itemName,
  consensusPrice,
  quotedPrice,
}) => {
  if (!transcript || transcript.length === 0) {
    return (
      <div className="p-3 text-xs text-muted-foreground italic bg-muted/20 rounded-lg">
        No tribunal debate recorded for this item (evaluated via statutory direct formula).
      </div>
    );
  }

  const getAgentTheme = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes("investigator") || r.includes("intel") || r.includes("scout")) {
      return {
        badgeVariant: "secondary" as const,
        icon: <ShieldCheck className="w-4 h-4 text-primary" />,
      };
    }
    if (r.includes("advocate") || r.includes("vendor") || r.includes("counsel")) {
      return {
        badgeVariant: "outline" as const,
        icon: <UserCheck className="w-4 h-4 text-amber-400" />,
      };
    }
    return {
      badgeVariant: "default" as const,
      icon: <Scale className="w-4 h-4 text-purple-400" />,
    };
  };

  return (
    <Card className="border-border/70 bg-card/60 shadow-none">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-primary" />
          <CardTitle className="text-xs font-bold uppercase tracking-wider">
            Tribunal Deliberation Record &bull; {itemName}
          </CardTitle>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="text-muted-foreground">
            Quoted: <strong className="text-foreground">${quotedPrice.toLocaleString()}</strong>
          </span>
          <span className="text-emerald-400">
            Consensus: <strong>${consensusPrice.toLocaleString()}</strong>
          </span>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-3.5 space-y-3">
        {transcript.map((turn, idx) => {
          const theme = getAgentTheme(turn.role);
          return (
            <div key={idx} className="p-3 rounded-lg border border-border/50 bg-muted/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{turn.avatar}</span>
                  <span className="text-xs font-bold text-foreground">{turn.agent_name}</span>
                </div>
                <Badge variant={theme.badgeVariant} className="text-[10px]">
                  {turn.role}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-7 whitespace-pre-wrap">
                {turn.argument}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
