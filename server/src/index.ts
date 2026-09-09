import express from "express";
import cors from "cors";
import { certifications, defaultCertificationId, getDomains, getQuestions, isKnownCertification } from "./data.js";
import { proportionalDraw, shuffle } from "./shuffle.js";
import { getModeConfig } from "./config.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

function resolveCertId(req: express.Request, res: express.Response): string | undefined {
  const certId = typeof req.query.cert === "string" ? req.query.cert : defaultCertificationId;
  if (!certId || !isKnownCertification(certId)) {
    res.status(404).json({ error: `Unknown certification: ${certId}` });
    return undefined;
  }
  return certId;
}

app.get("/api/certifications", (_req, res) => {
  res.json(certifications);
});

app.get("/api/domains", (req, res) => {
  const certId = resolveCertId(req, res);
  if (!certId) return;
  res.json(getDomains(certId));
});

app.get("/api/modes", (_req, res) => {
  const modes = {
    practice: {
      name: "Practice Session",
      questionCount: 316,
      timeLimit: null,
      description: "Full practice session with all available questions",
    },
    exam: {
      name: "Mock Exam",
      questionCount: 100,
      timeLimit: 120, // minutes
      description: "Timed mock exam with 100 questions (120 minutes)",
    },
  };
  res.json(modes);
});

app.get("/api/questions", (req, res) => {
  const certId = resolveCertId(req, res);
  if (!certId) return;

  const domains = getDomains(certId);
  const questions = getQuestions(certId);

  const domainsParam = req.query.domains;
  const mode = typeof req.query.mode === "string" ? req.query.mode : "practice";
  const countParam = req.query.count;

  const modeConfig = getModeConfig(mode);

  const selectedDomains =
    typeof domainsParam === "string" && domainsParam.length > 0
      ? domainsParam.split(",")
      : domains.map((d) => d.id);

  const pool = questions.filter((q) => selectedDomains.includes(q.domain));

  // Use mode-specific defaults and limits
  const count = countParam 
    ? Math.min(Number(countParam), modeConfig.maxCount, pool.length)
    : Math.min(modeConfig.defaultCount, pool.length);

  if (mode === "exam") {
    const grouped = new Map<string, typeof pool>();
    for (const q of pool) {
      const list = grouped.get(q.domain) ?? [];
      list.push(q);
      grouped.set(q.domain, list);
    }
    return res.json(proportionalDraw(grouped, count));
  }

  return res.json(shuffle(pool).slice(0, count));
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`GH Certifications mock drill server listening on http://localhost:${PORT}`);
});
