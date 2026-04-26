from core.llm import call_llm

def confidence_agent(solution):
    prompt = f"""
    Analyze the following AI solution for accuracy and relevance.
    Provide a confidence score between 0.0 and 1.0.
    
    0.1 = Hallucination/No info
    0.5 = General knowledge
    0.9 = Verified by provided document context
    
    Return ONLY JSON:
    {{
      "confidence": 0.0
    }}
    
    Solution to evaluate: {solution}
    """
    return call_llm(prompt)