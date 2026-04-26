import React, { useState } from "react";
import { API } from "../utils/constants";

const RemovePDF = ({ onRemoved }) => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState("");

  const handleRemove = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`${API}/remove-pdf`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed");
      setMsg("✓ PDF removed");
      if (onRemoved) onRemoved();
    } catch (e) {
      setMsg(`✗ ${e.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  return (
    <div className="remove-pdf-wrap">
      <button
        className={`btn-remove${loading ? " loading" : ""}`}
        onClick={handleRemove}
        disabled={loading}
        title="Remove indexed PDF from vector store"
      >
        {loading ? (
          <span className="remove-spinner" />
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        )}
        {loading ? "Removing…" : "Remove PDF"}
      </button>
      {msg && (
        <span className={`remove-msg${msg.startsWith("✓") ? " ok" : " fail"}`}>
          {msg}
        </span>
      )}
    </div>
  );
};

export default RemovePDF;
