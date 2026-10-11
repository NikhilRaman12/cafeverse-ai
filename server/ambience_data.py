"""
CaféVerse WaitWise, RoomSense, and CaféConnect Bundled Synthetic Datasets
Deterministically computed, explicitly labeled as illustrative demo data.
"""

from typing import List, Dict, Any
from pydantic import BaseModel

class WaitWiseEstimate(BaseModel):
    queue_length: int
    active_baristas: int
    prep_bottleneck_station: str  # "Espresso Bar", "Bake Finishing", "Pour-Over"
    estimated_wait_minutes: int
    confidence_interval: str  # "e.g. 6 - 9 mins"
    crowd_density: str  # "Moderate (62% Capacity)"
    disclaimer: str = "Illustrative sample queue estimation. Not an authoritative guarantee."

class RoomSenseZone(BaseModel):
    zone_name: str
    vibe_match: str  # "Deep Work & Focus", "Casual Social", "Outdoor Patio", "Reading Corner"
    sound_level_db: int
    sound_vibe: str  # "Lo-Fi Acoustic (Gentle 46 dB)", "Bustling Conversational (68 dB)"
    power_outlets_available: str
    current_capacity_pct: int
    recommended_duration: str
    suitable_for: List[str]

class CafeConnectTopic(BaseModel):
    topic_id: str
    spark_title: str
    description: str
    category: str
    suggested_starter: str
    privacy_notice: str = "100% Opt-in. No real names, no tracking, anonymous table spark only."

def get_waitwise_metrics(order_item_ids: List[str] = None) -> WaitWiseEstimate:
    """
    Deterministic Wait Time Formulation:
    Base queue wait (8 mins) + per-item complexity (2 min cold, 3 min espresso/food)
    Adjusted by 3 active baristas on shift.
    """
    base_queue = 5
    additional_prep = 0
    if order_item_ids:
        # Each item adds 1-2 mins to queue
        additional_prep = min(len(order_item_ids) * 2, 8)
    
    total_est = base_queue + additional_prep
    return WaitWiseEstimate(
        queue_length=4,
        active_baristas=3,
        prep_bottleneck_station="Espresso Bar (Cold Brew on Tap is Instant)",
        estimated_wait_minutes=total_est,
        confidence_interval=f"{max(total_est - 2, 2)} - {total_est + 3} mins",
        crowd_density="Pleasantly Lively (58% Seated Capacity)",
        disclaimer="Estimates calculated deterministically from active ticket batches & barista capacity. Illustrative demo data."
    )

DEMO_ROOM_ZONES: List[RoomSenseZone] = [
    RoomSenseZone(
        zone_name="The Mezzanine Loft",
        vibe_match="Deep Work & Focus",
        sound_level_db=44,
        sound_vibe="Whisper quiet • Gentle lo-fi jazz (44 dB)",
        power_outlets_available="High (Outlets at every seat)",
        current_capacity_pct=45,
        recommended_duration="60 - 120 mins",
        suitable_for=["Deep coding", "Document reading", "Solo writing"]
    ),
    RoomSenseZone(
        zone_name="Garden Atrium & Sunlit Courtyard",
        vibe_match="Unwind & Refresh",
        sound_level_db=54,
        sound_vibe="Natural water fountain & bird rustle (54 dB)",
        power_outlets_available="Moderate (Patio perimeter)",
        current_capacity_pct=60,
        recommended_duration="30 - 45 mins",
        suitable_for=["Mindful breaks", "Casual reading", "Cool drink sipping"]
    ),
    RoomSenseZone(
        zone_name="Central Communal Oak Table",
        vibe_match="Creative Sparks & Discussion",
        sound_level_db=66,
        sound_vibe="Energetic café buzz & warm chatter (66 dB)",
        power_outlets_available="Abundant (Built-in center strip)",
        current_capacity_pct=75,
        recommended_duration="45 - 90 mins",
        suitable_for=["Pair brainstorms", "Founder chats", "CaféConnect sparks"]
    )
]

DEMO_CONNECT_SPARKS: List[CafeConnectTopic] = [
    CafeConnectTopic(
        topic_id="SPARK-01",
        spark_title="AI Agent Tooling & Real-world Latency",
        description="Discussing multi-agent patterns, local small language models vs cloud reasoning.",
        category="Tech & Builders",
        suggested_starter="Are you experimenting with on-device models or cloud API streaming for low-latency tasks?"
    ),
    CafeConnectTopic(
        topic_id="SPARK-02",
        spark_title="Indie Design Systems & Micro-Interactions",
        description="Crafting bespoke web typography and subtle fluid tactile interfaces.",
        category="Design & Aesthetics",
        suggested_starter="What's your favorite tiny micro-interaction in modern web apps that delight you?"
    ),
    CafeConnectTopic(
        topic_id="SPARK-03",
        spark_title="Specialty Coffee Roasts & Fermentations",
        description="Anaerobic naturals vs washed process Ethiopian varietals.",
        category="Coffee Geeks",
        suggested_starter="What was the most surprising tasting note you've ever found in an anaerobic pour-over?"
    )
]
