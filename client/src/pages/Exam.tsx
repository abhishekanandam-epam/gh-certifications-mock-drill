import { useEffect, useState } from "react";
import { fetchDomains, fetchQuestions } from "../lib/api";
import { buildAttempt } from "../lib/grading";
import { saveAttempt } from "../lib/storage";
import { useCertification } from "../lib/certification";
import QuestionCard from "../components/QuestionCard";
import ProgressBar from "../components/ProgressBar";
import ScoreSummary from "../components/ScoreSummary";
import Timer from "../components/Timer";
import type { Attempt, Domain, Question } from "../types";

type Stage = "setup" | "session" | "review";

const DEFAULT_COUNT = 60;
const DEFAULT_MINUTES = 90;

export default function Exam() {
  const { certId } = useCertification();
  const [stage, setStage] = useState<Stage>("setup");
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [count, setCount] = useState(DEFAULT_COUNT);
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, number[]>>(new Map());
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!certId) return;
    fetchDomains(certId).then((d) => {
      setDomains(d);
      setSelectedDomains(d.map((x) => x.id));
    });
  }, [certId]);

  const currentQuestion = questions[currentIndex];

  function toggleDomain(id: string) {
    setSelectedDomains((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
  }

  async function startExam() {
    if (!certId) return;
    setLoading(true);
    try {
      const qs = await fetchQuestions({ certId, domains: selectedDomains, mode: "exam", count });
      setQuestions(qs);
      setCurrentIndex(0);
      setAnswers(new Map());
      setStartedAt(new Date());
      setStage("session");
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(chosen: number[]) {
    if (!currentQuestion) return;
    setAnswers((prev) => new Map(prev).set(currentQuestion.id, chosen));
  }

  function goTo(index: number) {
    setCurrentIndex(index);
  }

  function submitExam() {
    if (!startedAt || !certId) return;
    const finished = buildAttempt("exam", questions, answers, startedAt);
    saveAttempt(certId, finished);
    setAttempt(finished);
    setStage("review");
  }

  function restart() {
    setStage("setup");
    setAttempt(null);
  }

  if (stage === "setup") {
    return (
      <div className="page">
        <h1>Mock Exam</h1>
        <p>Simulates the real exam: a fixed set of questions under a countdown timer, with no feedback until you submit.</p>
        <div className="exam-config">
          <label>
            Number of questions
            <input
              type="number"
              min={10}
              max={300}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </label>
          <label>
            Time limit (minutes)
            <input
              type="number"
              min={5}
              max={240}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
            />
          </label>
        </div>
        <div className="domain-checkboxes">
          {domains.map((d) => (
            <label key={d.id} className="domain-checkbox">
              <input
                type="checkbox"
                checked={selectedDomains.includes(d.id)}
                onChange={() => toggleDomain(d.id)}
              />
              {d.name}
            </label>
          ))}
        </div>
        <button
          className="btn btn-primary"
          disabled={selectedDomains.length === 0 || loading}
          onClick={startExam}
        >
          {loading ? "Loading..." : "Start Mock Exam"}
        </button>
      </div>
    );
  }

  if (stage === "session" && currentQuestion) {
    const answeredCount = answers.size;
    return (
      <div className="page">
        <div className="exam-header">
          <ProgressBar current={answeredCount} total={questions.length} />
          <Timer totalSeconds={minutes * 60} onExpire={submitExam} />
        </div>
        <QuestionCard
          question={currentQuestion}
          index={currentIndex}
          total={questions.length}
          selected={answers.get(currentQuestion.id) ?? []}
          onChange={selectAnswer}
          revealed={false}
        />
        <div className="session-actions">
          <button className="btn" disabled={currentIndex === 0} onClick={() => goTo(currentIndex - 1)}>
            Previous
          </button>
          {currentIndex + 1 < questions.length ? (
            <button className="btn btn-primary" onClick={() => goTo(currentIndex + 1)}>
              Next
            </button>
          ) : (
            <button className="btn btn-primary" onClick={submitExam}>
              Submit Exam
            </button>
          )}
        </div>
        <div className="question-jump">
          {questions.map((q, i) => (
            <button
              key={q.id}
              className={`jump-button ${i === currentIndex ? "jump-current" : ""} ${
                answers.has(q.id) ? "jump-answered" : ""
              }`}
              onClick={() => goTo(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (stage === "review" && attempt) {
    return (
      <div className="page">
        <h1>Exam Results</h1>
        <ScoreSummary attempt={attempt} />
        <button className="btn btn-primary" onClick={restart}>
          Take Another Exam
        </button>
        <div className="review-list">
          {questions.map((q, i) => {
            const answer = attempt.answers[i];
            return (
              <QuestionCard
                key={q.id}
                question={q}
                index={i}
                total={questions.length}
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

  return <div className="page">Loading...</div>;
}
