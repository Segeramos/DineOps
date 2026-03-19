// src/pages/customer/OrderTracking.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const STEPS = ["pending","confirmed","preparing","ready","delivered"];

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}/`).then(r => { setOrder(r.data); setLoading(false); }).catch(() => setLoading(false));
    const interval = setInterval(() => {
      api.get(`/orders/${id}/`).then(r => setOrder(r.data)).catch(() => {});
    }, 15000);
    return () => clearInterval(interval);
  }, [id]);

  const stepIndex = order ? STEPS.indexOf(order.status) : -1;

  const STEP_INFO = [
    { label:"Order Placed",  icon:"📋", desc:"Your order has been received." },
    { label:"Confirmed",     icon:"✅", desc:"The restaurant confirmed your order." },
    { label:"Preparing",     icon:"👨‍🍳", desc:"Your meal is being prepared." },
    { label:"Ready",         icon:"🍽", desc:"Your order is ready!" },
    { label:"Delivered",     icon:"🎉", desc:"Enjoy your meal!" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#f5f0e8" }}>
      <Navbar />
      <div style={{ maxWidth:600, margin:"0 auto", padding:"2rem 1rem" }}>
        <Link to="/orders" style={{ color:"#c9a84c", fontSize:13, textDecoration:"none", display:"block", marginBottom:20 }}>← Back to Orders</Link>
        <h1 style={{ fontSize:"clamp(20px,4vw,28px)", marginBottom:4 }}>Order Tracking</h1>

        {loading ? (
          <div style={{ textAlign:"center", color:"#555", padding:"4rem" }}>Loading...</div>
        ) : !order ? (
          <div style={{ textAlign:"center", color:"#555", padding:"4rem" }}>Order not found.</div>
        ) : (
          <>
            <p style={{ color:"#706856", fontSize:13, marginBottom:32 }}>
              Order #{String(order.order_number).slice(0,8)} · {new Date(order.created_at).toLocaleDateString()}
            </p>

            {/* Progress steps */}
            <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:14, padding:"1.5rem", marginBottom:24 }}>
              {STEP_INFO.map((step, i) => {
                const done    = i <= stepIndex;
                const current = i === stepIndex;
                return (
                  <div key={step.label} style={{ display:"flex", gap:16, alignItems:"flex-start", marginBottom: i < STEP_INFO.length-1 ? 20 : 0 }}>
                    <div style={{
                      width:40, height:40, borderRadius:"50%", flexShrink:0,
                      background: done ? "#c9a84c" : "#1f1f1f",
                      border: current ? "2px solid #c9a84c" : "2px solid transparent",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:18
                    }}>
                      {done ? step.icon : <span style={{ fontSize:14, color:"#555" }}>{i+1}</span>}
                    </div>
                    <div style={{ paddingTop:8 }}>
                      <div style={{ fontSize:14, fontWeight: current ? 600 : 400, color: done ? "#f5f0e8" : "#555" }}>{step.label}</div>
                      {current && <div style={{ fontSize:12, color:"#a09880", marginTop:2 }}>{step.desc}</div>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order summary */}
            <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:14, padding:"1.5rem" }}>
              <h3 style={{ fontSize:15, marginBottom:16 }}>Order Summary</h3>
              {order.items?.map((item, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid #1a1a1a", fontSize:13 }}>
                  <span style={{ color:"#a09880" }}>{item.quantity}x {item.name}</span>
                  <span style={{ color:"#c9a84c" }}>Ksh {Number(item.subtotal).toLocaleString()}</span>
                </div>
              ))}
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:12, fontSize:15, fontWeight:600 }}>
                <span>Total</span>
                <span style={{ color:"#c9a84c" }}>Ksh {Number(order.total).toLocaleString()}</span>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
