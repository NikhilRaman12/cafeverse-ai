import unittest
from menu_data import CAFE_MENU, MENU_DICT
from ambience_data import get_waitwise_metrics, DEMO_ROOM_ZONES
from gemini_service import UserPreferences, deterministic_recommend

class TestCafeVerseLogic(unittest.TestCase):

    def test_menu_integrity(self):
        """Ensure menu has required valid items and INR prices."""
        self.assertGreaterEqual(len(CAFE_MENU), 8)
        for item in CAFE_MENU:
            self.assertTrue(item.id.startswith("CV-"))
            self.assertGreater(item.price, 0)
            self.assertIn(item.temperature, ["Iced", "Hot", "Room Temp"])

    def test_hero_scenario_budget_refreshing(self):
        """Test hero request: Refreshing drink under 250 INR, not too sweet."""
        prefs = UserPreferences(
            query="Something refreshing under 250, not too sweet",
            max_budget=250,
            temperature_pref="Iced"
        )
        res = deterministic_recommend(prefs)
        self.assertTrue(len(res.recommendations) > 0)
        # All recommended items must be under 250
        for rec in res.recommendations:
            self.assertLessEqual(rec.price, 250)
            self.assertIn(rec.item_id, MENU_DICT)

    def test_constraint_conflict_unachievable_budget(self):
        """Test budget under lowest price (e.g. 50 INR)."""
        prefs = UserPreferences(
            query="I want cold brew for 50",
            max_budget=50
        )
        res = deterministic_recommend(prefs)
        self.assertEqual(len(res.recommendations), 0)
        self.assertIsNotNone(res.suggested_alternative)
        self.assertFalse(res.suggested_alternative.is_budget_fit)

    def test_waitwise_deterministic_calculation(self):
        """Verify queue time scales with items."""
        empty_cart_wait = get_waitwise_metrics([])
        multi_item_wait = get_waitwise_metrics(["CV-BEV-001", "CV-SAV-001", "CV-BEV-004"])
        self.assertGreater(multi_item_wait.estimated_wait_minutes, empty_cart_wait.estimated_wait_minutes)

if __name__ == "__main__":
    unittest.main()
