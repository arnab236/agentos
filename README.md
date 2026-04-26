# AgentOS 🤖

A multi-agent AI system with RAG pipeline — built with FastAPI, LangChain, FAISS, and React.

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)
![LangChain](https://img.shields.io/badge/LangChain-latest-orange?style=flat-square)
![Ollama](https://img.shields.io/badge/Ollama-gemma2:2b-black?style=flat-square)

---

## What is this?

AgentOS is a local multi-agent AI pipeline where every query passes through a chain of specialized agents before returning an answer.

```
Query → RAG Check → Planner → Researcher → Executor → Critic → Confidence Score → Response
```

You can also upload a PDF and the system will use it as context (RAG) when answering questions related to it.

---

## Features

- **Multi-Agent Pipeline** — Planner, Researcher, Executor, Critic and Confidence agents work together
- **RAG Support** — Upload a PDF and query it using FAISS vector search
- **Local LLM** — Runs fully offline using Ollama (gemma2:2b)
- **Remove PDF** — Clear the vector index anytime from the UI
- **Query History** — Revisit past queries without re-running the pipeline
- **Pipeline Visualizer** — Watch each agent activate in real time

---

## Tech Stack

### Backend
| Tech | Purpose |
|------|---------|
| FastAPI | REST API server |
| LangChain | Document loading and splitting |
| FAISS | Vector store for RAG |
| HuggingFace Embeddings | Embedding model (all-MiniLM-L6-v2) |
| Ollama | Local LLM runner |
| gemma2:2b | Language model |

### Frontend
| Tech | Purpose |
|------|---------|
| React + Vite | UI framework |
| CSS Variables | Theming and styling |
| Custom Hooks | API calls and state management |

---

## Project Structure

```
agentos/
├── backend/
│   ├── main.py                  # FastAPI app, routes
│   ├── agents/
│   │   ├── planner.py           # Breaks query into steps
│   │   ├── research.py          # Extracts supporting insights
│   │   ├── executor.py          # Generates the main answer
│   │   ├── critic.py            # Reviews and improves the answer
│   │   └── confidence.py        # Scores confidence (0 to 1)
│   ├── core/
│   │   └── llm.py               # Ollama API call wrapper
│   ├── models/
│   │   └── query_model.py       # Pydantic request model
│   ├── services/
│   │   ├── agent_service.py     # Orchestrates all agents
│   │   └── rag_service.py       # PDF processing and querying
│   └── requirements.txt
│
├── frontend/
│   └── src/
│       ├── App.jsx              # Root component
│       ├── components/
│       │   ├── TopBar.jsx       # Logo, status, history toggle
│       │   ├── HistoryPanel.jsx # Past queries
│       │   ├── QueryBox.jsx     # Input, run button, PDF upload
│       │   ├── PipelineTrack.jsx# Animated agent pills
│       │   ├── ResultsView.jsx  # Answer, steps, confidence, critic
│       │   └── RemovePDF.jsx    # Delete vector index button
│       ├── hooks/
│       │   ├── usePipeline.js   # API calls + pill animation
│       │   └── useFileUpload.js # PDF upload + clear state
│       ├── styles/
│       │   └── styles.css       # All styles + CSS variables
│       └── utils/
│           ├── constants.js     # API URL, agent list
│           └── helpers.js       # Color and label helpers
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- [Ollama](https://ollama.com) installed

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/agentos.git
cd agentos
```

### 2. Set up the Backend

```bash
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt
```

### 3. Pull the LLM model

```bash
ollama pull gemma2:2b
```

### 4. Start the Backend

Open **3 terminals**:

```bash
# Terminal 1 — Ollama
ollama serve

# Terminal 2 — FastAPI
cd backend
uvicorn main:app --reload
```

Backend runs at **http://127.0.0.1:8000**

### 5. Set up and start the Frontend

```bash
# Terminal 3 — React
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/solve` | Run the agent pipeline |
| `POST` | `/upload` | Upload and index a PDF |
| `DELETE` | `/remove-pdf` | Clear the vector store |

### Example request

```bash
curl -X POST http://127.0.0.1:8000/solve \
  -H "Content-Type: application/json" \
  -d '{"question": "What is a transformer model?"}'
```

### Example response

```json
{
  "status": "success",
  "query": "What is a transformer model?",
  "data": {
    "answer": "A transformer model is...",
    "key_points": ["Point 1", "Point 2"],
    "steps": ["Step 1", "Step 2"],
    "metadata": {
      "source": "Multi-Agent System",
      "confidence": 0.82
    }
  },
  "analysis": {
    "critic": "The answer is clear and well-structured...",
    "research_found": ["Insight 1", "Insight 2"]
  }
}
```

---

## How the Pipeline Works

```
1. RAG Check       — searches the FAISS vector store for relevant PDF context
2. Planner         — breaks the query into logical steps (max 5)
3. Researcher      — extracts key supporting facts and insights
4. Executor        — generates a structured answer using all context
5. Critic          — reviews and suggests improvements to the answer
6. Confidence      — scores the answer reliability from 0 to 1
```

If a PDF is indexed, the executor uses document context in its answer and the source badge shows `📄 rag`. Otherwise it shows `🤖 llm`.

---

## Using PDF / RAG

1. Click **Upload PDF (RAG)** in the UI
2. Select your PDF file
3. Click **Process PDF** — this chunks, embeds and stores it in FAISS
4. Ask questions related to the PDF — the pipeline will use it as context
5. Click **Remove PDF** to clear the index when done

> The PDF file itself is never stored permanently. Only the vector embeddings are saved to the `vectorstore/` folder.

---

## Deployment

For production deployment:

- **Frontend** → [Vercel](https://vercel.com) (free) — set root directory to `/frontend`
- **Backend** → [Railway](https://railway.app) (free tier) — set root directory to `/backend`
- **LLM** → Replace Ollama with [Groq](https://console.groq.com) (free) for cloud hosting

Update `frontend/src/utils/constants.js`:
```js
export const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
```

Add to Vercel environment variables:
```
VITE_API_URL = https://your-backend.up.railway.app
```

---

## Environment Variables

### Backend `.env`
```
GROQ_API_KEY=your_key_here     # only if using Groq instead of Ollama
```

### Frontend `.env.local`
```
VITE_API_URL=http://127.0.0.1:8000
```

---

## Requirements

```
fastapi
uvicorn
langchain
langchain-community
langchain-text-splitters
faiss-cpu
sentence-transformers
pypdf
requests
python-multipart
```

---

## License

MIT — feel free to use, modify and build on top of this.

---

## Author

Built with 🤖 and a lot of agent orchestration.
