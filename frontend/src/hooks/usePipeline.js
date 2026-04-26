import { useState, useRef, useCallback } from "react";
import { API, AGENTS } from "../utils/constants";

const usePipeline = () => {
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [status, setStatus]       = useState("idle");
  const [pills, setPills]         = useState({});
  const [history, setHistory]     = useState([]);
  const tickRef = useRef(null);

  // ── pill helpers ──────────────────────────────────────
  const resetPills = () => setPills({});

  const animatePills = useCallback(() => {
    let idx = 0;
    tickRef.current = setInterval(() => {
      setPills((prev) => {
        const next = { ...prev };
        if (idx > 0) next[AGENTS[idx - 1]] = "done";
        if (idx < AGENTS.length) { next[AGENTS[idx]] = "active"; idx++; }
        else clearInterval(tickRef.current);
        return next;
      });
    }, 850);
  }, []);

  const stopPills = useCallback((state = "done") => {
    clearInterval(tickRef.current);
    const final = {};
    AGENTS.forEach((a) => (final[a] = state));
    setPills(final);
  }, []);

  // ── run pipeline ──────────────────────────────────────
  const run = async (query) => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setStatus("live");
    resetPills();
    setResult({ __thinking: true });
    animatePills();

    try {
      const res = await fetch(`${API}/solve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();

      stopPills(data.status === "error" ? "error" : "done");
      setResult(data);
      setStatus("done");

      if (data.status !== "error") {
        setHistory((h) => [{ q: query, ts: new Date().toLocaleTimeString(), data }, ...h.slice(0, 19)]);
      }
    } catch (e) {
      stopPills("error");
      setStatus("error");
      setResult({
        status: "error",
        message: `Cannot reach ${API}\n\nStart your backend:\n  uvicorn main:app --reload`,
      });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  // ── replay from history ───────────────────────────────
  const replayHistory = (item, setQuery) => {
    setQuery(item.q);
    setResult(item.data);
    const done = {};
    AGENTS.forEach((a) => (done[a] = "done"));
    setPills(done);
  };

  return { result, loading, status, pills, history, run, replayHistory, setResult };
};

export default usePipeline;
