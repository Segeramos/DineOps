// src/pages/superadmin/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const SIDEBAR = [
  { label:"Dashboard",    icon:"◈", to:"/superadmin" },
  { label:"Employees",    icon:"👥", to:"/superadmin/employees" },
  { label:"Customers",    icon:"🧑", to:"/superadmin/customers" },
  { label:"Accounting",   icon:"💰", to:"/superadmin/accounting" },
  { label:"Reports",      icon:"📊", to:"/superadmin/reports" },
  { label:"Settings",     icon:"⚙️", to:"/superadmin/settings" },
  { label:"Admin Panel",  icon:"🔧", to:"/admin" },
];

export function SuperLayout({ children, title }) {
  const { logout, profile } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", color:"#f5f0e8", display:"flex", flexDirection:"column" }}>
      <nav style={{ background:"#0f0f0f", borderBottom:"1px solid #1f1f1f", padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
        <span style={{ color:"#c9a84c", fontWeight:700, fontSize:16, fontStyle:"italic" }}>⬡ Super Admin</span>
        <button onClick={() => setMenuOpen(o => !o)} style={{ background:"transparent", border:"1px solid #2a2a2a", borderRadius:6, color:"#f5f0e8", padding:"5px 10px", cursor:"pointer", fontSize:16 }}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

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
        <aside style={{ width:220, background:"#0f0f0f", borderRight:"1px solid #1f1f1f", padding:"1.5rem 1rem", display:"none", flexDirection:"column", justifyContent:"space-between" }} className="super-sidebar">
          <div>
            <div style={{ color:"#c9a84c", fontWeight:700, fontSize:16, fontStyle:"italic", marginBottom:"1.5rem", padding:"0 12px" }}>⬡ Super Admin</div>
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
            <div style={{ fontSize:10, color:"#c9a84c", marginBottom:8, letterSpacing:1 }}>SUPER ADMIN</div>
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
          .super-sidebar { display: flex !important; }
          nav { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default function SuperDashboard() {
  const [stats, setStats] = useState({ employees:0, customers:0, orders:0, revenue:0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/accounts/employees/"),
      api.get("/accounts/customers/"),
      api.get("/orders/"),
    ]).then(([emp, cust, ord]) => {
      const orders = ord.data;
      setStats({
        employees: emp.data.length,
        customers: cust.data.length,
        orders:    orders.length,
        revenue:   orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + Number(o.total), 0),
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <SuperLayout title="Super Admin Dashboard">
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12, marginBottom:28 }}>
        {[
          { label:"Employees",    value:stats.employees,                   color:"#86efac" },
          { label:"Customers",    value:stats.customers,                   color:"#93c5fd" },
          { label:"Total Orders", value:stats.orders,                      color:"#fde68a" },
          { label:"Revenue",      value:`Ksh ${stats.revenue.toLocaleString()}`, color:"#c9a84c" },
        ].map(s => (
          <div key={s.label} style={{ background:"#141414", border:"1px solid #1f1f1f", borderRadius:12, padding:"1.25rem" }}>
            <div style={{ fontSize:11, color:"#555", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>{s.label}</div>
            <div style={{ fontSize:24, fontWeight:700, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
        {SIDEBAR.filter(s => s.to !== "/superadmin").map(s => (
          <Link key={s.to} to={s.to} style={{ background:"#141414", border:"1px solid #1f1f1f", borderRadius:12, padding:"1.5rem", textDecoration:"none", color:"#f5f0e8", display:"flex", alignItems:"center", gap:14 }}
            onMouseEnter={e => e.currentTarget.style.borderColor="#c9a84c"}
            onMouseLeave={e => e.currentTarget.style.borderColor="#1f1f1f"}
          >
            <span style={{ fontSize:24 }}>{s.icon}</span>
            <span style={{ fontSize:14, color:"#a09880" }}>{s.label}</span>
          </Link>
        ))}
      </div>
    </SuperLayout>
  );
}
