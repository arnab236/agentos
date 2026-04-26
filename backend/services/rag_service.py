# # from langchain_community.document_loaders import PyPDFLoader
# # # from langchain.text_splitter import CharacterTextSplitter
# # # from langchain_text_splitter import RecursiveCharacterTextSplitter
# # from langchain_text_splitters import RecursiveCharacterTextSplitter
# # from langchain_community.vectorstores import FAISS
# # from langchain_community.embeddings import HuggingFaceEmbeddings

# # DB_PATH = "vectorstore"

# # def process_pdf(file_path):
# #     loader = PyPDFLoader(file_path)
# #     docs = loader.load()

# #     splitter = RecursiveCharacterTextSplitter(
# #         chunk_size=500,
# #         chunk_overlap=100
# #     )

# #     chunks = splitter.split_documents(docs)

# #     embeddings = HuggingFaceEmbeddings()

# #     db = FAISS.from_documents(chunks, embeddings)
# #     db.save_local(DB_PATH)

# #     return "PDF processed successfully"


# # def query_pdf(query: str):
# #     try:
# #         # your retrieval logic here

# #         results = []  # ← whatever you fetch

# #         if results and len(results) > 0:
# #             return {
# #                 "found": True,
# #                 "context": results
# #             }

# #         return {
# #             "found": False,
# #             "context": []
# #         }

# #     except Exception:
# #         return {
# #             "found": False,
# #             "context": []
# #         }


# from langchain_community.document_loaders import PyPDFLoader
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# from langchain_community.vectorstores import FAISS
# from langchain_community.embeddings import HuggingFaceEmbeddings
# import os

# DB_PATH = "vectorstore"

# def process_pdf(file_path):
#     loader = PyPDFLoader(file_path)
#     docs = loader.load()
#     splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
#     chunks = splitter.split_documents(docs)
#     embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
#     db = FAISS.from_documents(chunks, embeddings)
#     db.save_local(DB_PATH)
#     return "PDF knowledge indexed successfully."

# def query_pdf(query: str):
#     if not os.path.exists(DB_PATH):
#         return {"found": False, "context": []}
#     try:
#         embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
#         db = FAISS.load_local(DB_PATH, embeddings, allow_dangerous_deserialization=True)
#         docs = db.similarity_search(query, k=4)
#         return {
#             "found": True,
#             "context": [doc.page_content for doc in docs]
#         }
#     except Exception as e:
#         print(f"RAG Error: {e}")
#         return {"found": False, "context": []}

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
import os

# This variable stays in RAM as long as the server is running
current_vector_db = None

def process_pdf(file_path):
    global current_vector_db
    try:
        loader = PyPDFLoader(file_path)
        docs = loader.load()
        splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
        chunks = splitter.split_documents(docs)
        
        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        
        # We create the DB in memory only, NO save_local()
        current_vector_db = FAISS.from_documents(chunks, embeddings)
        
        return "PDF loaded into temporary memory."
    except Exception as e:
        return f"Error: {str(e)}"

def query_pdf(query: str):
    global current_vector_db
    # Check if a file is currently "active" in memory
    if current_vector_db is None:
        return {"found": False, "context": []}
        
    try:
        # Search the in-memory database
        docs_with_scores = current_vector_db.similarity_search_with_score(query, k=3)
        
        # Only return if context is actually relevant (score threshold)
        relevant_docs = [doc.page_content for doc, score in docs_with_scores if score < 1.1]
        
        if not relevant_docs:
            return {"found": False, "context": []}

        return {"found": True, "context": relevant_docs}
    except Exception:
        return {"found": False, "context": []}

def clear_memory():
    global current_vector_db
    current_vector_db = None
    return "Memory cleared."