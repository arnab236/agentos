from core.llm import call_llm

def research_agent(query, client=None):
    prompt = f"""
You are a research assistant.

Extract important supporting knowledge for the query.

Return STRICT JSON:

{{
  "insights": [
    "Insight 1",
    "Insight 2",
    "Insight 3"
  ]
}}

Rules:
- Focus on useful facts
- No explanations
- No markdown

Query:
{query}
"""
    return call_llm(prompt)