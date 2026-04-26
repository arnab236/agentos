import React from "react";

const TopBar = ({ status, loading, historyCount, onToggleHistory }) => {
  const isLive  = loading || status === "live";
  const isError = !loading && status === "error";
  const label   = loading ? "running" : status;

  return (
    <div className="topbar">
      {/* Logo */}
      <div className="logo">
        <div className="logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
          </svg>
        </div>
        <div>
          <div className="logo-name">AgentOS</div>
          <div className="logo-sub">multi-agent + rag pipeline</div>
        </div>
      </div>

      {/* Right side */}
      <div className="topbar-right">
        <span className={`badge${isLive ? " live" : isError ? " error" : ""}`}>
          {isLive ? "● " : ""}{label}
        </span>
        <button className="btn-ghost" onClick={onToggleHistory}>
          history{historyCount > 0 ? ` (${historyCount})` : ""}
        </button>
      </div>
    </div>
  );
};

export default TopBar;
