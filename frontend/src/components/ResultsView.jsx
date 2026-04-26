import React from "react";
import { confColor, confLabel } from "../utils/helpers";

// ── ThinkingCard ──────────────────────────────────────────────────────────────

const ThinkingCard = () => (
  <div className="thinking-card">
    <div className="thinking-dots">
      <span className="td" />
      <span className="td" />
      <span className="td" />
    </div>
    <span>pipeline running…</span>
  </div>
);

// ── AnswerCard ────────────────────────────────────────────────────────────────

const AnswerCard = ({ data }) => {
  const d       = data.data || {};
  const keyPts  = Array.isArray(d.key_points) ? d.key_points : [];
  const src     = d.metadata?.source || "llm";
  const srcClass = src.toLowerCase().includes("rag") ? "rag" : "llm";
  const srcLabel = srcClass === "rag" ? "📄 rag" : "🤖 llm";

  return (
    <div className="card purple-border">
      <div className="card-header">
        <div className="card-title">
          <span className="cdot purple" /> answer
        </div>
        <div className="badge-row">
          <span className="intent-badge">general_qa</span>
          <span className={`source-badge ${srcClass}`}>{srcLabel}</span>
        </div>
      </div>

      <p className="answer-text">{d.answer || "No answer returned."}</p>

      {keyPts.length > 0 && (
        <ul className="kp-list">
          {keyPts.map((pt, i) => (
            <li key={i} className="kp-item">
              <span className="kp-dot" />
              {pt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ── StepsCard ─────────────────────────────────────────────────────────────────

const StepsCard = ({ steps }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="card">
      <div className="card-title" style={{ marginBottom: "1rem" }}>
        <span className="cdot teal" /> steps
      </div>
      <div className="steps-list">
        {steps.map((s, i) => (
          <div key={i} className="step-item">
            <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── ConfidenceCard ────────────────────────────────────────────────────────────

const ConfidenceCard = ({ value }) => {
  const pct   = Math.round(value * 100);
  const color = confColor(value);
  const label = confLabel(value);

  return (
    <div className="card">
      <div className="card-title" style={{ marginBottom: "1rem" }}>
        <span className="cdot purple" /> confidence
      </div>
      <div className="conf-row">
        <div className="conf-track">
          <div className="conf-fill" style={{ width: `${pct}%`, background: color }} />
        </div>
        <span className="conf-pct" style={{ color }}>{pct}%</span>
      </div>
      <div className="conf-label">{label}</div>
    </div>
  );
};

// ── CriticCard ────────────────────────────────────────────────────────────────

const CriticCard = ({ text }) => (
  <div className="card">
    <div className="card-title" style={{ marginBottom: "1rem" }}>
      <span className="cdot amber" /> critic review
    </div>
    <p className="critic-text">{text || "No critique available."}</p>
  </div>
);

// ── ResearchCard ──────────────────────────────────────────────────────────────

const ResearchCard = ({ insights }) => {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="card">
      <div className="card-title" style={{ marginBottom: "1rem" }}>
        <span className="cdot teal" /> research insights
      </div>
      <div className="insight-list">
        {insights.map((ins, i) => (
          <div key={i} className="insight-item">
            <span className="insight-arrow">→</span>
            <span>{ins}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── ErrorCard ─────────────────────────────────────────────────────────────────

const ErrorCard = ({ message }) => (
  <div className="card error-card">
    <div className="card-title">
      <span className="cdot red" /> error
    </div>
    <p className="error-msg">{message}</p>
  </div>
);

// ── ResultsView (main export) ─────────────────────────────────────────────────

const ResultsView = ({ result }) => {
  if (!result) {
    return (
      <div className="empty-state">
        <div>— awaiting query —</div>
        <p>type a question above and hit run</p>
      </div>
    );
  }

  if (result.__thinking) return <ThinkingCard />;

  if (result.status === "error") {
    return (
      <div className="results-area">
        <ErrorCard message={result.message} />
      </div>
    );
  }

  const d        = result.data || {};
  const analysis = result.analysis || {};
  const conf     = d.metadata?.confidence ?? 0.5;
  const steps    = Array.isArray(d.steps) ? d.steps : [];
  const insights = Array.isArray(analysis.research_found) ? analysis.research_found : [];

  return (
    <div className="results-area">
      <AnswerCard data={result} />

      {steps.length > 0 && <StepsCard steps={steps} />}

      <div className="two-col">
        <ConfidenceCard value={conf} />
        <CriticCard text={analysis.critic} />
      </div>

      <ResearchCard insights={insights} />
    </div>
  );
};

export default ResultsView;
