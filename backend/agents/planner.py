from core.llm import call_llm

def planner_agent(query, client=None):
    prompt = f"""
You are a planning agent.

Break the problem into logical steps.

Return STRICT JSON:

{{
  "steps": [
    "Step 1",
    "Step 2",
    "Step 3"
  ]
}}

Rules:
- Keep steps simple
- No explanations
- No markdown
- Max 5 steps

Problem:
{query}
"""
    return call_llm(prompt)