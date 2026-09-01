import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchQuestions } from "../lib/api";
import { getAttemptById } from "../lib/storage";
import { useCertification } from "../lib/certification";
import ScoreSummary from "../components/ScoreSummary";
import QuestionCard from "../components/QuestionCard";
import type { Attempt, Question } from "../types";

export default function AttemptDetail() {
  const { id } = useParams();
  const { certId } = useCertification();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [questionsById, setQuestionsById] = useState<Map<string, Question>>(new Map());

  useEffect(() => {
    if (!id || !certId) return;
    const found = getAttemptById(certId, id);
    setAttempt(found ?? null);
    fetchQuestions({ certId, mode: "practice" }).then((all) => {
      setQuestionsById(new Map(all.map((q) => [q.id, q])));
    });
  }, [id, certId]);

  if (!attempt) {
    return (
      <div className="page">
        <p>Attempt not found.</p>
        <Link to="/history">Back to History</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/history">&larr; Back to History</Link>
      <h1>Attempt Review</h1>
      <ScoreSummary attempt={attempt} />
      <div className="review-list">
        {attempt.answers.map((answer, i) => {
          const question = questionsById.get(answer.questionId);
          if (!question) return null;
          return (
            <QuestionCard
              key={answer.questionId}
              question={question}
              index={i}
              total={attempt.answers.length}
              selected={answer.chosen}
              onChange={() => {}}
              revealed
              disabled
            />
          );
        })}
      </div>
    </div>
  );
}
