// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const SIDEBAR = [
  { label:"Dashboard",    icon:"◈", to:"/admin" },
  { label:"Orders",       icon:"📦", to:"/admin/orders" },
  { label:"Reservations", icon:"📅", to:"/admin/reservations" },
  { label:"Menu",         icon:"🍽", to:"/admin/menu" },
  { label:"Customers",    icon:"👥", to:"/admin/customers" },
  { label:"Reports",      icon:"📊", to:"/admin/reports" },
];

export function AdminLayout({ children, title }) {
  const { logout, profile } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", color:"#f5f0e8", display:"flex", flexDirection:"column" }}>
      {/* Mobile topbar */}
      <nav style={{ background:"#0f0f0f", borderBottom:"1px solid #1f1f1f", padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
        <span style={{ color:"#c9a84c", fontWeight:700, fontSize:16, fontStyle:"italic" }}>DineOps Admin</span>
        <button onClick={() => setMenuOpen(o => !o)} style={{ background:"transparent", border:"1px solid #2a2a2a", borderRadius:6, color:"#f5f0e8", padding:"5px 10px", cursor:"pointer", fontSize:16 }}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{ background:"#0f0f0f", borderBottom:"1px solid #1f1f1f", padding:"1rem" }}>
          {SIDEBAR.map(s => (
            <Link key={s.to} to={s.to} onClick={() => setMenuOpen(false)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", color:"#a09880", textDecoration:"none", fontSize:14 }}>
              <span>{s.icon}</span>{s.label}
            </Link>
          ))}
          <button onClick={logout} style={{ width:"100%", marginTop:8, background:"transparent", border:"1px solid #2a2a2a", borderRadius:8, color:"#f87171", padding:"10px", cursor:"pointer", fontSize:13 }}>Sign Out</button>
        </div>
      )}

      <div style={{ display:"flex", flex:1 }}>
        {/* Desktop sidebar */}
        <aside style={{ width:220, background:"#0f0f0f", borderRight:"1px solid #1f1f1f", padding:"1.5rem 1rem", display:"none", flexDirection:"column", justifyContent:"space-between" }} className="admin-sidebar">
          <div>
            <div style={{ color:"#c9a84c", fontWeight:700, fontSize:16, fontStyle:"italic", marginBottom:"1.5rem", padding:"0 12px" }}>DineOps Admin</div>
            {SIDEBAR.map(s => (
              <Link key={s.to} to={s.to} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", color:"#a09880", textDecoration:"none", fontSize:13, borderRadius:8, marginBottom:4 }}
                onMouseEnter={e => { e.currentTarget.style.background="#1f1f1f"; e.currentTarget.style.color="#c9a84c"; }}
                onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#a09880"; }}
              >
                <span>{s.icon}</span>{s.label}
              </Link>
            ))}
          </div>
          <div style={{ padding:"0 12px" }}>
            <div style={{ fontSize:12, color:"#555", marginBottom:8 }}>{profile?.name}</div>
            <button onClick={logout} style={{ width:"100%", background:"transparent", border:"1px solid #2a2a2a", borderRadius:8, color:"#f87171", padding:"8px", cursor:"pointer", fontSize:12 }}>Sign Out</button>
          </div>
        </aside>

        <main style={{ flex:1, padding:"1.5rem", overflowY:"auto" }}>
          <h1 style={{ fontSize:"clamp(18px,3vw,24px)", marginBottom:"1.5rem", fontWeight:600 }}>{title}</h1>
          {children}
        </main>
      </div>

      <style>{`
        @media(min-width:768px) {
          .admin-sidebar { display: flex !important; }
          nav { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders:0, reservations:0, customers:0, revenue:0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/orders/"), api.get("/reservations/"), api.get("/accounts/customers/")])
      .then(([ord, res, cust]) => {
        const orders = ord.data;
        setRecentOrders(orders.slice(0, 5));
        setStats({
          orders:       orders.length,
          reservations: res.data.length,
          customers:    cust.data.length,
          revenue:      orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + Number(o.total), 0),
        });
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  const STATUS_COLOR = { pending:"#fde68a", confirmed:"#86efac", preparing:"#93c5fd", ready:"#6ee7b7", delivered:"#86efac", cancelled:"#f87171" };
  const STATUS_BG = { pending:"#713f12", confirmed:"#14532d", preparing:"#1e3a5f", ready:"#064e3b", delivered:"#14532d", cancelled:"#7f1d1d" };

  return (
    <AdminLayout title="Dashboard">
      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12, marginBottom:28 }}>
        {[
          { label:"Total Orders",      value:stats.orders,                          color:"#c9a84c" },
          { label:"Reservations",      value:stats.reservations,                    color:"#86efac" },
          { label:"Customers",         value:stats.customers,                       color:"#93c5fd" },
          { label:"Revenue (Ksh)",     value:stats.revenue.toLocaleString(),        color:"#c9a84c" },
        ].map(s => (
          <div key={s.label} style={{ background:"#141414", border:"1px solid #1f1f1f", borderRadius:12, padding:"1.25rem" }}>
            <div style={{ fontSize:11, color:"#555", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>{s.label}</div>
            <div style={{ fontSize:24, fontWeight:700, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:10, marginBottom:28 }}>
        {[
          { label:"Manage Orders",      to:"/admin/orders" },
          { label:"Reservations",       to:"/admin/reservations" },
          { label:"Update Menu",        to:"/admin/menu" },
          { label:"View Customers",     to:"/admin/customers" },
        ].map(l => (
          <Link key={l.label} to={l.to} style={{ background:"#c9a84c", color:"#0d0d0d", padding:"10px 14px", borderRadius:8, textDecoration:"none", fontSize:12, fontWeight:700, textAlign:"center" }}>
            {l.label}
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div style={{ background:"#141414", border:"1px solid #1f1f1f", borderRadius:14, padding:"1.25rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h2 style={{ fontSize:15, fontWeight:600 }}>Recent Orders</h2>
          <Link to="/admin/orders" style={{ fontSize:12, color:"#c9a84c", textDecoration:"none" }}>View all →</Link>
        </div>
        {loading ? <div style={{ color:"#555", fontSize:13 }}>Loading...</div> :
          recentOrders.map(o => (
            <div key={o.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #1a1a1a", flexWrap:"wrap", gap:8 }}>
              <div>
                <div style={{ fontSize:13 }}>#{String(o.order_number).slice(0,8)}</div>
                <div style={{ fontSize:11, color:"#555" }}>{o.customer_name} · {o.order_type}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:13, color:"#c9a84c" }}>Ksh {Number(o.total).toLocaleString()}</span>
                <span style={{ fontSize:10, background:STATUS_BG[o.status], color:STATUS_COLOR[o.status], padding:"2px 8px", borderRadius:20 }}>{o.status}</span>
              </div>
            </div>
          ))
        }
      </div>
    </AdminLayout>
  );
}
