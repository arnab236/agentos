# from fastapi import FastAPI, UploadFile, File, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from models.query_model import Query
# from services.agent_service import run_agents
# from services.rag_service import process_pdf
# import shutil
# import os

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"], # Adjust for your frontend URL
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # -------- Health Check --------
# @app.get("/")
# def home():
#     return {"message": "AI Multi-Agent System Running 🚀"}

# # -------- Solve Endpoint --------
# @app.post("/solve")
# def solve(query: Query):
#     return run_agents(query.question)


# # -------- Upload PDF --------
# @app.post("/upload")
# def upload_pdf(file: UploadFile = File(...)):
#     temp_path = f"temp_{file.filename}"
#     with open(temp_path, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)
    
#     msg = process_pdf(temp_path)
#     os.remove(temp_path)
#     return {"message": msg}

# # -------- Remove PDF Index --------
# @app.delete("/remove-pdf")
# def remove_pdf():
#     try:
#         if os.path.exists("vectorstore"):
#             shutil.rmtree("vectorstore")
#             return {"message": "PDF index removed successfully."}
#         return {"message": "No PDF index found."}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# main.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.query_model import Query
from services.agent_service import run_agents
from services.rag_service import process_pdf, query_pdf
import shutil
import os
import tempfile

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AI Multi-Agent System Running 🚀"}

@app.post("/solve")
def solve(query: Query):
    return run_agents(query.question)

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        # Use a proper temp file that auto-deletes
        with tempfile.NamedTemporaryFile(delete=True, suffix=".pdf") as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp.flush()
            msg = process_pdf(tmp.name)
        return {"message": msg}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/remove-pdf")
def remove_pdf():
    try:
        if os.path.exists("vectorstore"):
            shutil.rmtree("vectorstore")
            return {"message": "PDF index removed successfully."}
        return {"message": "No PDF index found."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))