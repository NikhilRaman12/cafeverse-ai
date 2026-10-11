# CaféVerse — Intelligent Café Experience Powered by Gemini
> **Google Cloud Builder Pop-Up Hyderabad**  
> **Tagline:** *Your café. Your universe. Your moment.*

---

## 🎯 The 4 Core Real-World Café Problems Solved

1. **Ordering Bottlenecks & Menu Anxiety:**
   * **Problem:** Patrons stare at complex 40-item menus causing queue stalls and hesitation.
   * **Solution:** **SmartOrder™** uses Google Gemini to translate natural conversational intent (*"Something refreshing under ₹250, not too sweet"*) into strictly grounded, valid menu picks with sensory rationales.
2. **Ghost Table Crowding Dilemma:**
   * **Problem:** Solitary patrons placing a backpack on 4-top tables while new guests leave thinking there are no seats.
   * **Solution:** **RoomSense™ Dynamic Micro-Zone Load Balancer** with live capacity % across the Mezzanine, Garden Atrium, and Communal Tables.
3. **Consistency Drops & Wait Anxiety:**
   * **Problem:** Vague countdown timers that leave patrons standing awkwardly at the counter.
   * **Solution:** **WaitWise™ Deterministic Queue Engine** calculating realistic prep windows based on beverage categories and active barista staffing.
4. **Acoustic Chaos & Invisible Friction:**
   * **Problem:** Blenders and espresso steam wands interrupting focused work and calls.
   * **Solution:** **Decibel-mapped acoustic zoning** (e.g. Mezzanine 44 dB focus vs Communal 66 dB buzz).
5. **✨ Gemini Photo Vibe Experience (Multimodal):**
   * **Solution:** Snap or describe your workstation/mood scene. Gemini Vision evaluates aesthetics, lighting, and company context, then pairs an exact sensory drink, zone, and mood quote.

---

## 🛡️ Grounding & Engineering Principles

* **Zero Hallucination Guarantee:** Gemini is constrained to return only verified server-owned item IDs (`CV-BEV-001` to `CV-SAV-002`).
* **Deterministic Math:** Application code authoritatively computes prices, GST (5%), and cart totals.
* **Graceful Fallback:** If the Gemini API key is missing or encounters network timeouts, the system seamlessly transitions to the verified deterministic grounding engine without dropping patron requests.

---

## 🚀 Running Locally

```bash
# 1. Build the production React frontend
cd cafe-companion
npm run build

# 2. Run the Cloud Run-compatible Python backend
cd server
python -m uvicorn main:app --host 0.0.0.0 --port 8080
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## ☁️ Deploying to Google Cloud Run

```bash
# Set your active GCP project
gcloud config set project dataguard-ml-agents-pipeline

# Deploy directly via Google Cloud Build & Cloud Run
gcloud run deploy cafeverse \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="YOUR_API_KEY"
```
