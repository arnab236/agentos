import React, { useState } from "react";
import "./index.css";

import usePipeline   from "./hooks/usePipeline";
import useFileUpload from "./hooks/useFileUpload";

import TopBar        from "./components/TopBar";
import HistoryPanel  from "./components/HistoryPanel";
import QueryBox      from "./components/QueryBox";
import PipelineTrack from "./components/PipelineTrack";
import ResultsView   from "./components/ResultsView";

const App = () => {
  const [query, setQuery]             = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const { result, loading, status, pills, history, run, replayHistory } = usePipeline();
  const { file, fileLabel, uploading, fileRef, onFileChange, upload, clearFile } = useFileUpload();

  const handleRun = () => run(query);

  const handleHistorySelect = (item) => {
    replayHistory(item, setQuery);
    setShowHistory(false);
  };

  return (
    <div className="shell">

      <TopBar
        status={status}
        loading={loading}
        historyCount={history.length}
        onToggleHistory={() => setShowHistory((v) => !v)}
      />

      {showHistory && (
        <HistoryPanel history={history} onSelect={handleHistorySelect} />
      )}

      <QueryBox
        query={query}
        onQueryChange={setQuery}
        onRun={handleRun}
        loading={loading}
        fileRef={fileRef}
        file={file}
        fileLabel={fileLabel}
        uploading={uploading}
        onFileChange={onFileChange}
        onUpload={upload}
        onRemoved={clearFile}   // ← clears name + resets input after removal
      />

      <PipelineTrack pills={pills} />

      <ResultsView result={result} />

    </div>
  );
};

export default App;
