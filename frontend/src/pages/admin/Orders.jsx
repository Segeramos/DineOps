// src/pages/admin/Orders.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { AdminLayout } from "./Dashboard";

const STATUSES = ["pending","confirmed","preparing","ready","delivered","cancelled"];
const STATUS_COLOR = { pending:"#fde68a", confirmed:"#86efac", preparing:"#93c5fd", ready:"#6ee7b7", delivered:"#86efac", cancelled:"#f87171" };
const STATUS_BG    = { pending:"#713f12", confirmed:"#14532d", preparing:"#1e3a5f", ready:"#064e3b", delivered:"#14532d", cancelled:"#7f1d1d" };

export default function AdminOrders() {
  const [orders, setOrders]   = useState([]);
  const [filter, setFilter]   = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get("/orders/").then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/orders/${id}/status/`, { status });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const filtered = filter ? orders.filter(o => o.status === filter) : orders;

  return (
    <AdminLayout title="Orders">
      {/* Filter pills */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
        <button onClick={() => setFilter("")} style={{ padding:"6px 14px", borderRadius:20, border:"1px solid #2a2a2a", background: filter==="" ? "#c9a84c" : "transparent", color: filter==="" ? "#0d0d0d" : "#a09880", fontSize:12, cursor:"pointer", fontWeight: filter==="" ? 700 : 400 }}>All</button>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding:"6px 14px", borderRadius:20, border:"1px solid #2a2a2a", background: filter===s ? STATUS_BG[s] : "transparent", color: filter===s ? STATUS_COLOR[s] : "#a09880", fontSize:12, cursor:"pointer", textTransform:"capitalize" }}>{s}</button>
        ))}
      </div>

      {loading ? <div style={{ color:"#555", padding:"3rem", textAlign:"center" }}>Loading orders...</div> :
        filtered.map(o => (
          <div key={o.id} style={{ background:"#141414", border:"1px solid #1f1f1f", borderRadius:12, marginBottom:10, overflow:"hidden" }}>
            <div style={{ padding:"1rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8, cursor:"pointer" }}
              onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
              <div>
                <div style={{ fontSize:13, marginBottom:2 }}>#{String(o.order_number).slice(0,8)} · {o.customer_name}</div>
                <div style={{ fontSize:11, color:"#555" }}>{new Date(o.created_at).toLocaleString()} · {o.order_type}{o.table_number ? ` · Table ${o.table_number}` : ""}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                <span style={{ color:"#c9a84c", fontSize:14 }}>Ksh {Number(o.total).toLocaleString()}</span>
                <span style={{ fontSize:10, background:STATUS_BG[o.status], color:STATUS_COLOR[o.status], padding:"2px 8px", borderRadius:20 }}>{o.status}</span>
                <span style={{ color:"#555", fontSize:12 }}>{expanded===o.id?"▲":"▼"}</span>
              </div>
            </div>

            {expanded === o.id && (
              <div style={{ borderTop:"1px solid #1a1a1a", padding:"1rem" }}>
                {o.items?.map((item, i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:13, padding:"5px 0", borderBottom:"1px solid #1a1a1a" }}>
                    <span style={{ color:"#a09880" }}>{item.quantity}x {item.name}</span>
                    <span style={{ color:"#c9a84c" }}>Ksh {Number(item.subtotal).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ marginTop:14 }}>
                  <div style={{ fontSize:12, color:"#555", marginBottom:8 }}>Update Status:</div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {STATUSES.map(s => (
                      <button key={s} onClick={() => updateStatus(o.id, s)} style={{
                        padding:"5px 12px", borderRadius:6, fontSize:11, cursor:"pointer", textTransform:"capitalize",
                        background: o.status===s ? STATUS_BG[s] : "transparent",
                        color: o.status===s ? STATUS_COLOR[s] : "#a09880",
                        border:`1px solid ${o.status===s ? STATUS_COLOR[s] : "#2a2a2a"}`,
                        fontWeight: o.status===s ? 700 : 400
                      }}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      }
    </AdminLayout>
  );
}
