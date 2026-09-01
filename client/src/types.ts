export interface Certification {
  id: string;
  name: string;
  shortName: string;
  description: string;
}

export interface Domain {
  id: string;
  name: string;
  description: string;
}

export interface Question {
  id: string;
  domain: string;
  question: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export type Mode = "practice" | "exam";

export interface AnsweredQuestion {
  questionId: string;
  domain: string;
  chosen: number[];
  correct: boolean;
}

export interface Attempt {
  id: string;
  mode: Mode;
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
  answers: AnsweredQuestion[];
  scorePct: number;
  passed: boolean;
  totalQuestions: number;
}

export interface DomainStat {
  domain: string;
  correct: number;
  total: number;
  accuracyPct: number;
}
