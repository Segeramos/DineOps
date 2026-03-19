// src/pages/customer/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function CustomerDashboard() {
  const { profile } = useAuth();
  const [orders, setOrders]             = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/orders/"),
      api.get("/reservations/"),
    ]).then(([ordRes, resRes]) => {
      setOrders(ordRes.data.slice(0, 3));
      setReservations(resRes.data.slice(0, 3));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statusColor = (s) => ({
    pending:"#fde68a", confirmed:"#86efac", preparing:"#93c5fd",
    ready:"#6ee7b7", delivered:"#86efac", cancelled:"#f87171"
  }[s] || "#a09880");

  const statusBg = (s) => ({
    pending:"#713f12", confirmed:"#14532d", preparing:"#1e3a5f",
    ready:"#064e3b", delivered:"#14532d", cancelled:"#7f1d1d"
  }[s] || "#1f1f1f");

  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#f5f0e8" }}>
      <Navbar />

      <div style={{ maxWidth:1000, margin:"0 auto", padding:"2rem 1rem" }}>

        {/* Welcome */}
        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontSize:"clamp(22px,4vw,32px)", marginBottom:4 }}>
            Welcome back, {profile?.name?.split(" ")[0] || "Guest"} 👋
          </h1>
          <p style={{ color:"#706856", fontSize:14 }}>Here's what's happening with your account.</p>
        </div>

        {/* Quick actions */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12, marginBottom:40 }}>
          {[
            { label:"Order Food",       icon:"🍽", to:"/menu" },
            { label:"Reservations",     icon:"📅", to:"/reservations" },
            { label:"My Orders",        icon:"📦", to:"/orders" },
            { label:"My Profile",       icon:"👤", to:"/profile" },
          ].map(a => (
            <Link key={a.label} to={a.to} style={{
              background:"#141414", border:"1px solid #2a2a2a", borderRadius:12,
              padding:"1.25rem 1rem", textAlign:"center", textDecoration:"none",
              color:"#f5f0e8", transition:"border-color 0.2s"
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor="#c9a84c"}
              onMouseLeave={e => e.currentTarget.style.borderColor="#2a2a2a"}
            >
              <div style={{ fontSize:28, marginBottom:8 }}>{a.icon}</div>
              <div style={{ fontSize:13, color:"#a09880" }}>{a.label}</div>
            </Link>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign:"center", color:"#555", padding:"3rem" }}>Loading...</div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:24 }}>

            {/* Recent Orders */}
            <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:14, padding:"1.5rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                <h2 style={{ fontSize:17, fontWeight:600 }}>Recent Orders</h2>
                <Link to="/orders" style={{ fontSize:12, color:"#c9a84c", textDecoration:"none" }}>View all →</Link>
              </div>
              {orders.length === 0 ? (
                <div style={{ textAlign:"center", color:"#555", padding:"2rem 0" }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>🍽</div>
                  <p style={{ fontSize:13 }}>No orders yet</p>
                  <Link to="/menu" style={{ color:"#c9a84c", fontSize:13, textDecoration:"none" }}>Browse Menu →</Link>
                </div>
              ) : orders.map(o => (
                <div key={o.id} style={{ padding:"12px 0", borderBottom:"1px solid #1f1f1f" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:13, color:"#f5f0e8" }}>#{String(o.order_number).slice(0,8)}</span>
                    <span style={{ fontSize:11, background:statusBg(o.status), color:statusColor(o.status), padding:"2px 8px", borderRadius:20 }}>
                      {o.status}
                    </span>
                  </div>
                  <div style={{ fontSize:12, color:"#706856" }}>Ksh {Number(o.total).toLocaleString()}</div>
                </div>
              ))}
            </div>

            {/* Recent Reservations */}
            <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:14, padding:"1.5rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                <h2 style={{ fontSize:17, fontWeight:600 }}>Reservations</h2>
                <Link to="/reservations" style={{ fontSize:12, color:"#c9a84c", textDecoration:"none" }}>New →</Link>
              </div>
              {reservations.length === 0 ? (
                <div style={{ textAlign:"center", color:"#555", padding:"2rem 0" }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>📅</div>
                  <p style={{ fontSize:13 }}>No reservations yet</p>
                  <Link to="/reservations" style={{ color:"#c9a84c", fontSize:13, textDecoration:"none" }}>Book a Table →</Link>
                </div>
              ) : reservations.map(r => (
                <div key={r.id} style={{ padding:"12px 0", borderBottom:"1px solid #1f1f1f" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:13, color:"#f5f0e8" }}>{r.date} at {r.time}</span>
                    <span style={{ fontSize:11, background:statusBg(r.status), color:statusColor(r.status), padding:"2px 8px", borderRadius:20 }}>
                      {r.status}
                    </span>
                  </div>
                  <div style={{ fontSize:12, color:"#706856" }}>{r.guests} guests · {r.occasion}</div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
