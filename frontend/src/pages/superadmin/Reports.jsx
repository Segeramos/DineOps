// src/pages/superadmin/Reports.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { SuperLayout } from "./Dashboard";

export default function SuperReports() {
  const [data, setData]     = useState({ orders:[], employees:[], customers:[] });
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/orders/"),
      api.get("/accounts/employees/"),
      api.get("/accounts/customers/"),
      api.get("/hr/rankings/"),
    ]).then(([ord, emp, cust, rank]) => {
      setData({ orders: ord.data, employees: emp.data, customers: cust.data });
      setRankings(rank.data.slice(0, 5));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalRev = data.orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + Number(o.total), 0);

  const MEDAL = ["🥇","🥈","🥉","4️⃣","5️⃣"];

  return (
    <SuperLayout title="Reports & Analytics">
      {loading ? <div style={{ color:"#555", textAlign:"center", padding:"3rem" }}>Loading...</div> : (
        <>
          {/* Key metrics */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:28 }}>
            {[
              { label:"Total Revenue",  value:`Ksh ${totalRev.toLocaleString()}`,       color:"#c9a84c" },
              { label:"Total Orders",   value:data.orders.length,                        color:"#fde68a" },
              { label:"Active Staff",   value:data.employees.length,                     color:"#86efac" },
              { label:"Total Customers",value:data.customers.length,                     color:"#93c5fd" },
            ].map(s => (
              <div key={s.label} style={{ background:"#141414", border:"1px solid #1f1f1f", borderRadius:12, padding:"1.25rem" }}>
                <div style={{ fontSize:11, color:"#555", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>{s.label}</div>
                <div style={{ fontSize:22, fontWeight:700, color:s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Employee leaderboard */}
          <div style={{ background:"#141414", border:"1px solid #1f1f1f", borderRadius:14, padding:"1.5rem", marginBottom:20 }}>
            <h2 style={{ fontSize:15, marginBottom:16 }}>Employee Leaderboard</h2>
            {rankings.length === 0 ? (
              <div style={{ color:"#555", fontSize:13 }}>No rankings available yet. Rate employees to generate rankings.</div>
            ) : rankings.map((r, i) => (
              <div key={r.id} style={{ display:"flex", alignItems:"center", gap:16, padding:"12px 0", borderBottom:"1px solid #1a1a1a", flexWrap:"wrap" }}>
                <span style={{ fontSize:20, minWidth:28 }}>{MEDAL[i] || i+1}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:600 }}>{r.employee_name}</div>
                  <div style={{ fontSize:11, color:"#555" }}>{r.department} · {r.month}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:16, color:"#c9a84c", fontWeight:700 }}>{r.total_score}</div>
                  <div style={{ fontSize:11, color:"#555" }}>score</div>
                </div>
                <div style={{ display:"flex", gap:16, fontSize:11, color:"#555", flexWrap:"wrap" }}>
                  <span>Orders: {r.orders_served}</span>
                  <span>Tips: Ksh {Number(r.tips_received).toLocaleString()}</span>
                  <span>Rating: {r.manager_rating}★</span>
                </div>
                {r.is_employee_of_month && (
                  <span style={{ fontSize:10, background:"#713f12", color:"#fde68a", padding:"2px 8px", borderRadius:20 }}>⭐ Employee of Month</span>
                )}
              </div>
            ))}
          </div>

          {/* Leave summary */}
          <div style={{ background:"#141414", border:"1px solid #1f1f1f", borderRadius:14, padding:"1.5rem" }}>
            <h2 style={{ fontSize:15, marginBottom:16 }}>Staff Leave Summary</h2>
            {data.employees.map(e => (
              <div key={e.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #1a1a1a", flexWrap:"wrap", gap:8 }}>
                <div>
                  <div style={{ fontSize:13 }}>{e.user?.name}</div>
                  <div style={{ fontSize:11, color:"#555" }}>{e.position}</div>
                </div>
                <div style={{ display:"flex", gap:16, fontSize:11, color:"#555", flexWrap:"wrap" }}>
                  <span style={{ color:"#86efac" }}>Annual: {e.annual_leave_balance}d</span>
                  <span style={{ color:"#fde68a" }}>Sick: {e.sick_leave_balance}d</span>
                  <span style={{ color:"#93c5fd" }}>Emergency: {e.emergency_leave_balance}d</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </SuperLayout>
  );
}
