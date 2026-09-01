import type { Attempt } from "../types";

interface ScoreSummaryProps {
  attempt: Attempt;
}

export default function ScoreSummary({ attempt }: ScoreSummaryProps) {
  const correctCount = attempt.answers.filter((a) => a.correct).length;
  return (
    <div className={`score-summary ${attempt.passed ? "score-pass" : "score-fail"}`}>
      <div className="score-pct">{attempt.scorePct}%</div>
      <div className="score-details">
        <div>{attempt.passed ? "Passed" : "Not yet passing"}</div>
        <div>
          {correctCount} / {attempt.totalQuestions} correct
        </div>
        <div>{Math.round(attempt.durationSeconds / 60)} min</div>
      </div>
    </div>
  );
}
