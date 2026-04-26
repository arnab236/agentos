import React from "react";

const HistoryPanel = ({ history, onSelect }) => {
  return (
    <div className="history-panel">
      {history.length === 0 ? (
        <div className="history-empty">no history yet</div>
      ) : (
        history.map((h, i) => (
          <div key={i} className="history-item" onClick={() => onSelect(h)}>
            <span className="h-q">{h.q}</span>
            <span className="h-ts">{h.ts}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default HistoryPanel;
