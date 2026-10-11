"""
CaféVerse Cloud SQL & SQLAlchemy Database Layer
- Cloud SQL PostgreSQL / SQLite universal compatibility
- Customer experience logs, order histories, table load events
- Gemini-powered quick sentiment & root cause problem analysis
"""

import os
import json
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Float
from sqlalchemy.orm import declarative_base, sessionmaker

logger = logging.getLogger("cafeverse.db")

# Read Cloud SQL PostgreSQL connection string or fallback to high-speed persistent SQLite
DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    os.environ.get(
        "CLOUD_SQL_URL",
        "sqlite:///cafeverse_experience.db"
    )
)

# SQLite multi-thread safety args
engine_args = {}
if "sqlite" in DATABASE_URL:
    engine_args["connect_args"] = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, **engine_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class CustomerExperience(Base):
    """Stores customer feedback, vibe review, and real-world friction reports."""
    __tablename__ = "customer_experiences"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_name = Column(String(100), default="Patron")
    selected_zone = Column(String(100), default="The Mezzanine Loft")
    feedback_text = Column(Text, nullable=False)
    rating = Column(Integer, default=5)
    
    # Gemini Extracted Analytics
    extracted_sentiment = Column(String(50), default="Neutral")
    identified_problem_category = Column(String(100), default="General") 
    # e.g. "Ordering Bottleneck", "Ghost Table Crowding", "Prep Inconsistency", "Acoustic Chaos"
    gemini_root_cause = Column(Text, nullable=True)
    suggested_operational_fix = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

class StoredOrder(Base):
    """Stores customer order transactions with deterministic financials."""
    __tablename__ = "stored_orders"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_id = Column(String(50), unique=True, index=True)
    customer_name = Column(String(100), default="Patron")
    items_json = Column(Text, nullable=False)
    subtotal_inr = Column(Integer, nullable=False)
    gst_inr = Column(Integer, nullable=False)
    total_inr = Column(Integer, nullable=False)
    selected_zone = Column(String(100), default="The Mezzanine Loft")
    estimated_wait_mins = Column(Integer, default=5)
    created_at = Column(DateTime, default=datetime.utcnow)

# Initialize tables
Base.metadata.create_all(bind=engine)

def seed_sample_experiences():
    """Seeds realistic café feedback for immediate analytics demonstration."""
    db = SessionLocal()
    try:
        count = db.query(CustomerExperience).count()
        if count == 0:
            sample_records = [
                CustomerExperience(
                    customer_name="Aarav S.",
                    selected_zone="The Mezzanine Loft",
                    feedback_text="Wanted to attend a quick Zoom call, but someone was watching videos loudly on speaker without headphones.",
                    rating=2,
                    extracted_sentiment="Frustrated",
                    identified_problem_category="Acoustic Chaos & Invisible Friction",
                    gemini_root_cause="Noise etiquette violation in designated 44 dB quiet focus micro-zone.",
                    suggested_operational_fix="Issue subtle lo-fi reminder notification & provide acoustic screen buffers."
                ),
                CustomerExperience(
                    customer_name="Priya M.",
                    selected_zone="Central Communal Oak Table",
                    feedback_text="A single person had their laptop and gym bag occupying a 6-person shared bench for 3 hours while others were searching for seats.",
                    rating=2,
                    extracted_sentiment="Disappointed",
                    identified_problem_category="Ghost Table Crowding Dilemma",
                    gemini_root_cause="Unmonitored ghost table hogging during peak afternoon hours.",
                    suggested_operational_fix="Enable RoomSense table-sharing prompts and recommend patio seats."
                ),
                CustomerExperience(
                    customer_name="Devika R.",
                    selected_zone="Garden Atrium",
                    feedback_text="Cascara sparkling brew was divine! Exactly the crisp, low-sugar drink I needed while finishing my book.",
                    rating=5,
                    extracted_sentiment="Delighted",
                    identified_problem_category="Sensory Success",
                    gemini_root_cause="Successful Gemini SmartOrder recommendation matching taste constraints.",
                    suggested_operational_fix="Feature Cascara brew as sunny morning recommendation."
                ),
                CustomerExperience(
                    customer_name="Karan V.",
                    selected_zone="The Mezzanine Loft",
                    feedback_text="My flat white took 18 minutes because the counter was slammed with complicated blender smoothies.",
                    rating=3,
                    extracted_sentiment="Impatient",
                    identified_problem_category="Ordering Bottleneck & Prep Inconsistency",
                    gemini_root_cause="Unbatched blending orders stalling dedicated espresso stream.",
                    suggested_operational_fix="Implement WaitWise queue segregation: express espresso vs blender station."
                )
            ]
            db.add_all(sample_records)
            db.commit()
    finally:
        db.close()

seed_sample_experiences()
