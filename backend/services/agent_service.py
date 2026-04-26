# from agents.planner import planner_agent
# from agents.research import research_agent
# from agents.executor import executor_agent
# from agents.critic import critic_agent
# from agents.confidence import confidence_agent
# from services.rag_service import query_pdf

# def run_agents(query: str):
#     # 1. RAG Search
#     rag_res = query_pdf(query)
#     context = "\n".join(rag_res["context"]) if rag_res["found"] else "No specific document context found."

#     # 2. Planner
#     plan = planner_agent(query)
#     plan_steps = plan.get("steps", [])

#     # 3. Researcher (Pass the plan to the researcher)
#     research_query = f"Query: {query}. Plan: {plan_steps}"
#     research = research_agent(research_query)
#     insights = research.get("insights", [])

#     # 4. Executor (The big one - give it everything)
#     executor_input = f"""
#     USER QUESTION: {query}
#     PLAN TO FOLLOW: {plan_steps}
#     RESEARCH DATA: {insights}
#     DOCUMENT CONTEXT: {context}
#     """
#     solution_json = executor_agent(executor_input)

#     # 5. Critic & Confidence
#     review = critic_agent(str(solution_json))
#     conf = confidence_agent(str(solution_json))

#     # Construct the deep response for the frontend
#     return {
#         "status": "success",
#         "query": query,
#         "data": {
#             "answer": solution_json.get("solution", {}).get("summary", "Error generating summary"),
#             "key_points": solution_json.get("solution", {}).get("key_points", []),
#             "steps": solution_json.get("solution", {}).get("steps", plan_steps),
#             "metadata": {
#                 "source": "RAG + Multi-Agent" if rag_res["found"] else "Multi-Agent System",
#                 "confidence": conf.get("confidence", 0.5)
#             }
#         },
#         "analysis": {
#             "critic": review.get("raw", "Looks good."),
#             "research_found": insights
#         }
#     }

from agents.planner import planner_agent
from agents.research import research_agent
from agents.executor import executor_agent
from agents.critic import critic_agent
from agents.confidence import confidence_agent
from services.rag_service import query_pdf

def run_agents(query: str):
    # 1. RAG Search (Checks the in-memory variable now)
    rag_res = query_pdf(query)
    
    # Define source and context based on RAG success
    if rag_res["found"]:
        source_mode = "RAG + Multi-Agent"
        context_data = "\n".join(rag_res["context"])
        rag_instruction = f"MANDATORY: Base your answer on this document context: {context_data}"
    else:
        source_mode = "General LLM Knowledge"
        rag_instruction = "No document context is available. Answer using your general expertise."

    # 2. Planner (Identifies the roadmap)
    plan = planner_agent(query)
    plan_steps = plan.get("steps", [])

    # 3. Researcher (Passes the plan to gather insights)
    research_query = f"Query: {query}. Planned Steps: {plan_steps}"
    research = research_agent(research_query)
    insights = research.get("insights", [])

    # 4. Executor (The Master Synthesis Agent)
    # We provide a very structured block so the Executor knows what's what
    executor_input = f"""
    --- ROLE ---
    You are the lead executor of a multi-agent system.
    
    --- DATA SOURCES ---
    QUERY: {query}
    PLAN: {plan_steps}
    RESEARCH: {insights}
    CONTEXT: {rag_instruction}
    
    --- TASK ---
    Synthesize the above into a deep, concise, and professional response.
    """
    
    solution_json = executor_agent(executor_input)

    # 5. Critic & Confidence (Validation)
    # Passing the final solution to the critic for review
    review = critic_agent(str(solution_json))
    conf = confidence_agent(str(solution_json))

    # Extract the score safely
    raw_score = conf.get("confidence")
    # Validation: Ensure it's a float/int and between 0 and 1
    if isinstance(raw_score, (int, float)):
        confidence_score = float(raw_score)
    else:
        # If the agent failed, but RAG was found, set a default "high"
        # If RAG wasn't found, set a default "medium"
        confidence_score = 0.8 if rag_res["found"] else 0.6

    # 6. Build final structured response
    # We check if 'solution' key exists to avoid the 'Error generating summary' issue
    solution_data = solution_json.get("solution", {})
    
    return {
        "status": "success",
        "query": query,
        "data": {
            "answer": solution_data.get("summary", "I couldn't generate a detailed summary. Please try rephrasing."),
            "key_points": solution_data.get("key_points", []),
            "steps": solution_data.get("steps", plan_steps), # Use plan_steps as fallback
            "metadata": {
                "source": source_mode,
                # "confidence": conf.get("confidence", 0.5)
                "confidence": confidence_score
            }
        },
        "analysis": {
            "critic": review.get("raw", "Review complete."),
            "research_found": insights,
            "context_used": rag_res["found"]
        }
    }