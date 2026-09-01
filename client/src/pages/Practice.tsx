import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchDomains, fetchQuestions } from "../lib/api";
import { buildAttempt } from "../lib/grading";
import { saveAttempt, getPracticeSession, savePracticeSession, clearPracticeSession } from "../lib/storage";
import { useCertification } from "../lib/certification";
import QuestionCard from "../components/QuestionCard";
import ProgressBar from "../components/ProgressBar";
import ScoreSummary from "../components/ScoreSummary";
import type { Attempt, Domain, Question } from "../types";

type Stage = "setup" | "session" | "summary";

export default function Practice() {
  const [searchParams] = useSearchParams();
  const { certId } = useCertification();
  const [stage, setStage] = useState<Stage>("setup");
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, number[]>>(new Map());
  const [revealed, setRevealed] = useState(false);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(false);

  // Load domains and check for existing session
  useEffect(() => {
    if (!certId) return;
    fetchDomains(certId).then((d) => {
      setDomains(d);
      
      // Check if there's a saved session
      const savedSession = getPracticeSession(certId);
      if (savedSession && savedSession.stage !== "summary") {
        // Restore the session
        setSelectedDomains(savedSession.selectedDomains);
        setQuestions(savedSession.questions);
        setCurrentIndex(savedSession.currentIndex);
        setAnswers(new Map(savedSession.answers));
        setRevealed(savedSession.revealed);
        setStartedAt(savedSession.startedAt ? new Date(savedSession.startedAt) : null);
        setStage(savedSession.stage);
      } else {
        // Fresh start
        const preselected = searchParams.get("domains");
        if (preselected) {
          const ids = preselected.split(",").filter(Boolean);
          setSelectedDomains(ids.length > 0 ? ids : d.map((x) => x.id));
        } else {
          setSelectedDomains(d.map((x) => x.id));
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [certId]);

  // Save session whenever relevant state changes
  useEffect(() => {
    if (certId && stage === "session" && questions.length > 0 && startedAt) {
      const session = {
        stage,
        selectedDomains,
        questions,
        currentIndex,
        answers: Array.from(answers.entries()),
        revealed,
        startedAt: startedAt.toISOString(),
      };
      savePracticeSession(certId, session);
    }
  }, [certId, stage, selectedDomains, questions, currentIndex, answers, revealed, startedAt]);

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = useMemo(
    () => (currentQuestion ? answers.get(currentQuestion.id) ?? [] : []),
    [answers, currentQuestion]
  );

  function toggleDomain(id: string) {
    setSelectedDomains((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
  }

  async function startSession() {
    if (!certId) return;
    setLoading(true);
    try {
      const qs = await fetchQuestions({ certId, domains: selectedDomains, mode: "practice" });
      setQuestions(qs);
      setCurrentIndex(0);
      setAnswers(new Map());
      setRevealed(false);
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

  function checkAnswer() {
    setRevealed(true);
  }

  function nextQuestion() {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setRevealed(false);
    } else {
      finishSession();
    }
  }

  function previousQuestion() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setRevealed(false);
    }
  }

  function finishSession() {
    if (!startedAt || !certId) return;
    const finished = buildAttempt("practice", questions, answers, startedAt);
    saveAttempt(certId, finished);
    setAttempt(finished);
    setStage("summary");
    clearPracticeSession(certId);
  }

  function restart() {
    setStage("setup");
    setAttempt(null);
    if (certId) clearPracticeSession(certId);
  }

  if (stage === "setup") {
    return (
      <div className="page">
        <h1>Practice Mode</h1>
        <p>Pick domains to focus on. Instant feedback and explanations are shown after each question.</p>
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
          onClick={startSession}
        >
          {loading ? "Loading..." : "Start Practice"}
        </button>
      </div>
    );
  }

  if (stage === "session" && currentQuestion) {
    return (
      <div className="page">
        <ProgressBar current={currentIndex + (revealed ? 1 : 0)} total={questions.length} />
        <QuestionCard
          question={currentQuestion}
          index={currentIndex}
          total={questions.length}
          selected={selectedAnswer}
          onChange={selectAnswer}
          revealed={revealed}
        />
        <div className="session-actions">
          <button 
            className="btn btn-secondary" 
            disabled={currentIndex === 0} 
            onClick={previousQuestion}
          >
            ← Previous
          </button>
          {!revealed ? (
            <button className="btn btn-primary" disabled={selectedAnswer.length === 0} onClick={checkAnswer}>
              Check Answer
            </button>
          ) : (
            <button className="btn btn-primary" onClick={nextQuestion}>
              {currentIndex + 1 < questions.length ? "Next Question →" : "Finish"}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (stage === "summary" && attempt) {
    return (
      <div className="page">
        <h1>Practice Complete</h1>
        <ScoreSummary attempt={attempt} />
        <button className="btn btn-primary" onClick={restart}>
          Practice Again
        </button>
      </div>
    );
  }

  return <div className="page">Loading...</div>;
}
