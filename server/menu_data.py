"""
CaféVerse Menu & Domain Models
Authoritatively owned by the backend.
Prices in INR (₹). Dietary tags, flavor profiles, and deterministic rules.
"""

from typing import List, Optional
from pydantic import BaseModel, Field

class MenuItem(BaseModel):
    id: str
    name: str
    category: str  # "Cold Beverages", "Hot Brews", "Artisanal Bakes", "Savory Plates"
    price: int  # in INR ₹
    description: str
    temperature: str  # "Iced", "Hot", "Room Temp"
    sweetness: str  # "Unsweetened", "Mild", "Medium", "Sweet", "N/A"
    flavor_profile: List[str]
    dietary: List[str]  # "Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free", "Keto-Friendly"
    caffeine_level: str  # "None", "Low", "Medium", "High"
    prep_time_minutes: int
    is_available: bool = True
    tagline: str

CAFE_MENU: List[MenuItem] = [
    MenuItem(
        id="CV-BEV-001",
        name="Cascara Sparkling Cold Brew",
        category="Cold Beverages",
        price=220,
        description="Single-origin Ethiopian cold brew infused with sparkling mineral water, sun-dried coffee cherry cascara, and fresh orange peel zest.",
        temperature="Iced",
        sweetness="Mild",
        flavor_profile=["Citrusy", "Refreshing", "Crisp", "Subtle Tartness"],
        dietary=["Vegan", "Gluten-Free", "Dairy-Free"],
        caffeine_level="High",
        prep_time_minutes=3,
        tagline="Crisp, bright, zero heavy syrup."
    ),
    MenuItem(
        id="CV-BEV-002",
        name="Wild Mint & Cucumber Nitro Refresher",
        category="Cold Beverages",
        price=190,
        description="Cold-steeped Japanese green tea with crushed garden mint, muddled cucumber ribbons, Himalayan pink salt, and micro-nitrogen bubbles.",
        temperature="Iced",
        sweetness="Unsweetened",
        flavor_profile=["Refreshing", "Botanical", "Cooling", "Earthy"],
        dietary=["Vegan", "Gluten-Free", "Dairy-Free", "Keto-Friendly"],
        caffeine_level="Low",
        prep_time_minutes=2,
        tagline="100% sugar-free hydration with deep mint crispness."
    ),
    MenuItem(
        id="CV-BEV-003",
        name="Madagascar Vanilla Bean Shakerato",
        category="Cold Beverages",
        price=240,
        description="Double shot of Chikmagalur espresso aerated over crystal clear ice with real Madagascar vanilla pod nectar and a touch of oat milk froth.",
        temperature="Iced",
        sweetness="Mild",
        flavor_profile=["Velvety", "Balanced", "Aromatic", "Toasted Nut"],
        dietary=["Vegan", "Gluten-Free", "Dairy-Free"],
        caffeine_level="High",
        prep_time_minutes=4,
        tagline="Smooth Italian-style shaken iced coffee without overwhelming sweetness."
    ),
    MenuItem(
        id="CV-BEV-004",
        name="Valrhona Salted Dark Chocolate Mocha",
        category="Hot Brews",
        price=260,
        description="70% single-estate dark cacao melted into steamed whole milk and double espresso, crowned with sea salt flakes.",
        temperature="Hot",
        sweetness="Medium",
        flavor_profile=["Rich", "Decadent", "Bittersweet", "Cocoa"],
        dietary=["Vegetarian", "Gluten-Free"],
        caffeine_level="Medium",
        prep_time_minutes=4,
        tagline="Comforting artisanal indulgence with dark cocoa balance."
    ),
    MenuItem(
        id="CV-BEV-005",
        name="Coorg Honey Cinnamon Cortado",
        category="Hot Brews",
        price=180,
        description="1:1 ratio of intense espresso and textured micro-foam, sweetened with raw wild Coorg honey and freshly grated Ceylon cinnamon.",
        temperature="Hot",
        sweetness="Mild",
        flavor_profile=["Warm Spice", "Nutty", "Floral Honey", "Bold"],
        dietary=["Vegetarian", "Gluten-Free"],
        caffeine_level="High",
        prep_time_minutes=3,
        tagline="Short, robust, lightly aromatic coffee."
    ),
    MenuItem(
        id="CV-BEV-006",
        name="Ceremonial Uji Matcha Oat Latte",
        category="Hot Brews",
        price=250,
        description="Stone-ground ceremonial grade Japanese matcha whisked with warm minor-figures oat milk. Clean sustained focus without caffeine crash.",
        temperature="Hot",
        sweetness="Unsweetened",
        flavor_profile=["Umami", "Creamy", "Grassy", "Zen"],
        dietary=["Vegan", "Dairy-Free", "Gluten-Free"],
        caffeine_level="Medium",
        prep_time_minutes=3,
        tagline="Pure ceremonial matcha with creamy plant milk."
    ),
    MenuItem(
        id="CV-BAKE-001",
        name="Cardamom Pistachio Morning Bun",
        category="Artisanal Bakes",
        price=175,
        description="Laminated flaky sourdough pastry swirled with crushed green cardamom, roasted Iranian pistachios, and caramelised demerara sugar crust.",
        temperature="Room Temp",
        sweetness="Medium",
        flavor_profile=["Flaky", "Aromatic", "Nutty", "Buttery"],
        dietary=["Vegetarian"],
        caffeine_level="None",
        prep_time_minutes=1,
        tagline="Golden layers with subtle crushed cardamom warmth."
    ),
    MenuItem(
        id="CV-BAKE-002",
        name="Almond Flour Dark Berry Tart",
        category="Artisanal Bakes",
        price=210,
        description="Crust made from roasted almonds and flaxseeds, topped with unsweetened blackberry compote and chia seed reduction.",
        temperature="Room Temp",
        sweetness="Mild",
        flavor_profile=["Nutty", "Tart", "Rich", "Berry"],
        dietary=["Vegetarian", "Gluten-Free", "Keto-Friendly"],
        caffeine_level="None",
        prep_time_minutes=1,
        tagline="Gluten-free nutrient-dense fruit tart."
    ),
    MenuItem(
        id="CV-SAV-001",
        name="Smoked Sourdough Avocado Tartine",
        category="Savory Plates",
        price=275,
        description="Naturally leavened country sourdough topped with Hass avocado mash, toasted pepitas, Danish feta, chili crunch, and micro-cilantro.",
        temperature="Room Temp",
        sweetness="N/A",
        flavor_profile=["Savory", "Creamy", "Zesty", "Crunchy"],
        dietary=["Vegetarian"],
        caffeine_level="None",
        prep_time_minutes=5,
        tagline="Wholesome artisan lunch plate."
    ),
    MenuItem(
        id="CV-SAV-002",
        name="Za'atar Roasted Mushroom Toastie",
        category="Savory Plates",
        price=245,
        description="Wild portobello and oyster mushrooms pan-seared in Palestinian za'atar olive oil, nestled between seeded rye bread with aged gouda.",
        temperature="Hot",
        sweetness="N/A",
        flavor_profile=["Earthy", "Herbal", "Umami", "Melted Cheese"],
        dietary=["Vegetarian"],
        caffeine_level="None",
        prep_time_minutes=6,
        tagline="Warm pressed savory toastie packed with umami."
    )
]

MENU_DICT = {item.id: item for item in CAFE_MENU}
