from core.llm import call_llm

def executor_agent(input_text):
    prompt = f"""You are a Strategic Expert. 
    Synthesize a solution in STRICT JSON.
    
    CRITICAL RULE: The "summary" value must be a single continuous string. 
    Do NOT use unescaped double quotes inside the text.

    Task: Write a detailed guide based on the input.
    
    REQUIRED JSON FORMAT (DO NOT DEVIATE):
    {{
      "solution": {{
        "summary": "Write 4-6 sentences here about the topic.",
        "key_points": ["Point A", "Point B", "Point C"],
        "steps": ["Step 1", "Step 2"]
      }}
    }}

    INPUT DATA:
    {input_text}
    """
    return call_llm(prompt)