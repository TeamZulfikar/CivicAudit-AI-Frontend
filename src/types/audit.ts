export interface AgentDebateTurn {
  agent_name: string;
  role: string;
  avatar: string;
  argument: string;
}

export interface AnomalyFinding {
  item_id: string;
  item_name: string;
  quantity: number;
  quoted_unit_price: number;
  quoted_total_price: number;
  fair_market_unit_price: number;
  fair_market_total_price: number;
  variance_unit: number;
  variance_total: number;
  gouging_percentage: number;
  risk_level: "NORMAL" | "SUSPICIOUS_WARNING" | "CRITICAL_RED_FLAG";
  audit_notes: string;
  evidence_source: string;
  debate_transcript: AgentDebateTurn[];
}

export interface AuditDossier {
  tender_id: string;
  title: string;
  procuring_entity: string;
  submission_date: string;
  total_quoted_budget: number;
  fair_market_estimated_budget: number;
  potential_taxpayer_loss: number;
  overall_gouging_index: number;
  risk_score: number;
  risk_tier: string;
  findings: AnomalyFinding[];
  executive_summary: string;
  legal_statutory_violations: string[];
  immediate_actions_recommended: string[];
}

export interface AuditResponse {
  dossier: AuditDossier;
  logs: string[];
  markdown: string;
}

export interface SettingsResponse {
  active_brain: string;
  llm_provider: string;
  council_mode: "llm" | "hybrid" | "deterministic";
  openrouter_model: string;
  openrouter_auto_free: boolean;
  has_openrouter_key: boolean;
  has_groq_key: boolean;
  free_models: string[];
}

export interface SettingsPayload {
  llm_provider?: string;
  api_key?: string;
  openrouter_model?: string;
  openrouter_auto_free?: boolean;
  council_mode?: "llm" | "hybrid" | "deterministic";
}

export interface AITestResponse {
  status: "success" | "error";
  provider?: string;
  response?: string;
  error?: string;
}

export interface AuditProgressData {
  percentage: number;
  stage: number;
  stage_name: string;
  step: string;
  current_item_index?: number;
  total_items?: number;
  current_item_name?: string;
  quoted_price?: number;
  consensus_price?: number;
  anomalies_count?: number;
  risk_score?: number;
}

export interface StreamEvent {
  type: "progress" | "complete" | "error";
  phase?: string;
  message?: string;
  log?: string;
  progress?: AuditProgressData;
  dossier?: AuditDossier;
  logs?: string[];
  markdown?: string;
  error?: string;
}
