// src/pages/customer/Checkout.jsx
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const METHODS = [
  { id:"mpesa",  label:"Mpesa",       icon:"📱" },
  { id:"card",   label:"Debit Card",  icon:"💳" },
  { id:"paypal", label:"PayPal",      icon:"🅿" },
  { id:"cash",   label:"Cash",        icon:"💵" },
];

export default function Checkout() {
  const { state }     = useLocation();
  const navigate      = useNavigate();
  const cart          = state?.cart || [];
  const total         = state?.total || 0;
  const [method, setMethod]   = useState("mpesa");
  const [phone, setPhone]     = useState("");
  const [orderType, setOrderType] = useState("dine_in");
  const [table, setTable]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleCheckout = async () => {
    setLoading(true); setError("");
    try {
      // Create order first
      const orderRes = await api.post("/orders/create/", {
        order_type:   orderType,
        table_number: table,
        items: cart.map(i => ({ menu_item_id: i.id, quantity: i.qty }))
      });

      const orderId = orderRes.data.id;

      // Initiate payment
      await api.post("/payments/initiate/", {
        order_id: orderId,
        method,
        phone: method === "mpesa" ? phone : undefined,
      });

      localStorage.removeItem("dineops_cart");
      navigate(`/orders/${orderId}`);
    } catch(err) {
      setError("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width:"100%", padding:"11px 14px", borderRadius:8,
    border:"1px solid #2a2a2a", background:"#0f0f0f",
    color:"#f5f0e8", fontSize:14, outline:"none", boxSizing:"border-box"
  };

  if (!cart.length) return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#f5f0e8" }}>
      <Navbar />
      <div style={{ textAlign:"center", padding:"4rem" }}>
        <p style={{ color:"#706856", marginBottom:16 }}>No items in cart.</p>
        <Link to="/menu" style={{ color:"#c9a84c", textDecoration:"none" }}>Browse Menu →</Link>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#f5f0e8" }}>
      <Navbar />
      <div style={{ maxWidth:700, margin:"0 auto", padding:"2rem 1rem" }}>
        <h1 style={{ fontSize:"clamp(20px,4vw,30px)", marginBottom:24 }}>Checkout</h1>

        {error && <div style={{ background:"#2d1515", color:"#f87171", borderRadius:8, padding:"12px 14px", marginBottom:16, fontSize:13 }}>{error}</div>}

        {/* Order type */}
        <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:14, padding:"1.5rem", marginBottom:16 }}>
          <h3 style={{ fontSize:15, marginBottom:14 }}>Order Type</h3>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {[["dine_in","Dine In"],["takeaway","Takeaway"],["delivery","Delivery"]].map(([val, label]) => (
              <button key={val} onClick={() => setOrderType(val)} style={{
                padding:"8px 20px", borderRadius:8, fontSize:13, cursor:"pointer",
                background: orderType===val ? "#c9a84c" : "transparent",
                color: orderType===val ? "#0d0d0d" : "#a09880",
                border: `1px solid ${orderType===val ? "#c9a84c" : "#2a2a2a"}`,
                fontWeight: orderType===val ? 700 : 400
              }}>{label}</button>
            ))}
          </div>
          {orderType === "dine_in" && (
            <div style={{ marginTop:14 }}>
              <label style={{ fontSize:12, color:"#a8a8a8", display:"block", marginBottom:4 }}>Table number (optional)</label>
              <input type="text" placeholder="e.g. Table 5" value={table} onChange={e => setTable(e.target.value)} style={inputStyle} />
            </div>
          )}
        </div>

        {/* Payment method */}
        <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:14, padding:"1.5rem", marginBottom:16 }}>
          <h3 style={{ fontSize:15, marginBottom:14 }}>Payment Method</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:10, marginBottom:16 }}>
            {METHODS.map(m => (
              <button key={m.id} onClick={() => setMethod(m.id)} style={{
                padding:"12px 8px", borderRadius:10, fontSize:13, cursor:"pointer", textAlign:"center",
                background: method===m.id ? "#1a1209" : "transparent",
                color: method===m.id ? "#c9a84c" : "#a09880",
                border: `1px solid ${method===m.id ? "#c9a84c" : "#2a2a2a"}`,
              }}>
                <div style={{ fontSize:22, marginBottom:4 }}>{m.icon}</div>
                {m.label}
              </button>
            ))}
          </div>

          {method === "mpesa" && (
            <div>
              <label style={{ fontSize:12, color:"#a8a8a8", display:"block", marginBottom:4 }}>Mpesa Phone Number</label>
              <input type="tel" placeholder="e.g. 0712345678" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
              <p style={{ fontSize:11, color:"#555", marginTop:6 }}>You will receive an STK push to complete payment.</p>
            </div>
          )}
          {method === "card" && (
            <p style={{ fontSize:13, color:"#706856" }}>You will be redirected to a secure card payment page.</p>
          )}
          {method === "paypal" && (
            <p style={{ fontSize:13, color:"#706856" }}>You will be redirected to PayPal to complete payment.</p>
          )}
          {method === "cash" && (
            <p style={{ fontSize:13, color:"#706856" }}>Pay cash at the restaurant. Your order will be confirmed by staff.</p>
          )}
        </div>

        {/* Order summary */}
        <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:14, padding:"1.5rem", marginBottom:20 }}>
          <h3 style={{ fontSize:15, marginBottom:14 }}>Order Summary</h3>
          {cart.map(i => (
            <div key={i.id} style={{ display:"flex", justifyContent:"space-between", fontSize:13, padding:"6px 0", borderBottom:"1px solid #1a1a1a" }}>
              <span style={{ color:"#a09880" }}>{i.qty}x {i.name}</span>
              <span style={{ color:"#c9a84c" }}>Ksh {(i.price * i.qty).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:16, fontWeight:600, marginTop:12, paddingTop:10, borderTop:"1px solid #2a2a2a" }}>
            <span>Total</span><span style={{ color:"#c9a84c" }}>Ksh {Number(total).toLocaleString()}</span>
          </div>
        </div>

        <button onClick={handleCheckout} disabled={loading} style={{
          width:"100%", background:"#c9a84c", color:"#0d0d0d",
          border:"none", borderRadius:10, padding:"14px",
          fontSize:15, fontWeight:700, cursor:"pointer"
        }}>
          {loading ? "Processing..." : `Pay Ksh ${Number(total).toLocaleString()} →`}
        </button>
      </div>
      <Footer />
    </div>
  );
}
