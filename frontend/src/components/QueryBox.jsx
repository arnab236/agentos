import React from "react";
import RemovePDF from "./RemovePDF";

const QueryBox = ({
  query, onQueryChange, onRun, loading,
  fileRef, file, fileLabel, uploading,
  onFileChange, onUpload, onRemoved,
}) => {
  const handleKey = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onRun();
  };

  return (
    <div className="query-box">
      <div className="query-label">query</div>

      <div className="input-row">
        <textarea
          className="query-textarea"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask anything — the pipeline will plan, research, execute, critique and score…"
        />
        <button className="run-btn" onClick={onRun} disabled={loading}>
          {loading ? (
            <div className="spinner" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
          <span>{loading ? "…" : "Run"}</span>
        </button>
      </div>

      <div className="upload-row">
        <input type="file" accept=".pdf" ref={fileRef}
          style={{ display: "none" }} onChange={onFileChange} />

        <button className="btn-upload" onClick={() => fileRef.current.click()}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          Upload PDF (RAG)
        </button>

        {fileLabel && <span className="file-name">{fileLabel}</span>}

        {file && (
          <button className="btn-process" onClick={onUpload} disabled={uploading}>
            {uploading ? "Processing…" : "Process PDF"}
          </button>
        )}

        {/* onRemoved clears the label + file state in the parent hook */}
        <RemovePDF onRemoved={onRemoved} />
      </div>
    </div>
  );
};

export default QueryBox;
