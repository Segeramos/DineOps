// src/pages/public/Menu.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [items, setItems]           = useState([]);
  const [active, setActive]         = useState(null);
  const [cart, setCart]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([api.get("/menu/categories/"), api.get("/menu/items/")])
      .then(([catRes, itemRes]) => {
        setCategories(catRes.data);
        setItems(itemRes.data);
        if (catRes.data.length) setActive(catRes.data[0].id);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  const filtered = active ? items.filter(i => i.category === active) : items;
  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(c => c.id === item.id);
      if (exists) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };
  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#f5f0e8" }}>
      <Navbar />

      {/* Header */}
      <div style={{ background:"#111", padding:"3rem 1rem", textAlign:"center", borderBottom:"1px solid #2a2a2a" }}>
        <p style={{ fontSize:11, letterSpacing:5, color:"#c9a84c", textTransform:"uppercase", marginBottom:12 }}>Culinary Selections</p>
        <h1 style={{ fontSize:"clamp(28px, 5vw, 48px)" }}>Our Menu</h1>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"2rem 1rem", paddingBottom: cart.length ? "6rem" : "2rem" }}>
        {/* Category tabs — horizontal scroll on mobile */}
        <div style={{ display:"flex", gap:0, overflowX:"auto", borderBottom:"1px solid #2a2a2a", marginBottom:32, scrollbarWidth:"none" }}>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActive(cat.id)} style={{
              flexShrink:0, padding:"10px 20px", fontSize:11, letterSpacing:2, textTransform:"uppercase",
              background:"transparent", border:"none", cursor:"pointer",
              color: active===cat.id ? "#c9a84c" : "#a09880",
              borderBottom: active===cat.id ? "2px solid #c9a84c" : "2px solid transparent",
              whiteSpace:"nowrap"
            }}>{cat.name}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign:"center", color:"#555", padding:"4rem" }}>Loading menu...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center", color:"#555", padding:"4rem" }}>No items in this category yet.</div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
            {filtered.map(item => (
              <div key={item.id} style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:12, overflow:"hidden" }}>
                {item.image && <img src={item.image} alt={item.name} style={{ width:"100%", height:160, objectFit:"cover" }} />}
                <div style={{ padding:"1rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                    <h3 style={{ fontSize:16, fontWeight:600, color:"#f5f0e8", flex:1 }}>{item.name}</h3>
                    <span style={{ color:"#c9a84c", fontSize:15, marginLeft:8, whiteSpace:"nowrap" }}>Ksh {Number(item.price).toLocaleString()}</span>
                  </div>
                  <p style={{ fontSize:13, color:"#706856", lineHeight:1.6, marginBottom:12 }}>{item.description}</p>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
                    {item.is_vegetarian && <span style={{ fontSize:10, background:"#0f2d1a", color:"#86efac", padding:"2px 8px", borderRadius:20 }}>Veg</span>}
                    {item.is_spicy && <span style={{ fontSize:10, background:"#2d1515", color:"#f87171", padding:"2px 8px", borderRadius:20 }}>Spicy</span>}
                    {item.prep_time && <span style={{ fontSize:10, color:"#555" }}>{item.prep_time} min</span>}
                  </div>
                  {user ? (
                    <button onClick={() => addToCart(item)} style={{
                      width:"100%", background:"#c9a84c", color:"#0d0d0d",
                      border:"none", borderRadius:8, padding:"10px",
                      fontSize:13, fontWeight:700, cursor:"pointer"
                    }}>+ Add to Cart</button>
                  ) : (
                    <Link to="/login" style={{
                      display:"block", textAlign:"center", background:"transparent",
                      border:"1px solid #c9a84c", color:"#c9a84c", borderRadius:8,
                      padding:"10px", fontSize:13, textDecoration:"none"
                    }}>Sign in to Order</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Cart bar */}
      {cart.length > 0 && (
        <div style={{
          position:"fixed", bottom:0, left:0, right:0,
          background:"#141414", borderTop:"1px solid #2a2a2a",
          padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between",
          flexWrap:"wrap", gap:8
        }}>
          <span style={{ color:"#a09880", fontSize:13 }}>
            {cart.reduce((s,c) => s+c.qty, 0)} items — <strong style={{ color:"#f5f0e8" }}>Ksh {total.toLocaleString()}</strong>
          </span>
          <Link to="/cart" style={{
            background:"#c9a84c", color:"#0d0d0d", padding:"9px 24px",
            fontSize:13, fontWeight:700, textDecoration:"none", borderRadius:8
          }}>View Cart →</Link>
        </div>
      )}
    </div>
  );
}
