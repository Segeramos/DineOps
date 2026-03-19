// src/pages/customer/Cart.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function Cart() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dineops_cart") || "[]"); } catch { return []; }
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("dineops_cart", JSON.stringify(cart));
  }, [cart]);

  const updateQty = (id, qty) => {
    if (qty < 1) { setCart(c => c.filter(i => i.id !== id)); return; }
    setCart(c => c.map(i => i.id === id ? { ...i, qty } : i));
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax      = subtotal * 0.16;
  const total    = subtotal + tax;

  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#f5f0e8" }}>
      <Navbar />
      <div style={{ maxWidth:700, margin:"0 auto", padding:"2rem 1rem" }}>
        <h1 style={{ fontSize:"clamp(20px,4vw,30px)", marginBottom:24 }}>My Cart</h1>

        {cart.length === 0 ? (
          <div style={{ textAlign:"center", padding:"4rem" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🛒</div>
            <p style={{ color:"#706856", marginBottom:16 }}>Your cart is empty.</p>
            <Link to="/menu" style={{ color:"#c9a84c", textDecoration:"none" }}>Browse Menu →</Link>
          </div>
        ) : (
          <>
            <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:14, padding:"1rem", marginBottom:20 }}>
              {cart.map(item => (
                <div key={item.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:"1px solid #1f1f1f", flexWrap:"wrap" }}>
                  <div style={{ flex:1, minWidth:140 }}>
                    <div style={{ fontSize:14, color:"#f5f0e8", marginBottom:2 }}>{item.name}</div>
                    <div style={{ fontSize:13, color:"#c9a84c" }}>Ksh {Number(item.price).toLocaleString()}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width:28, height:28, borderRadius:6, border:"1px solid #2a2a2a", background:"#0f0f0f", color:"#f5f0e8", cursor:"pointer", fontSize:16 }}>−</button>
                    <span style={{ fontSize:14, minWidth:20, textAlign:"center" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width:28, height:28, borderRadius:6, border:"1px solid #2a2a2a", background:"#0f0f0f", color:"#f5f0e8", cursor:"pointer", fontSize:16 }}>+</button>
                  </div>
                  <div style={{ fontSize:14, color:"#f5f0e8", minWidth:80, textAlign:"right" }}>
                    Ksh {(item.price * item.qty).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:14, padding:"1.5rem", marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10, fontSize:13, color:"#706856" }}>
                <span>Subtotal</span><span>Ksh {subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16, fontSize:13, color:"#706856" }}>
                <span>Tax (16% VAT)</span><span>Ksh {tax.toFixed(0).toLocaleString()}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:16, fontWeight:600, borderTop:"1px solid #2a2a2a", paddingTop:14 }}>
                <span>Total</span><span style={{ color:"#c9a84c" }}>Ksh {total.toFixed(0).toLocaleString()}</span>
              </div>
            </div>

            <button onClick={() => navigate("/checkout", { state: { cart, total: total.toFixed(0) } })} style={{
              width:"100%", background:"#c9a84c", color:"#0d0d0d",
              border:"none", borderRadius:10, padding:"14px",
              fontSize:15, fontWeight:700, cursor:"pointer"
            }}>Proceed to Checkout →</button>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
