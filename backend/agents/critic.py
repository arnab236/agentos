
from core.llm import call_llm

def critic_agent(solution, client=None):
    prompt = f"""
    You are a critic agent.
    Improve and review:

    {solution}
    """
    return call_llm(prompt)