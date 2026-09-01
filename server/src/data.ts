import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import type { Certification, Domain, Question } from "./types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");

export const certifications: Certification[] = JSON.parse(
  readFileSync(path.join(dataDir, "certifications.json"), "utf-8")
);

export const defaultCertificationId = certifications[0]?.id;

function loadJson<T>(certId: string, fileName: string): T {
  const filePath = path.join(dataDir, "certifications", certId, fileName);
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

const domainsCache = new Map<string, Domain[]>();
const questionsCache = new Map<string, Question[]>();

export function isKnownCertification(certId: string): boolean {
  return certifications.some((c) => c.id === certId);
}

export function getDomains(certId: string): Domain[] {
  if (!domainsCache.has(certId)) {
    domainsCache.set(certId, loadJson<Domain[]>(certId, "domains.json"));
  }
  return domainsCache.get(certId)!;
}

export function getQuestions(certId: string): Question[] {
  if (!questionsCache.has(certId)) {
    questionsCache.set(certId, loadJson<Question[]>(certId, "questions.json"));
  }
  return questionsCache.get(certId)!;
}
