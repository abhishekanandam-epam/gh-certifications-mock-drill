import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDomains } from "../lib/api";
import { getAttempts, getDomainStats, getWeakDomains, WEAK_DOMAIN_THRESHOLD } from "../lib/storage";
import { useCertification } from "../lib/certification";
import type { Domain } from "../types";

export default function Dashboard() {
  const navigate = useNavigate();
  const { certId } = useCertification();
  const [domains, setDomains] = useState<Domain[]>([]);

  useEffect(() => {
    if (!certId) return;
    fetchDomains(certId).then(setDomains).catch(() => setDomains([]));
  }, [certId]);

  const attempts = certId ? getAttempts(certId) : [];
  const domainStats = certId ? getDomainStats(certId) : [];
  const weakDomains = certId ? getWeakDomains(certId) : [];

  const domainName = (id: string) => domains.find((d) => d.id === id)?.name ?? id;

  const examAttempts = attempts.filter((a) => a.mode === "exam");
  const avgScore =
    examAttempts.length > 0
      ? Math.round(examAttempts.reduce((sum, a) => sum + a.scorePct, 0) / examAttempts.length)
      : null;
  const bestScore = examAttempts.length > 0 ? Math.max(...examAttempts.map((a) => a.scorePct)) : null;

  function practiceWeakAreas() {
    navigate(`/practice?domains=${weakDomains.join(",")}`);
  }

  return (
    <div className="page">
      <h1>Dashboard</h1>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-value">{attempts.length}</div>
          <div className="stat-label">Total attempts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{examAttempts.length}</div>
          <div className="stat-label">Mock exams taken</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{avgScore !== null ? `${avgScore}%` : "-"}</div>
          <div className="stat-label">Average exam score</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{bestScore !== null ? `${bestScore}%` : "-"}</div>
          <div className="stat-label">Best exam score</div>
        </div>
      </div>

      {attempts.length === 0 && (
        <p className="empty-state">
          No attempts yet. Start a <a href="/practice">Practice session</a> or take a{" "}
          <a href="/exam">Mock Exam</a> to see your stats here.
        </p>
      )}

      {domainStats.length > 0 && (
        <div className="domain-stats-section">
          <div className="section-header">
            <h2>Domain accuracy</h2>
            {weakDomains.length > 0 && (
              <button className="btn btn-primary" onClick={practiceWeakAreas}>
                Practice weak areas ({weakDomains.length})
              </button>
            )}
          </div>
          <table className="domain-table">
            <thead>
              <tr>
                <th>Domain</th>
                <th>Accuracy</th>
                <th>Answered</th>
              </tr>
            </thead>
            <tbody>
              {domainStats
                .sort((a, b) => a.accuracyPct - b.accuracyPct)
                .map((stat) => (
                  <tr key={stat.domain} className={stat.accuracyPct < WEAK_DOMAIN_THRESHOLD ? "row-weak" : ""}>
                    <td>{domainName(stat.domain)}</td>
                    <td>{stat.accuracyPct}%</td>
                    <td>
                      {stat.correct} / {stat.total}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
