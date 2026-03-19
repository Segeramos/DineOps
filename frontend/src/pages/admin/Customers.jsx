// src/pages/admin/Customers.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { AdminLayout } from "./Dashboard";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    api.get("/accounts/customers/").then(r => { setCustomers(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c =>
    c.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Customers">
      <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid #2a2a2a", background:"#0f0f0f", color:"#f5f0e8", fontSize:13, outline:"none", marginBottom:20, boxSizing:"border-box" }} />

      {loading ? <div style={{ color:"#555", textAlign:"center", padding:"3rem" }}>Loading...</div> :
        filtered.length === 0 ? <div style={{ color:"#555", textAlign:"center", padding:"3rem" }}>No customers found.</div> :
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12 }}>
          {filtered.map(c => (
            <div key={c.id} style={{ background:"#141414", border:"1px solid #1f1f1f", borderRadius:12, padding:"1.25rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                <div style={{ width:40, height:40, borderRadius:"50%", background:"#c9a84c", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:"#0d0d0d", fontWeight:700, flexShrink:0 }}>
                  {(c.user?.name || c.user?.email || "?")[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:600 }}>{c.user?.name || "—"}</div>
                  <div style={{ fontSize:12, color:"#706856" }}>{c.user?.email}</div>
                </div>
              </div>
              <div style={{ fontSize:12, color:"#555", display:"flex", gap:16 }}>
                <span>Phone: {c.user?.phone || "—"}</span>
                {c.is_vip && <span style={{ color:"#c9a84c" }}>⭐ VIP</span>}
              </div>
              <div style={{ fontSize:12, color:"#555", marginTop:4 }}>
                Loyalty Points: {c.loyalty_pts || 0}
              </div>
            </div>
          ))}
        </div>
      }
    </AdminLayout>
  );
}
