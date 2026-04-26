import React from "react";
import { AGENTS } from "../utils/constants";

const PipelineTrack = ({ pills }) => {
  return (
    <div className="pipeline-track">
      {AGENTS.map((agent, i) => (
        <React.Fragment key={agent}>
          <div className={`agent-pill ${pills[agent] || ""}`}>
            <span className="pip-dot" />
            {agent}
          </div>
          {i < AGENTS.length - 1 && <span className="pip-arrow">›</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default PipelineTrack;
