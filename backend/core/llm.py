import requests
import json
import re

def call_llm(prompt):
    try:
        response = requests.post(
            "http://127.0.0.1:11434/api/generate",
            json={
                "model": "gemma2:2b",
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.1} # Lower temperature = more stable JSON
            },
            timeout=60
        )
        text = response.json()["response"]
        
        # 1. Try to find JSON block using Regex
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            json_str = match.group()
            return json.loads(json_str)
        
        # 2. If no JSON found, return the raw text in a structured format
        return {"solution": {"summary": text, "key_points": [], "steps": []}}
        
    except Exception as e:
        return {"solution": {"summary": f"Error: {str(e)}", "key_points": [], "steps": []}}