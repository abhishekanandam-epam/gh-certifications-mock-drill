import type { AnsweredQuestion, Attempt, Mode, Question } from "../types";

export const PASS_THRESHOLD_PCT = 70;

function isCorrect(question: Question, chosen: number[]): boolean {
  if (chosen.length !== question.correctAnswers.length) return false;
  const sortedChosen = [...chosen].sort();
  const sortedCorrect = [...question.correctAnswers].sort();
  return sortedChosen.every((v, i) => v === sortedCorrect[i]);
}

export function gradeAnswer(question: Question, chosen: number[]): AnsweredQuestion {
  return {
    questionId: question.id,
    domain: question.domain,
    chosen,
    correct: isCorrect(question, chosen),
  };
}

export function buildAttempt(
  mode: Mode,
  questions: Question[],
  answers: Map<string, number[]>,
  startedAt: Date
): Attempt {
  const graded = questions.map((q) => gradeAnswer(q, answers.get(q.id) ?? []));
  const correctCount = graded.filter((a) => a.correct).length;
  const scorePct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const finishedAt = new Date();

  return {
    id: crypto.randomUUID(),
    mode,
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    durationSeconds: Math.round((finishedAt.getTime() - startedAt.getTime()) / 1000),
    answers: graded,
    scorePct,
    passed: scorePct >= PASS_THRESHOLD_PCT,
    totalQuestions: questions.length,
  };
}
