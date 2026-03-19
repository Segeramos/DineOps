// src/pages/customer/OrderHistory.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const STATUS_COLOR = { pending:"#fde68a", confirmed:"#86efac", preparing:"#93c5fd", ready:"#6ee7b7", delivered:"#86efac", cancelled:"#f87171" };
const STATUS_BG    = { pending:"#713f12", confirmed:"#14532d", preparing:"#1e3a5f", ready:"#064e3b", delivered:"#14532d", cancelled:"#7f1d1d" };

export default function OrderHistory() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get("/orders/").then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#f5f0e8" }}>
      <Navbar />
      <div style={{ maxWidth:800, margin:"0 auto", padding:"2rem 1rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <h1 style={{ fontSize:"clamp(20px,4vw,30px)" }}>My Orders</h1>
          <Link to="/menu" style={{ background:"#c9a84c", color:"#0d0d0d", padding:"8px 20px", fontSize:12, fontWeight:700, textDecoration:"none", borderRadius:6 }}>+ New Order</Link>
        </div>

        {loading ? (
          <div style={{ textAlign:"center", color:"#555", padding:"4rem" }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign:"center", padding:"4rem" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📦</div>
            <p style={{ color:"#706856", marginBottom:16 }}>You haven't placed any orders yet.</p>
            <Link to="/menu" style={{ color:"#c9a84c", textDecoration:"none" }}>Browse Menu →</Link>
          </div>
        ) : orders.map(o => (
          <div key={o.id} style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:12, marginBottom:12, overflow:"hidden" }}>
            <div style={{ padding:"1rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8, cursor:"pointer" }}
              onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
              <div>
                <div style={{ fontSize:13, color:"#f5f0e8", marginBottom:4 }}>Order #{String(o.order_number).slice(0,8)}</div>
                <div style={{ fontSize:12, color:"#706856" }}>{new Date(o.created_at).toLocaleDateString()} · {o.order_type}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ color:"#c9a84c", fontSize:15 }}>Ksh {Number(o.total).toLocaleString()}</span>
                <span style={{ fontSize:11, background:STATUS_BG[o.status], color:STATUS_COLOR[o.status], padding:"3px 10px", borderRadius:20 }}>{o.status}</span>
                <span style={{ color:"#555", fontSize:12 }}>{expanded === o.id ? "▲" : "▼"}</span>
              </div>
            </div>

            {expanded === o.id && (
              <div style={{ borderTop:"1px solid #1f1f1f", padding:"1rem" }}>
                {o.items?.map((item, i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid #1a1a1a", fontSize:13 }}>
                    <span style={{ color:"#a09880" }}>{item.quantity}x {item.name}</span>
                    <span style={{ color:"#c9a84c" }}>Ksh {Number(item.subtotal).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ marginTop:12, display:"flex", justifyContent:"space-between", fontSize:12, color:"#706856" }}>
                  <span>Subtotal</span><span>Ksh {Number(o.subtotal).toLocaleString()}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#706856" }}>
                  <span>Tax (16%)</span><span>Ksh {Number(o.tax).toLocaleString()}</span>
                </div>
                {Number(o.tip) > 0 && (
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#706856" }}>
                    <span>Tip</span><span>Ksh {Number(o.tip).toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:14, color:"#f5f0e8", fontWeight:600, marginTop:8, paddingTop:8, borderTop:"1px solid #2a2a2a" }}>
                  <span>Total</span><span style={{ color:"#c9a84c" }}>Ksh {Number(o.total).toLocaleString()}</span>
                </div>
                <Link to={`/orders/${o.id}`} style={{ display:"block", marginTop:12, color:"#c9a84c", fontSize:12, textDecoration:"none" }}>
                  Track Order →
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
