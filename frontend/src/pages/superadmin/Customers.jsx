// src/pages/superadmin/Customers.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { SuperLayout } from "./Dashboard";

export default function SuperCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    api.get("/accounts/customers/").then(r => { setCustomers(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c =>
    c.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.user?.phone?.includes(search)
  );

  return (
    <SuperLayout title="All Customers">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex:1, minWidth:200, padding:"9px 14px", borderRadius:8, border:"1px solid #2a2a2a", background:"#0f0f0f", color:"#f5f0e8", fontSize:13, outline:"none" }} />
        <div style={{ fontSize:13, color:"#555" }}>{filtered.length} customers</div>
      </div>

      {loading ? <div style={{ color:"#555", textAlign:"center", padding:"3rem" }}>Loading...</div> :
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12 }}>
          {filtered.map(c => (
            <div key={c.id} style={{ background:"#141414", border:"1px solid #1f1f1f", borderRadius:12, padding:"1.25rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                <div style={{ width:40, height:40, borderRadius:"50%", background:"#1e3a5f", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:"#93c5fd", fontWeight:700, flexShrink:0 }}>
                  {(c.user?.name || c.user?.email || "?")[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:600 }}>{c.user?.name || "—"}</div>
                  <div style={{ fontSize:12, color:"#706856" }}>{c.user?.email}</div>
                </div>
              </div>
              <div style={{ fontSize:12, color:"#555", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:4 }}>
                <span>{c.user?.phone || "No phone"}</span>
                <span style={{ color: c.is_vip ? "#c9a84c" : "#555" }}>{c.is_vip ? "⭐ VIP" : "Regular"}</span>
              </div>
              <div style={{ marginTop:8, fontSize:12, color:"#555" }}>
                Loyalty: {c.loyalty_pts || 0} pts
              </div>
            </div>
          ))}
        </div>
      }
    </SuperLayout>
  );
}
