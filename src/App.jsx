import React, { useState, useEffect, useRef } from 'react';
import { 
  SparklesIcon, CoffeeIcon, ClockIcon, CompassIcon, 
  VolumeIcon, UsersIcon, ShoppingBagIcon, CheckCircleIcon, ShieldAlertIcon 
} from './Icons';

export const CameraIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
    <circle cx="12" cy="13" r="3"/>
  </svg>
);

export const UploadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

export const DatabaseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('smartorder');
  const [menuItems, setMenuItems] = useState([]);
  
  // SmartOrder State
  const [query, setQuery] = useState('');
  const [budget, setBudget] = useState(250);
  const [dietary, setDietary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [smartResult, setSmartResult] = useState(null);

  // Cart & Order State
  const [cart, setCart] = useState([]);
  const [activeZone, setActiveZone] = useState('The Mezzanine Loft');
  const [isOrdering, setIsOrdering] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Real-world Problem States
  const [waitData, setWaitData] = useState(null);
  const [roomData, setRoomData] = useState([]);
  const [sparksData, setSparksData] = useState([]);

  // Gemini Photo Vibe State (Image Upload & Camera)
  const [vibeScene, setVibeScene] = useState('Golden hour study desk with laptop and notebooks');
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  const [uploadedImageB64, setUploadedImageB64] = useState(null);
  const [vibeResult, setVibeResult] = useState(null);
  const [analyzingVibe, setAnalyzingVibe] = useState(false);
  const fileInputRef = useRef(null);

  // Cloud SQL Experiences State
  const [experiences, setExperiences] = useState([]);
  const [feedbackText, setFeedbackText] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackZone, setFeedbackZone] = useState('The Mezzanine Loft');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(null);

  const fetchExperiences = () => {
    fetch('/api/experiences').then(r => r.json()).then(setExperiences).catch(console.error);
  };

  useEffect(() => {
    fetch('/api/menu').then(r => r.json()).then(setMenuItems).catch(console.error);
    fetch('/api/waitwise').then(r => r.json()).then(setWaitData).catch(console.error);
    fetch('/api/roomsense').then(r => r.json()).then(setRoomData).catch(console.error);
    fetch('/api/cafeconnect').then(r => r.json()).then(setSparksData).catch(console.error);
    fetchExperiences();
  }, []);

  const handleImageFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImagePreview(reader.result);
        setUploadedImageB64(reader.result);
        setVibeScene(`Uploaded photo: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSmartOrder = async (queryText = query, budgetVal = budget) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/smartorder/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          max_budget: Number(budgetVal) || 250,
          dietary_filter: dietary || null
        })
      });
      const data = await res.json();
      setSmartResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVibeAnalyze = async (desc = vibeScene, b64Img = uploadedImageB64) => {
    setAnalyzingVibe(true);
    try {
      const res = await fetch('/api/vibe/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          photo_description: desc,
          photo_b64: b64Img || null
        })
      });
      const data = await res.json();
      setVibeResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzingVibe(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim()) return;
    setSubmittingFeedback(true);
    try {
      const res = await fetch('/api/experiences/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName || 'Patron',
          selected_zone: feedbackZone,
          feedback_text: feedbackText,
          rating: Number(feedbackRating)
        })
      });
      const data = await res.json();
      setFeedbackSuccess(data.ai_analysis);
      setFeedbackText('');
      fetchExperiences();
    } catch (err) {
      alert('Error submitting to Cloud SQL: ' + err.message);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.item_id === item.id);
      if (existing) {
        return prev.map(i => i.item_id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item_id: item.id, name: item.name, price: item.price, quantity: 1, customization: 'Standard' }];
    });
  };

  const removeFromCart = (itemId) => setCart(prev => prev.filter(i => i.item_id !== itemId));

  const subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const gst = Math.floor(subtotal * 0.05);
  const grandTotal = subtotal + gst;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsOrdering(true);
    try {
      const res = await fetch('/api/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName || 'Specialty Coffee Patron',
          items: cart.map(c => ({ item_id: c.item_id, quantity: c.quantity, customization: c.customization })),
          zone_preference: activeZone
        })
      });
      const orderRes = await res.json();
      setCompletedOrder(orderRes);
      setCart([]);
    } catch (err) {
      alert('Checkout error: ' + err.message);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header */}
      <header style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-light)',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #2C221E 0%, #3A6351 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF'
            }}>
              <CoffeeIcon />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 700, color: 'var(--text-espresso)' }}>
                  CaféVerse
                </h1>
                <span style={{
                  background: 'var(--sage-light)',
                  color: 'var(--sage-accent)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 11,
                  fontWeight: 800
                }}>
                  GEMINI MULTIMODAL VISION
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Your café. Your universe. Your moment.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-card)', padding: 4, borderRadius: 'var(--radius-full)', flexWrap: 'wrap' }}>
            {[
              { id: 'smartorder', label: '1. SmartOrder', icon: SparklesIcon },
              { id: 'vibephoto', label: '📸 Multimodal Photo Vibe', icon: CameraIcon },
              { id: 'cloudsql', label: '🗄 Cloud SQL', icon: DatabaseIcon },
              { id: 'crowding', label: '2. Ghost Crowding', icon: CompassIcon },
              { id: 'waitwise', label: '3. WaitWise™', icon: ClockIcon },
              { id: 'roomsense', label: '4. Acoustic Harmony', icon: VolumeIcon },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 12,
                    fontWeight: 700,
                    background: isActive ? 'var(--bg-surface)' : 'transparent',
                    color: isActive ? 'var(--text-espresso)' : 'var(--text-muted)',
                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  <Icon />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Cart Button */}
          <button
            onClick={() => {
              const elem = document.getElementById('cart-panel');
              if (elem) elem.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              background: 'var(--sage-accent)',
              color: '#FFF',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <ShoppingBagIcon />
            <span>Cart ({cart.reduce((a, b) => a + b.quantity, 0)}) • ₹{grandTotal}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1180, margin: '24px auto', padding: '0 20px', flex: 1, width: '100%' }}>

        {/* TAB: SMARTORDER */}
        {activeTab === 'smartorder' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{
              background: 'linear-gradient(135deg, #FFF 0%, #FAF7F2 100%)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: 28,
              boxShadow: 'var(--shadow-md)'
            }}>
              <span style={{ color: 'var(--caramel-gold)', fontWeight: 800, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Fixing Problem 1 • Eliminating Menu Anxiety & Overwhelm
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700, color: 'var(--text-espresso)', margin: '8px 0' }}>
                Conversational Sensory Ordering
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 18 }}>
                No endless scrolling. Express your taste, budget, or dietary needs naturally.
              </p>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Something refreshing under ₹250, not too sweet, quiet spot to work..."
                  style={{
                    flex: 1,
                    minWidth: 320,
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-medium)',
                    fontSize: 15,
                    background: '#FFF'
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSmartOrder()}
                />
                <button
                  onClick={() => handleSmartOrder()}
                  disabled={isSubmitting}
                  style={{
                    padding: '14px 28px',
                    background: 'var(--sage-accent)',
                    color: '#FFF',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: 15,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <SparklesIcon />
                  {isSubmitting ? 'Consulting Gemini...' : 'Find My Moment'}
                </button>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', fontSize: 13, color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>Max Budget:</span>
                  <input type="range" min="150" max="350" step="10" value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
                  <strong style={{ color: 'var(--text-espresso)' }}>₹{budget}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>Dietary Filter:</span>
                  <select value={dietary} onChange={(e) => setDietary(e.target.value)} style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)' }}>
                    <option value="">Any Diet</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                    <option value="Vegetarian">Vegetarian</option>
                  </select>
                </div>
              </div>

              {/* Presets */}
              <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-subtle)' }}>One-Tap Presets:</span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {[
                    { label: '🍋 Refreshing drink under ₹250 (Low Sweetness)', text: 'Something refreshing under ₹250, not too sweet', b: 250 },
                    { label: '💻 Quiet work spot for 30 mins', text: 'I need to work for 30 minutes in a quiet spot with iced pour-over', b: 240 },
                    { label: '✨ Surprise me with something new', text: 'Surprise me with an artisanal signature pairing', b: 300 }
                  ].map((d, i) => (
                    <button key={i} onClick={() => { setQuery(d.text); setBudget(d.b); handleSmartOrder(d.text, d.b); }} style={{
                      background: 'var(--bg-card)', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: 12, border: '1px solid var(--border-light)'
                    }}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Smart Result */}
            {smartResult && (
              <div className="animate-fade-in" style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                padding: 24,
                border: '1.5px solid var(--sage-border)',
                boxShadow: 'var(--shadow-md)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
                  <div>
                    <span style={{ background: 'var(--sage-accent)', color: '#FFF', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 700 }}>
                      {smartResult.source}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 700, marginTop: 6 }}>
                      {smartResult.intent_summary}
                    </h3>
                  </div>
                  <div style={{ background: 'var(--sage-light)', color: 'var(--sage-accent)', padding: '8px 14px', borderRadius: 'var(--radius-md)', fontSize: 13 }}>
                    🔊 {smartResult.room_recommendation}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                  {smartResult.recommendations.map(rec => {
                    const fullItem = menuItems.find(m => m.id === rec.item_id);
                    return (
                      <div key={rec.item_id} style={{ background: 'var(--bg-card)', padding: 18, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--caramel-gold)' }}>{rec.category}</span>
                            <span style={{ fontSize: 18, fontWeight: 800 }}>₹{rec.price}</span>
                          </div>
                          <h4 style={{ fontSize: 18, fontWeight: 700, margin: '4px 0' }}>{rec.item_name}</h4>
                          <p style={{ fontSize: 13, color: 'var(--sage-accent)', fontWeight: 600 }}>{rec.reason}</p>
                          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{rec.sweetness_note}</p>
                        </div>
                        <button onClick={() => fullItem && addToCart(fullItem)} style={{
                          marginTop: 12, background: 'var(--sage-accent)', color: '#FFF', padding: '10px', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: 13
                        }}>
                          + Add to Demo Order
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cart Section */}
            <div id="cart-panel" style={{
              background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: 24
            }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 700 }}>Your Demonstration Order</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>Authoritative deterministic pricing & GST. Stored into Cloud SQL.</p>
              
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-subtle)', fontSize: 13 }}>
                  Order is empty. Add a recommended item above!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {cart.map(item => (
                    <div key={item.item_id} style={{ display: 'flex', justifyContent: 'space-between', padding: 12, background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', fontSize: 14 }}>
                      <div><strong>{item.name}</strong> × {item.quantity} (₹{item.price})</div>
                      <div>
                        <strong>₹{item.price * item.quantity}</strong>
                        <button onClick={() => removeFromCart(item.item_id)} style={{ marginLeft: 12, color: 'var(--terracotta)', fontSize: 12 }}>Remove</button>
                      </div>
                    </div>
                  ))}

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid var(--border-light)' }}>
                    <span>Total with GST (5%):</span>
                    <strong style={{ fontSize: 18 }}>₹{grandTotal}</strong>
                  </div>

                  <button onClick={handleCheckout} disabled={isOrdering} style={{
                    background: 'var(--sage-accent)', color: '#FFF', padding: 14, borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: 15
                  }}>
                    {isOrdering ? 'Saving to Cloud SQL...' : 'Confirm Demo Order'}
                  </button>
                </div>
              )}

              {completedOrder && (
                <div style={{ marginTop: 16, padding: 16, background: 'var(--sage-light)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--sage-accent)' }}>
                  <strong style={{ color: 'var(--sage-accent)' }}>✓ Order {completedOrder.order_id} Saved to Cloud SQL!</strong>
                  <p style={{ fontSize: 13, marginTop: 4 }}>
                    Pickup in ~{completedOrder.estimated_pickup_mins} mins at {completedOrder.selected_zone}.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB: GEMINI MULTIMODAL PHOTO VIBE (WITH LIVE CAMERA & FILE UPLOAD) */}
        {activeTab === 'vibephoto' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{
              background: 'linear-gradient(135deg, #FFF 0%, #FAF7F2 100%)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: 28,
              boxShadow: 'var(--shadow-md)'
            }}>
              <span style={{ color: 'var(--caramel-gold)', fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Gemini Multimodal Vibe Experience
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700, color: 'var(--text-espresso)', margin: '8px 0' }}>
                Upload or Snap Your Desk & Vibe
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 18 }}>
                Upload your real photo or snapshot. Gemini 2.5 Flash Vision evaluates lighting, aesthetic vibe, companion count, and pairs the exact sensory drink and acoustic zone.
              </p>

              {/* Photo Upload Dropzone / Button */}
              <div style={{
                display: 'flex',
                gap: 16,
                flexWrap: 'wrap',
                marginBottom: 18,
                alignItems: 'center',
                padding: 16,
                border: '2px dashed var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                background: '#FFF'
              }}>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageFileChange}
                />
                
                <button
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  style={{
                    padding: '12px 20px',
                    background: 'var(--sage-accent)',
                    color: '#FFF',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <UploadIcon />
                  <span>Upload My Photo / Take Picture</span>
                </button>

                {uploadedImagePreview && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                      src={uploadedImagePreview}
                      alt="Uploaded vibe preview"
                      style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', border: '2px solid var(--caramel-gold)' }}
                    />
                    <div style={{ fontSize: 13 }}>
                      <strong style={{ color: 'var(--sage-accent)' }}>Photo Uploaded!</strong>
                      <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>Ready for Gemini Vision multimodal analysis</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Optional context text description */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                <input
                  type="text"
                  value={vibeScene}
                  onChange={(e) => setVibeScene(e.target.value)}
                  placeholder="Optional note: e.g. MacBook with Figma wireframes, sunny window seat..."
                  style={{ flex: 1, minWidth: 320, padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-medium)', fontSize: 15 }}
                />
                <button
                  onClick={() => handleVibeAnalyze(vibeScene, uploadedImageB64)}
                  disabled={analyzingVibe}
                  style={{
                    padding: '14px 28px',
                    background: 'linear-gradient(135deg, #C07D3E 0%, #2C221E 100%)',
                    color: '#FFF',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: 15,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <CameraIcon />
                  {analyzingVibe ? 'Gemini Vision Evaluating Photo...' : 'Analyze Vibe & Pair'}
                </button>
              </div>

              {/* Sample Photo Presets */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-subtle)', alignSelf: 'center' }}>Or choose sample:</span>
                {[
                  'MacBook with Figma wireframes, sunny sunlight, ceramic cup',
                  'Rainy window glass with paperback book and chunky wool knit',
                  'Two friends sketching a startup architecture on napkin'
                ].map((s, i) => (
                  <button key={i} onClick={() => { setVibeScene(s); setUploadedImagePreview(null); setUploadedImageB64(null); handleVibeAnalyze(s, null); }} style={{
                    background: 'var(--bg-card)', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: 12, border: '1px solid var(--border-light)'
                  }}>
                    📸 "{s}"
                  </button>
                ))}
              </div>
            </div>

            {/* Vibe Analysis Card */}
            {vibeResult && (
              <div className="animate-fade-in" style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                padding: 24,
                border: '1.5px solid var(--caramel-gold)',
                boxShadow: 'var(--shadow-md)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <span style={{ background: 'var(--caramel-light)', color: 'var(--caramel-gold)', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 800 }}>
                      {vibeResult.source}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 700, marginTop: 6 }}>
                      {vibeResult.aesthetic_vibe}
                    </h3>
                  </div>
                  <div style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: 13 }}>
                    "{vibeResult.atmosphere_curation_quote}"
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginTop: 18 }}>
                  <div style={{ background: 'var(--bg-card)', padding: 18, borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--caramel-gold)' }}>MATCHED SENSORY PAIRING</div>
                    <div style={{ fontSize: 18, fontWeight: 800, margin: '4px 0' }}>{vibeResult.matched_drink} (₹{vibeResult.drink_price})</div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{vibeResult.sensory_rationale}</p>
                    <button
                      onClick={() => {
                        const item = menuItems.find(m => m.id === vibeResult.matched_drink_id);
                        if (item) addToCart(item);
                      }}
                      style={{ marginTop: 10, background: 'var(--sage-accent)', color: '#FFF', padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 700 }}
                    >
                      + Add this Vibe Pairing to Cart
                    </button>
                  </div>

                  <div style={{ background: 'var(--bg-card)', padding: 18, borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sage-accent)' }}>ATMOSPHERE ZONE</div>
                    <div style={{ fontSize: 18, fontWeight: 800, margin: '4px 0' }}>{vibeResult.suggested_zone}</div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      Optimal acoustic isolation, natural lighting, and electrical outlet placement for your session.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: CLOUD SQL EXPERIENCE INTELLIGENCE */}
        {activeTab === 'cloudsql' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{
              background: 'linear-gradient(135deg, #FFF 0%, #FAF7F2 100%)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: 28,
              boxShadow: 'var(--shadow-md)'
            }}>
              <span style={{ color: 'var(--caramel-gold)', fontWeight: 800, fontSize: 12, textTransform: 'uppercase' }}>
                Cloud SQL • Customer Experience Ingestion & Analysis
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 700, margin: '6px 0' }}>
                Share Your Café Experience
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 18 }}>
                Every customer observation is stored in Cloud SQL and analyzed in real-time by Gemini to extract root causes and operational remedies.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
                <input
                  type="text"
                  placeholder="Your Name (or Patron)"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}
                />

                <select
                  value={feedbackZone}
                  onChange={e => setFeedbackZone(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', background: '#FFF' }}
                >
                  <option value="The Mezzanine Loft">The Mezzanine Loft (Focus Zone)</option>
                  <option value="Central Communal Oak Table">Central Communal Table</option>
                  <option value="Garden Atrium">Garden Atrium</option>
                </select>

                <select
                  value={feedbackRating}
                  onChange={e => setFeedbackRating(Number(e.target.value))}
                  style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', background: '#FFF' }}
                >
                  <option value="5">⭐⭐⭐⭐⭐ 5 - Exceptional</option>
                  <option value="4">⭐⭐⭐⭐ 4 - Good</option>
                  <option value="3">⭐⭐⭐ 3 - Neutral</option>
                  <option value="2">⭐⭐ 2 - Noticeable Friction</option>
                  <option value="1">⭐ 1 - Frustrated</option>
                </select>
              </div>

              <textarea
                rows="3"
                placeholder="Describe what happened: e.g. 'Loved the brew, but the blender noise was too loud during my Zoom meeting' or 'Waited 20 mins while tables were blocked by empty bags'..."
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-medium)', fontSize: 14, marginBottom: 14 }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <button
                  onClick={handleFeedbackSubmit}
                  disabled={submittingFeedback || !feedbackText.trim()}
                  style={{
                    background: 'var(--sage-accent)',
                    color: '#FFF',
                    padding: '12px 24px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <DatabaseIcon />
                  {submittingFeedback ? 'Analyzing with Gemini & Saving...' : 'Store Experience & Analyze'}
                </button>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button onClick={() => { setFeedbackText('Blender noise in the mezzanine was deafening during my work call.'); setFeedbackRating(2); }} style={{ fontSize: 11, background: 'var(--bg-card)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                    Sample: Acoustic Issue
                  </button>
                  <button onClick={() => { setFeedbackText('One person put backpacks on three seats for two hours.'); setFeedbackRating(2); }} style={{ fontSize: 11, background: 'var(--bg-card)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                    Sample: Ghost Crowding
                  </button>
                </div>
              </div>

              {feedbackSuccess && (
                <div style={{ marginTop: 16, padding: 14, background: 'var(--sage-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--sage-accent)' }}>
                  <strong style={{ color: 'var(--sage-accent)' }}>✓ Gemini Root Cause Extracted:</strong> {feedbackSuccess.root_cause}
                  <div style={{ fontSize: 13, marginTop: 4 }}>
                    <strong>Operational Countermeasure:</strong> {feedbackSuccess.suggested_operational_fix}
                  </div>
                </div>
              )}
            </div>

            {/* Cloud SQL Live Experience Feed */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700 }}>
                  Stored Experiences & Problem Analytics (Cloud SQL)
                </h3>
                <span style={{ fontSize: 12, background: 'var(--bg-card)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                  {experiences.length} Records in Database
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
                {experiences.map(exp => (
                  <div key={exp.id} style={{
                    background: 'var(--bg-surface)',
                    padding: 20,
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--caramel-gold)', textTransform: 'uppercase' }}>
                          {exp.identified_problem_category}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {exp.created_at}
                        </span>
                      </div>
                      
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                        {exp.customer_name} • <span style={{ color: 'var(--sage-accent)', fontSize: 13 }}>{exp.selected_zone}</span>
                      </div>

                      <p style={{ fontSize: 13, color: 'var(--text-espresso)', marginBottom: 12, fontStyle: 'italic' }}>
                        "{exp.feedback_text}"
                      </p>

                      <div style={{ background: 'var(--bg-card)', padding: 10, borderRadius: 'var(--radius-sm)', fontSize: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div><strong>Root Cause:</strong> {exp.gemini_root_cause}</div>
                        <div style={{ color: 'var(--sage-accent)' }}><strong>Operational Fix:</strong> {exp.suggested_operational_fix}</div>
                      </div>
                    </div>

                    <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                      <span>Sentiment: <strong>{exp.extracted_sentiment}</strong></span>
                      <span>Rating: {'★'.repeat(exp.rating)}{'☆'.repeat(5 - exp.rating)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB: GHOST CROWDING */}
        {activeTab === 'crowding' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <span style={{ color: 'var(--caramel-gold)', fontWeight: 800, fontSize: 12, textTransform: 'uppercase' }}>
                Fixing Problem 2 • Ghost Table Crowding Dilemma
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 700 }}>
                Dynamic Micro-Zone Seating & Load Balancer
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                Patrons often walk into a café, see one backpack on a 4-top table ("ghost crowding"), and walk away. CaféVerse orchestrates table sharing and zone-level capacity visibility.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
              {roomData.map((zone, i) => (
                <div key={i} style={{ background: 'var(--bg-surface)', padding: 22, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--sage-accent)' }}>{zone.vibe_match}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: zone.current_capacity_pct > 70 ? 'var(--terracotta)' : 'var(--sage-accent)' }}>
                      {zone.current_capacity_pct}% Filled
                    </span>
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, margin: '6px 0' }}>{zone.zone_name}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>{zone.sound_vibe}</p>
                  <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div>🔌 <strong>Power Outlets:</strong> {zone.power_outlets_available}</div>
                    <div>⏱ <strong>Target Dwell Time:</strong> {zone.recommended_duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: WAITWISE */}
        {activeTab === 'waitwise' && waitData && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <span style={{ color: 'var(--caramel-gold)', fontWeight: 800, fontSize: 12, textTransform: 'uppercase' }}>
                Fixing Problem 3 • Consistency Drop & Unavailability
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 700 }}>
                Deterministic WaitWise™ Engine
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                No vague "your order is being prepared" timers. Wait times scale transparently with item complexity and barista staffing.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              <div style={{ background: 'var(--bg-surface)', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>ESTIMATED WAIT</div>
                <div style={{ fontSize: 26, fontWeight: 800 }}>{waitData.estimated_wait_minutes} Mins</div>
                <div style={{ fontSize: 12, color: 'var(--sage-accent)' }}>{waitData.confidence_interval}</div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>ACTIVE TICKETS</div>
                <div style={{ fontSize: 26, fontWeight: 800 }}>{waitData.queue_length} Ahead</div>
                <div style={{ fontSize: 12, color: 'var(--sage-accent)' }}>{waitData.active_baristas} Active Baristas</div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>STATION DISPATCH</div>
                <div style={{ fontSize: 16, fontWeight: 800, marginTop: 6 }}>{waitData.prep_bottleneck_station}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: ROOMSENSE */}
        {activeTab === 'roomsense' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <span style={{ color: 'var(--caramel-gold)', fontWeight: 800, fontSize: 12, textTransform: 'uppercase' }}>
                Fixing Problem 4 • Acoustic Chaos & Invisible Friction
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 700 }}>
                RoomSense™ Decibel Zoning
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                Categorizes café micro-zones into explicit decibel profiles so focused work and social buzz never collide.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
              {roomData.map((zone, i) => (
                <div key={i} style={{ background: 'var(--bg-surface)', padding: 22, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--caramel-gold)' }}>{zone.sound_level_db} dB</span>
                    <span style={{ fontSize: 11, background: 'var(--sage-light)', color: 'var(--sage-accent)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                      {zone.vibe_match}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, margin: '6px 0' }}>{zone.zone_name}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{zone.sound_vibe}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-light)', padding: '18px 24px', textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 40 }}>
        <strong>CaféVerse</strong> • Powered by Google Gemini 2.5 Flash + Cloud SQL + Cloud Run | Built for Google Cloud Builder Pop-Up
      </footer>

    </div>
  );
}
