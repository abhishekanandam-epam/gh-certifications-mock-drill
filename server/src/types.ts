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
