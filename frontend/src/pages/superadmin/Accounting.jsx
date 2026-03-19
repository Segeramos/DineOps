// src/pages/superadmin/Accounting.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { SuperLayout } from "./Dashboard";

export default function Accounting() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod]   = useState("all");

  useEffect(() => {
    api.get("/orders/").then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const now     = new Date();
  const filtered = orders.filter(o => {
    if (period === "all") return true;
    const d = new Date(o.created_at);
    if (period === "today") return d.toDateString() === now.toDateString();
    if (period === "week")  return (now - d) < 7 * 86400000;
    if (period === "month") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    return true;
  }).filter(o => o.status !== "cancelled");

  const totalRev  = filtered.reduce((s, o) => s + Number(o.total), 0);
  const totalTax  = filtered.reduce((s, o) => s + Number(o.tax || 0), 0);
  const totalTips = filtered.reduce((s, o) => s + Number(o.tip || 0), 0);

  const byMethod = filtered.reduce((acc, o) => {
    const m = o.payment?.method || "pending";
    if (!acc[m]) acc[m] = { count:0, amount:0 };
    acc[m].count++;
    acc[m].amount += Number(o.total);
    return acc;
  }, {});

  return (
    <SuperLayout title="Accounting">
      {/* Period filter */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {[["all","All Time"],["today","Today"],["week","This Week"],["month","This Month"]].map(([val, label]) => (
          <button key={val} onClick={() => setPeriod(val)} style={{
            padding:"7px 16px", borderRadius:20, border:"1px solid #2a2a2a", fontSize:12, cursor:"pointer",
            background: period===val ? "#c9a84c" : "transparent",
            color: period===val ? "#0d0d0d" : "#a09880",
            fontWeight: period===val ? 700 : 400
          }}>{label}</button>
        ))}
      </div>

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:24 }}>
        {[
          { label:"Total Revenue",  value:`Ksh ${totalRev.toLocaleString()}`,  color:"#c9a84c" },
          { label:"Tax Collected",  value:`Ksh ${totalTax.toLocaleString()}`,  color:"#86efac" },
          { label:"Tips Received",  value:`Ksh ${totalTips.toLocaleString()}`, color:"#fde68a" },
          { label:"Transactions",   value:filtered.length,                     color:"#93c5fd" },
        ].map(s => (
          <div key={s.label} style={{ background:"#141414", border:"1px solid #1f1f1f", borderRadius:12, padding:"1.25rem" }}>
            <div style={{ fontSize:11, color:"#555", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>{s.label}</div>
            <div style={{ fontSize:22, fontWeight:700, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* By payment method */}
      <div style={{ background:"#141414", border:"1px solid #1f1f1f", borderRadius:14, padding:"1.5rem", marginBottom:20 }}>
        <h2 style={{ fontSize:15, marginBottom:16 }}>Revenue by Payment Method</h2>
        {Object.entries(byMethod).map(([method, data]) => (
          <div key={method} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #1a1a1a", flexWrap:"wrap", gap:8 }}>
            <div>
              <div style={{ fontSize:13, textTransform:"capitalize" }}>{method}</div>
              <div style={{ fontSize:11, color:"#555" }}>{data.count} transactions</div>
            </div>
            <span style={{ fontSize:14, color:"#c9a84c", fontWeight:600 }}>Ksh {data.amount.toLocaleString()}</span>
          </div>
        ))}
        {Object.keys(byMethod).length === 0 && <div style={{ color:"#555", fontSize:13 }}>No transactions in this period.</div>}
      </div>

      {/* Transaction list */}
      <div style={{ background:"#141414", border:"1px solid #1f1f1f", borderRadius:14, padding:"1.5rem" }}>
        <h2 style={{ fontSize:15, marginBottom:16 }}>Transactions</h2>
        {loading ? <div style={{ color:"#555" }}>Loading...</div> :
          filtered.slice(0, 20).map(o => (
            <div key={o.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #1a1a1a", flexWrap:"wrap", gap:8 }}>
              <div>
                <div style={{ fontSize:13 }}>#{String(o.order_number).slice(0,8)}</div>
                <div style={{ fontSize:11, color:"#555" }}>{new Date(o.created_at).toLocaleString()}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:13, color:"#c9a84c" }}>Ksh {Number(o.total).toLocaleString()}</div>
                {Number(o.tip) > 0 && <div style={{ fontSize:11, color:"#86efac" }}>Tip: Ksh {Number(o.tip).toLocaleString()}</div>}
              </div>
            </div>
          ))
        }
      </div>
    </SuperLayout>
  );
}
