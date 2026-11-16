"use client";

import React, { useState, useEffect } from "react";
import { Save, Zap, AlertCircle, CheckCircle2, ShieldAlert, Cpu, Check, Loader2 } from "lucide-react";
import { SettingsResponse, SettingsPayload, AITestResponse } from "@/types/audit";
import { saveSettings, testAIConnection } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: SettingsResponse | null;
  onSettingsUpdated: (newBrain: string, newMode: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentSettings,
  onSettingsUpdated,
}) => {
  const [provider, setProvider] = useState<string>("auto");
  const [councilMode, setCouncilMode] = useState<"llm" | "hybrid" | "deterministic">("llm");
  const [apiKey, setApiKey] = useState<string>("");
  const [openrouterModel, setOpenrouterModel] = useState<string>("meta-llama/llama-3.3-70b-instruct:free");
  const [openrouterAutoFree, setOpenrouterAutoFree] = useState<boolean>(true);

  const [saving, setSaving] = useState<boolean>(false);
  const [testing, setTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<AITestResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (currentSettings) {
      setProvider(currentSettings.llm_provider || "auto");
      setCouncilMode(currentSettings.council_mode || "llm");
      setOpenrouterModel(currentSettings.openrouter_model || "meta-llama/llama-3.3-70b-instruct:free");
      setOpenrouterAutoFree(currentSettings.openrouter_auto_free ?? true);
    }
  }, [currentSettings]);

  const handleSave = async () => {
    setSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);
    try {
      const payload: SettingsPayload = {
        llm_provider: provider,
        council_mode: councilMode,
        openrouter_model: openrouterModel,
        openrouter_auto_free: openrouterAutoFree,
        api_key: apiKey.trim() || undefined,
      };
      const res = await saveSettings(payload);
      setSaveSuccess(true);
      onSettingsUpdated(res.active_brain, res.council_mode);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    setErrorMessage(null);
    try {
      const res = await testAIConnection();
      setTestResult(res);
    } catch (err: unknown) {
      setTestResult({
        status: "error",
        error: err instanceof Error ? err.message : "Connection failed",
      });
    } finally {
      setTesting(false);
    }
  };

  const modes = [
    {
      id: "llm" as const,
      title: "Full Cognitive LLM",
      desc: "Live 3-agent adversarial debate on every item",
      badge: "Most Rigorous",
    },
    {
      id: "hybrid" as const,
      title: "Smart Hybrid",
      desc: "LLM debate on anomalies (>25%); fast on compliant",
      badge: "Balanced & Fast",
    },
    {
      id: "deterministic" as const,
      title: "Deterministic Fallback",
      desc: "Zero-token statutory formula calculation",
      badge: "Air-Gapped",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl bg-card border-border/70 shadow-2xl">
        {/* Fixed Header */}
        <DialogHeader className="p-4 sm:p-5 pb-3.5 border-b border-border/50 shrink-0 text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold tracking-tight text-foreground">
                AI Engine & Council Settings
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Configure multi-provider LLM brain and tribunal execution mode
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 overscroll-contain">
          {/* Tribunal Mode Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Tribunal Deliberation Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {modes.map((m) => {
                const isSelected = councilMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setCouncilMode(m.id)}
                    className={cn(
                      "relative text-left p-3 rounded-xl border transition-all duration-150 cursor-pointer outline-none flex flex-col justify-between h-full",
                      isSelected
                        ? "border-primary/80 bg-primary/10 ring-1 ring-primary/40 shadow-[0_0_12px_rgba(56,189,248,0.1)]"
                        : "border-border/60 bg-muted/10 hover:bg-muted/20 hover:border-border"
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-foreground">{m.title}</span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{m.desc}</p>
                    </div>
                    <div className="pt-2 mt-2 border-t border-border/30">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-mono">
                        {m.badge}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Provider Selection & API Key */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                AI Provider Selection
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full bg-background border border-border/70 text-foreground rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-primary outline-none transition"
              >
                <option value="auto">Auto-Detect (Cascading Failover)</option>
                <option value="openrouter">OpenRouter (Free Tier & 200+ Models)</option>
                <option value="groq">Groq (Ultra-Fast Llama-3.3 70B & Key Pool)</option>
                <option value="gemini">Google Gemini Direct (2.0 Flash)</option>
                <option value="deepseek">DeepSeek Direct API</option>
                <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                <option value="anthropic">Anthropic Claude (3.5 Haiku / Sonnet)</option>
                <option value="mistral">Mistral AI Direct API</option>
                <option value="local">Local Offline LLM (Ollama: 11434)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                API Key (Optional / Saved into .env)
              </label>
              <Input
                type="password"
                placeholder={
                  provider === "groq"
                    ? "gsk_... (or multi-keys in .env)"
                    : provider === "openrouter"
                    ? "sk-or-v1-..."
                    : "Enter API key to update..."
                }
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="text-xs h-[38px]"
              />
            </div>
          </div>

          {/* OpenRouter specific settings */}
          {(provider === "openrouter" || provider === "auto") && (
            <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">OpenRouter Free Model Auto-Cascade</span>
                <input
                  type="checkbox"
                  checked={openrouterAutoFree}
                  onChange={(e) => setOpenrouterAutoFree(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">Target Model Identifier</label>
                <Input
                  type="text"
                  value={openrouterModel}
                  onChange={(e) => setOpenrouterModel(e.target.value)}
                  className="text-xs font-mono h-8"
                  placeholder="meta-llama/llama-3.3-70b-instruct:free"
                />
              </div>
            </div>
          )}

          {/* Status Feedback */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Settings saved successfully to runtime and .env configuration!</span>
            </div>
          )}

          {testResult && (
            <div
              className={cn(
                "p-3 rounded-lg border text-xs flex items-start gap-2.5",
                testResult.status === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-destructive/10 border-destructive/30 text-destructive"
              )}
            >
              {testResult.status === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold">
                  {testResult.status === "success"
                    ? `AI Connection Confirmed (${testResult.provider})`
                    : `Connection Error (${testResult.provider || "Current Provider"})`}
                </div>
                <div className="text-[11px] mt-0.5 opacity-90 truncate">
                  {testResult.response || testResult.error}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Responsive Footer */}
        <DialogFooter className="p-4 sm:p-5 pt-3.5 border-t border-border/50 shrink-0 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5 bg-muted/10">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestConnection}
            disabled={testing}
            className="w-full sm:w-auto h-9 text-xs gap-1.5 cursor-pointer"
          >
            {testing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{testing ? "Testing Provider..." : "Test AI Brain"}</span>
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex-1 sm:flex-initial h-9 text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-initial h-9 text-xs gap-1.5 shadow-xs cursor-pointer"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{saving ? "Saving..." : "Save Settings"}</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
