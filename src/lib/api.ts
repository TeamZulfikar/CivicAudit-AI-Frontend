import {
  AuditResponse,
  SettingsResponse,
  SettingsPayload,
  AITestResponse,
  StreamEvent,
} from "@/types/audit";

export { API_BASE_URL };

export async function streamAudit(
  payload: {
    mode: "sample" | "custom" | "upload";
    sample?: string;
    title?: string;
    procuring_entity?: string;
    tender_id?: string;
    raw_text?: string;
    filename?: string;
    file_base64?: string;
  },
  onEvent: (event: StreamEvent) => void
): Promise<AuditResponse> {
  const res = await fetch(`${API_BASE_URL}/api/audit_stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Investigation failed: ${res.statusText}`);
  }

  if (!res.body) {
    throw new Error("No response body received from audit streaming service");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finalResult: AuditResponse | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith(":")) continue;
      if (trimmed.startsWith("data: ")) {
        try {
          const jsonStr = trimmed.slice(6);
          const ev: StreamEvent = JSON.parse(jsonStr);
          onEvent(ev);

          if (ev.type === "complete" && ev.dossier && ev.logs && ev.markdown) {
            finalResult = {
              dossier: ev.dossier,
              logs: ev.logs,
              markdown: ev.markdown,
            };
          } else if (ev.type === "error") {
            throw new Error(ev.error || "Investigation failed on server");
          }
        } catch (e) {
          if (e instanceof Error && e.message !== "Unexpected end of JSON input") {
            console.warn("Parse error in stream line:", e);
          }
        }
      }
    }
  }

  if (!finalResult) {
    throw new Error("Stream completed without generating final dossier.");
  }

  return finalResult;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function fetchSettings(): Promise<SettingsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/settings`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch settings: ${res.statusText}`);
  }
  return res.json();
}

export async function saveSettings(
  payload: SettingsPayload
): Promise<{ status: string; active_brain: string; council_mode: string }> {
  const res = await fetch(`${API_BASE_URL}/api/save_settings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to save settings: ${res.statusText}`);
  }
  return res.json();
}

export async function testAIConnection(): Promise<AITestResponse> {
  const res = await fetch(`${API_BASE_URL}/api/test_ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `AI test failed: ${res.statusText}`);
  }
  return res.json();
}

export async function auditPreloadedDocket(
  sampleFileName: string
): Promise<AuditResponse> {
  const res = await fetch(
    `${API_BASE_URL}/api/audit?sample=${encodeURIComponent(sampleFileName)}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Audit execution failed: ${res.statusText}`);
  }
  return res.json();
}

export async function auditCustomText(payload: {
  title: string;
  procuring_entity: string;
  tender_id: string;
  raw_text: string;
}): Promise<AuditResponse> {
  const res = await fetch(`${API_BASE_URL}/api/audit_custom`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Custom audit failed: ${res.statusText}`);
  }
  return res.json();
}

export async function uploadAndAudit(payload: {
  filename: string;
  file_base64: string;
  title: string;
  procuring_entity: string;
  tender_id: string;
}): Promise<AuditResponse> {
  const res = await fetch(`${API_BASE_URL}/api/upload_tender`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `File upload & audit failed: ${res.statusText}`);
  }
  return res.json();
}
