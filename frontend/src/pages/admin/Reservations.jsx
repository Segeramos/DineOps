// src/pages/admin/Reservations.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { AdminLayout } from "./Dashboard";

const STATUSES = ["pending","confirmed","seated","completed","cancelled","no_show"];
const STATUS_COLOR = { pending:"#fde68a", confirmed:"#86efac", seated:"#93c5fd", completed:"#6ee7b7", cancelled:"#f87171", no_show:"#f87171" };
const STATUS_BG    = { pending:"#713f12", confirmed:"#14532d", seated:"#1e3a5f", completed:"#064e3b", cancelled:"#7f1d1d", no_show:"#7f1d1d" };

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter]   = useState("");
  const [date, setDate]       = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter) params.append("status", filter);
    if (date)   params.append("date", date);
    api.get(`/reservations/?${params}`).then(r => { setReservations(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [filter, date]);

  const updateStatus = async (id, status) => {
    await api.patch(`/reservations/${id}/status/`, { status });
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <AdminLayout title="Reservations">
      {/* Filters */}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:20, alignItems:"center" }}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          style={{ padding:"7px 12px", borderRadius:8, border:"1px solid #2a2a2a", background:"#0f0f0f", color:"#f5f0e8", fontSize:13, outline:"none" }} />
        <button onClick={() => setFilter("")} style={{ padding:"6px 14px", borderRadius:20, border:"1px solid #2a2a2a", background: filter==="" ? "#c9a84c" : "transparent", color: filter==="" ? "#0d0d0d" : "#a09880", fontSize:12, cursor:"pointer" }}>All</button>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding:"6px 14px", borderRadius:20, border:"1px solid #2a2a2a", background: filter===s ? STATUS_BG[s] : "transparent", color: filter===s ? STATUS_COLOR[s] : "#a09880", fontSize:12, cursor:"pointer", textTransform:"capitalize" }}>{s}</button>
        ))}
      </div>

      {loading ? <div style={{ color:"#555", padding:"3rem", textAlign:"center" }}>Loading...</div> :
        reservations.length === 0 ? <div style={{ color:"#555", padding:"3rem", textAlign:"center" }}>No reservations found.</div> :
        reservations.map(r => (
          <div key={r.id} style={{ background:"#141414", border:"1px solid #1f1f1f", borderRadius:12, padding:"1rem", marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8, marginBottom:10 }}>
              <div>
                <div style={{ fontSize:14, fontWeight:600, marginBottom:2 }}>{r.name}</div>
                <div style={{ fontSize:12, color:"#706856" }}>{r.phone} · {r.email}</div>
                <div style={{ fontSize:12, color:"#a09880", marginTop:4 }}>{r.date} at {r.time} · {r.guests} guests · {r.occasion}</div>
                {r.special_requests && <div style={{ fontSize:12, color:"#555", marginTop:4 }}>Note: {r.special_requests}</div>}
              </div>
              <span style={{ fontSize:11, background:STATUS_BG[r.status], color:STATUS_COLOR[r.status], padding:"3px 10px", borderRadius:20, flexShrink:0 }}>{r.status}</span>
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {STATUSES.map(s => (
                <button key={s} onClick={() => updateStatus(r.id, s)} style={{
                  padding:"4px 10px", borderRadius:6, fontSize:11, cursor:"pointer", textTransform:"capitalize",
                  background: r.status===s ? STATUS_BG[s] : "transparent",
                  color: r.status===s ? STATUS_COLOR[s] : "#a09880",
                  border:`1px solid ${r.status===s ? STATUS_COLOR[s] : "#2a2a2a"}`
                }}>{s}</button>
              ))}
            </div>
          </div>
        ))
      }
    </AdminLayout>
  );
}
