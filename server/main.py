"""
CaféVerse Unified Backend Application with Cloud SQL Storage & Root-Cause Intelligence:
- Cloud SQL / SQLite Database Integration via SQLAlchemy
- Stores Customer Feedback, Order Transactions, and Problem Events
- Fast Gemini Problem Extraction & Operational Countermeasure Prescription
- Serves Vite Frontend SPA
"""

import os
import time
import json
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from menu_data import CAFE_MENU, MENU_DICT, MenuItem
from ambience_data import get_waitwise_metrics, DEMO_ROOM_ZONES, DEMO_CONNECT_SPARKS
from gemini_service import UserPreferences, RecommendationResponse, query_gemini_intelligence
from vision_service import analyze_vibe_photo
from db import SessionLocal, CustomerExperience, StoredOrder
from experience_analyzer import analyze_experience_with_gemini

app = FastAPI(
    title="CaféVerse Enterprise Engine — Cloud SQL + Gemini",
    description="Solving 4 Core Real-World Café Dilemmas + Gemini Vision + Cloud SQL",
    version="2.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -----------------
# Request / Response Models
# -----------------
class CartItemInput(BaseModel):
    item_id: str
    quantity: int = 1
    customization: Optional[str] = "Standard"

class OrderRequest(BaseModel):
    customer_name: Optional[str] = "Patron"
    items: List[CartItemInput]
    zone_preference: Optional[str] = "The Mezzanine Loft"

class VisionRequest(BaseModel):
    photo_description: Optional[str] = None
    photo_b64: Optional[str] = None

class FeedbackSubmission(BaseModel):
    customer_name: Optional[str] = "Anonymous Patron"
    selected_zone: Optional[str] = "The Mezzanine Loft"
    feedback_text: str
    rating: int = 5

# -----------------
# API Endpoints
# -----------------

@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    has_gemini = bool(os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY"))
    exp_count = db.query(CustomerExperience).count()
    return {
        "status": "healthy",
        "service": "CafeVerse-Gemini-CloudSQL",
        "gemini_api_configured": has_gemini,
        "database": "Cloud SQL / SQLAlchemy Active",
        "stored_experiences_count": exp_count,
        "mode": "Active Production"
    }

@app.get("/api/menu")
def get_menu():
    return CAFE_MENU

@app.post("/api/smartorder/recommend", response_model=RecommendationResponse)
def get_smart_recommendations(prefs: UserPreferences):
    return query_gemini_intelligence(prefs)

@app.get("/api/waitwise")
def get_wait_insights(items: Optional[str] = None):
    item_ids = items.split(",") if items else []
    return get_waitwise_metrics(item_ids)

@app.get("/api/roomsense")
def get_roomsense_data():
    return DEMO_ROOM_ZONES

@app.get("/api/cafeconnect")
def get_cafe_connect_sparks():
    return DEMO_CONNECT_SPARKS

@app.post("/api/vibe/analyze")
def analyze_vibe(req: VisionRequest):
    return analyze_vibe_photo(req.photo_b64, req.photo_description)

# -----------------
# Cloud SQL Experience Logging & Problem Analytics
# -----------------

@app.get("/api/experiences")
def get_all_experiences(db: Session = Depends(get_db)):
    """Retrieves stored experiences from Cloud SQL."""
    records = db.query(CustomerExperience).order_by(CustomerExperience.id.desc()).all()
    return [
        {
            "id": r.id,
            "customer_name": r.customer_name,
            "selected_zone": r.selected_zone,
            "feedback_text": r.feedback_text,
            "rating": r.rating,
            "extracted_sentiment": r.extracted_sentiment,
            "identified_problem_category": r.identified_problem_category,
            "gemini_root_cause": r.gemini_root_cause,
            "suggested_operational_fix": r.suggested_operational_fix,
            "created_at": r.created_at.strftime("%I:%M %p") if r.created_at else "Just now"
        }
        for r in records
    ]

@app.post("/api/experiences/submit")
def submit_and_analyze_experience(feedback: FeedbackSubmission, db: Session = Depends(get_db)):
    """
    1. Runs Gemini Root-Cause problem analyzer on the customer feedback.
    2. Persists the customer record into Cloud SQL.
    3. Returns immediate operational insights.
    """
    if not feedback.feedback_text.strip():
        raise HTTPException(status_code=400, detail="Feedback cannot be empty.")

    # Rapid Gemini Problem Analysis
    ai_analysis = analyze_experience_with_gemini(
        feedback_text=feedback.feedback_text,
        rating=feedback.rating,
        zone=feedback.selected_zone or "The Mezzanine Loft"
    )

    # Insert into Cloud SQL
    new_record = CustomerExperience(
        customer_name=feedback.customer_name or "Anonymous Patron",
        selected_zone=feedback.selected_zone or "The Mezzanine Loft",
        feedback_text=feedback.feedback_text,
        rating=feedback.rating,
        extracted_sentiment=ai_analysis["sentiment"],
        identified_problem_category=ai_analysis["problem_category"],
        gemini_root_cause=ai_analysis["root_cause"],
        suggested_operational_fix=ai_analysis["suggested_operational_fix"]
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    return {
        "status": "success",
        "experience_id": new_record.id,
        "ai_analysis": ai_analysis
    }

@app.post("/api/order/create")
def create_demo_order(payload: OrderRequest, db: Session = Depends(get_db)):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart cannot be empty.")

    subtotal = 0
    breakdown = []
    item_ids = []

    for cart_item in payload.items:
        if cart_item.item_id not in MENU_DICT:
            raise HTTPException(status_code=400, detail=f"Invalid item ID: {cart_item.item_id}")
        
        menu_item = MENU_DICT[cart_item.item_id]
        line_total = menu_item.price * cart_item.quantity
        subtotal += line_total
        item_ids.append(menu_item.id)

        breakdown.append({
            "item_id": menu_item.id,
            "name": menu_item.name,
            "unit_price": menu_item.price,
            "quantity": cart_item.quantity,
            "line_total": line_total,
            "customization": cart_item.customization
        })

    gst = int(subtotal * 0.05)
    total = subtotal + gst
    wait_info = get_waitwise_metrics(item_ids)
    order_id = f"CV-{int(time.time() % 100000):05d}"

    # Store order in Cloud SQL
    stored_ord = StoredOrder(
        order_id=order_id,
        customer_name=payload.customer_name or "Patron",
        items_json=json.dumps(breakdown),
        subtotal_inr=subtotal,
        gst_inr=gst,
        total_inr=total,
        selected_zone=payload.zone_preference or "The Mezzanine Loft",
        estimated_wait_mins=wait_info.estimated_wait_minutes
    )
    db.add(stored_ord)
    db.commit()

    return {
        "order_id": order_id,
        "items_breakdown": breakdown,
        "subtotal_inr": subtotal,
        "gst_inr": gst,
        "total_inr": total,
        "estimated_pickup_mins": wait_info.estimated_wait_minutes,
        "waitwise_confidence": wait_info.confidence_interval,
        "selected_zone": payload.zone_preference or "The Mezzanine Loft",
        "timestamp": time.strftime("%I:%M %p"),
        "demo_notice": "Order securely logged to Cloud SQL and queued in Barista KDS."
    }

# Mount Vite frontend assets
DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dist")
if os.path.exists(DIST_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(DIST_DIR, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        file_path = os.path.join(DIST_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(DIST_DIR, "index.html"))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
