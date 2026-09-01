import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { clearAttempts, getAttempts } from "../lib/storage";
import { useCertification } from "../lib/certification";
import type { Attempt } from "../types";

export default function History() {
  const { certId } = useCertification();
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    if (certId) setAttempts(getAttempts(certId));
  }, [certId]);

  function handleClear() {
    if (!certId) return;
    if (confirm("Clear all attempt history? This cannot be undone.")) {
      clearAttempts(certId);
      setAttempts([]);
    }
  }

  return (
    <div className="page">
      <div className="section-header">
        <h1>History</h1>
        {attempts.length > 0 && (
          <button className="btn" onClick={handleClear}>
            Clear History
          </button>
        )}
      </div>

      {attempts.length === 0 ? (
        <p className="empty-state">No attempts recorded yet.</p>
      ) : (
        <table className="domain-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Mode</th>
              <th>Score</th>
              <th>Duration</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((a) => (
              <tr key={a.id}>
                <td>{new Date(a.finishedAt).toLocaleString()}</td>
                <td>{a.mode === "exam" ? "Mock Exam" : "Practice"}</td>
                <td className={a.passed ? "text-pass" : "text-fail"}>{a.scorePct}%</td>
                <td>{Math.round(a.durationSeconds / 60)} min</td>
                <td>
                  <Link to={`/history/${a.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
