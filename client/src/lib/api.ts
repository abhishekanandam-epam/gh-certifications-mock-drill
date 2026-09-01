import type { Certification, Domain, Question, Mode } from "../types";

export interface ModeConfig {
  name: string;
  questionCount: number;
  timeLimit: number | null;
  description: string;
}

const API_BASE = "/api";

export async function fetchCertifications(): Promise<Certification[]> {
  const res = await fetch(`${API_BASE}/certifications`);
  if (!res.ok) throw new Error("Failed to load certifications");
  return res.json();
}

export async function fetchDomains(certId: string): Promise<Domain[]> {
  const res = await fetch(`${API_BASE}/domains?cert=${encodeURIComponent(certId)}`);
  if (!res.ok) throw new Error("Failed to load domains");
  return res.json();
}

export async function fetchModes(): Promise<Record<string, ModeConfig>> {
  const res = await fetch(`${API_BASE}/modes`);
  if (!res.ok) throw new Error("Failed to load modes");
  return res.json();
}

export async function fetchQuestions(opts: {
  certId: string;
  domains?: string[];
  mode: Mode;
  count?: number;
}): Promise<Question[]> {
  const params = new URLSearchParams();
  params.set("cert", opts.certId);
  if (opts.domains && opts.domains.length > 0) params.set("domains", opts.domains.join(","));
  params.set("mode", opts.mode);
  if (opts.count) params.set("count", String(opts.count));

  const res = await fetch(`${API_BASE}/questions?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load questions");
  return res.json();
}
