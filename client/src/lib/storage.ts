import type { Attempt, DomainStat, Question } from "../types";

const SELECTED_CERT_KEY = "ghcert.selectedCertification";
const attemptsKey = (certId: string) => `ghcert.${certId}.attempts`;
const sessionKey = (certId: string) => `ghcert.${certId}.practice.session`;

export interface PracticeSession {
  stage: "setup" | "session" | "summary";
  selectedDomains: string[];
  questions: Question[];
  currentIndex: number;
  answers: Array<[string, number[]]>;
  revealed: boolean;
  startedAt: string | null;
}

export function getSelectedCertification(): string | null {
  return localStorage.getItem(SELECTED_CERT_KEY);
}

export function setSelectedCertification(certId: string): void {
  localStorage.setItem(SELECTED_CERT_KEY, certId);
}

export function getAttempts(certId: string): Attempt[] {
  try {
    const raw = localStorage.getItem(attemptsKey(certId));
    return raw ? (JSON.parse(raw) as Attempt[]) : [];
  } catch {
    return [];
  }
}

export function getPracticeSession(certId: string): PracticeSession | null {
  try {
    const raw = localStorage.getItem(sessionKey(certId));
    return raw ? (JSON.parse(raw) as PracticeSession) : null;
  } catch {
    return null;
  }
}

export function savePracticeSession(certId: string, session: PracticeSession): void {
  localStorage.setItem(sessionKey(certId), JSON.stringify(session));
}

export function clearPracticeSession(certId: string): void {
  localStorage.removeItem(sessionKey(certId));
}

export function saveAttempt(certId: string, attempt: Attempt): void {
  const attempts = getAttempts(certId);
  attempts.unshift(attempt);
  localStorage.setItem(attemptsKey(certId), JSON.stringify(attempts));
}

export function clearAttempts(certId: string): void {
  localStorage.removeItem(attemptsKey(certId));
}

export function getAttemptById(certId: string, id: string): Attempt | undefined {
  return getAttempts(certId).find((a) => a.id === id);
}

/** Aggregates per-domain accuracy across all saved attempts for a certification. */
export function getDomainStats(certId: string): DomainStat[] {
  const attempts = getAttempts(certId);
  const byDomain = new Map<string, { correct: number; total: number }>();

  for (const attempt of attempts) {
    for (const answer of attempt.answers) {
      const stat = byDomain.get(answer.domain) ?? { correct: 0, total: 0 };
      stat.total += 1;
      if (answer.correct) stat.correct += 1;
      byDomain.set(answer.domain, stat);
    }
  }

  return [...byDomain.entries()].map(([domain, { correct, total }]) => ({
    domain,
    correct,
    total,
    accuracyPct: total > 0 ? Math.round((correct / total) * 100) : 0,
  }));
}

export const WEAK_DOMAIN_THRESHOLD = 70;

export function getWeakDomains(certId: string): string[] {
  return getDomainStats(certId)
    .filter((s) => s.total >= 3 && s.accuracyPct < WEAK_DOMAIN_THRESHOLD)
    .map((s) => s.domain);
}
