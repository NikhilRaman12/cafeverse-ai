"""
Gemini Fast Customer Experience & Problem Root Cause Analyzer
Interprets customer feedback, classifies problem category, extracts sentiment,
and derives actionable operational fixes for café managers.
"""

import os
import json
import logging
from typing import Dict, Any

logger = logging.getLogger("cafeverse.experience_analyzer")

CATEGORIES = [
    "Ordering Bottleneck & Menu Anxiety",
    "Ghost Table Crowding Dilemma",
    "Consistency Drop & Product Unavailability",
    "Acoustic Chaos & Invisible Friction",
    "Sensory Success & Delight"
]

def analyze_experience_with_gemini(feedback_text: str, rating: int, zone: str) -> Dict[str, Any]:
    """
    Invokes Gemini 2.5 Flash to rapidly analyze customer experience,
    identify the exact root problem, and prescribe an operational countermeasure.
    """
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    
    # Deterministic heuristics for instant fallback
    text_lower = feedback_text.lower()
    cat = "Sensory Success & Delight" if rating >= 4 else "Ordering Bottleneck & Menu Anxiety"
    sentiment = "Positive" if rating >= 4 else "Constructive"
    root_cause = "General service feedback."
    fix = "Continue standard operational quality checks."

    if any(w in text_lower for w in ["noise", "loud", "call", "speaker", "sound", "music"]):
        cat = "Acoustic Chaos & Invisible Friction"
        sentiment = "Frustrated"
        root_cause = f"Noise disturbance observed in {zone}."
        fix = "Adjust zone speaker levels and prompt patrons with lo-fi etiquette."
    elif any(w in text_lower for w in ["table", "seat", "crowd", "bag", "laptop", "space"]):
        cat = "Ghost Table Crowding Dilemma"
        sentiment = "Annoyed"
        root_cause = "Table hoarding or space misallocation reducing patron turnover."
        fix = "Deploy RoomSense seating host and encourage shared communal seating."
    elif any(w in text_lower for w in ["wait", "delay", "slow", "queue", "late", "time"]):
        cat = "Ordering Bottleneck & Menu Anxiety"
        sentiment = "Impatient"
        root_cause = "Queue bottleneck at prep bar."
        fix = "Trigger WaitWise fast-batching on cold taps to clear ticket backlog."

    if api_key:
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            prompt = f"""
Customer Review in Café:
"{feedback_text}"
Rating: {rating}/5
Zone: {zone}

Analyze and classify this feedback into one of these 4 real-world café problems:
1. "Ordering Bottleneck & Menu Anxiety"
2. "Ghost Table Crowding Dilemma"
3. "Consistency Drop & Product Unavailability"
4. "Acoustic Chaos & Invisible Friction"
(or "Sensory Success & Delight" if positive)

Return JSON:
{{
  "sentiment": "Frustrated / Satisfied / Impatient / Delighted",
  "problem_category": "Exact category string from above",
  "root_cause": "Concise 1-sentence root cause",
  "suggested_operational_fix": "1 actionable instruction for the barista or manager"
}}
"""
            res = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config={'response_mime_type': 'application/json'}
            )
            data = json.loads(res.text)
            return {
                "sentiment": data.get("sentiment", sentiment),
                "problem_category": data.get("problem_category", cat),
                "root_cause": data.get("root_cause", root_cause),
                "suggested_operational_fix": data.get("suggested_operational_fix", fix),
                "source": "Gemini 2.5 Flash Root-Cause Analyzer"
            }
        except Exception as e:
            logger.warning(f"Gemini experience analyzer fallback: {e}")

    return {
        "sentiment": sentiment,
        "problem_category": cat,
        "root_cause": root_cause,
        "suggested_operational_fix": fix,
        "source": "Deterministic Experience Classifier"
    }
