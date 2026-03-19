// src/pages/admin/Reports.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { AdminLayout } from "./Dashboard";

export default function AdminReports() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/").then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const delivered   = orders.filter(o => o.status === "delivered");
  const totalRev    = delivered.reduce((s, o) => s + Number(o.total), 0);
  const totalTips   = delivered.reduce((s, o) => s + Number(o.tip || 0), 0);
  const avgOrder    = delivered.length ? (totalRev / delivered.length) : 0;

  const byMethod    = orders.reduce((acc, o) => {
    const m = o.payment?.method || "unknown";
    acc[m] = (acc[m] || 0) + Number(o.total);
    return acc;
  }, {});

  return (
    <AdminLayout title="Reports">
      {loading ? <div style={{ color:"#555", textAlign:"center", padding:"3rem" }}>Loading...</div> : (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12, marginBottom:28 }}>
            {[
              { label:"Total Revenue",   value:`Ksh ${totalRev.toLocaleString()}`,     color:"#c9a84c" },
              { label:"Total Tips",      value:`Ksh ${totalTips.toLocaleString()}`,     color:"#86efac" },
              { label:"Orders Delivered",value:delivered.length,                        color:"#93c5fd" },
              { label:"Avg Order Value", value:`Ksh ${avgOrder.toFixed(0).toLocaleString()}`, color:"#c9a84c" },
            ].map(s => (
              <div key={s.label} style={{ background:"#141414", border:"1px solid #1f1f1f", borderRadius:12, padding:"1.25rem" }}>
                <div style={{ fontSize:11, color:"#555", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>{s.label}</div>
                <div style={{ fontSize:22, fontWeight:700, color:s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div style={{ background:"#141414", border:"1px solid #1f1f1f", borderRadius:14, padding:"1.5rem" }}>
            <h2 style={{ fontSize:15, marginBottom:16 }}>Revenue by Payment Method</h2>
            {Object.entries(byMethod).map(([method, amount]) => (
              <div key={method} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #1a1a1a" }}>
                <span style={{ fontSize:13, textTransform:"capitalize" }}>{method}</span>
                <span style={{ fontSize:13, color:"#c9a84c" }}>Ksh {Number(amount).toLocaleString()}</span>
              </div>
            ))}
            {Object.keys(byMethod).length === 0 && <div style={{ color:"#555", fontSize:13 }}>No payment data yet.</div>}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
