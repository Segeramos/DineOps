// src/pages/superadmin/Employees.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { SuperLayout } from "./Dashboard";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch]       = useState("");
  const [modal, setModal]         = useState(false);
  const [form, setForm]           = useState({ name:"", email:"", phone:"", role:"admin", department:"front_of_house", position:"", date_joined:"", salary:"" });
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");

  useEffect(() => {
    api.get("/accounts/employees/").then(r => { setEmployees(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = employees.filter(e =>
    e.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    e.position?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRegister = async (ev) => {
    ev.preventDefault();
    setSaving(true); setError("");
    try {
      const res = await api.post("/accounts/employees/register/", form);
      setModal(false);
      setForm({ name:"", email:"", phone:"", role:"admin", department:"front_of_house", position:"", date_joined:"", salary:"" });
      const empRes = await api.get("/accounts/employees/");
      setEmployees(empRes.data);
    } catch(err) {
      setError(err.response?.data?.error || "Failed to register employee.");
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async (id) => {
    if (!window.confirm("Deactivate this employee?")) return;
    await api.patch(`/accounts/employees/${id}/deactivate/`);
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  const f = key => ({ value: form[key], onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) });
  const inputStyle = { width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid #2a2a2a", background:"#0f0f0f", color:"#f5f0e8", fontSize:13, outline:"none", boxSizing:"border-box" };

  return (
    <SuperLayout title="Employees">
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap", justifyContent:"space-between" }}>
        <input type="text" placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex:1, minWidth:200, padding:"9px 14px", borderRadius:8, border:"1px solid #2a2a2a", background:"#0f0f0f", color:"#f5f0e8", fontSize:13, outline:"none" }} />
        <button onClick={() => setModal(true)} style={{ background:"#c9a84c", color:"#0d0d0d", border:"none", borderRadius:8, padding:"9px 18px", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
          + Register Employee
        </button>
      </div>

      {loading ? <div style={{ color:"#555", textAlign:"center", padding:"3rem" }}>Loading...</div> :
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12 }}>
          {filtered.map(e => (
            <div key={e.id} style={{ background:"#141414", border:"1px solid #1f1f1f", borderRadius:12, padding:"1.25rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:"#c9a84c", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, color:"#0d0d0d", fontWeight:700, flexShrink:0 }}>
                  {(e.user?.name || "E")[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:600 }}>{e.user?.name}</div>
                  <div style={{ fontSize:12, color:"#706856" }}>{e.position}</div>
                </div>
              </div>
              <div style={{ fontSize:12, color:"#555", marginBottom:4 }}>ID: {e.employee_id}</div>
              <div style={{ fontSize:12, color:"#555", marginBottom:4 }}>Dept: {e.department?.replace("_"," ")}</div>
              <div style={{ fontSize:12, color:"#555", marginBottom:4 }}>{e.user?.email}</div>
              <div style={{ fontSize:11, color:"#c9a84c", textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>{e.user?.role}</div>
              <div style={{ display:"flex", gap:8 }}>
                <div style={{ flex:1, background:"#0f0f0f", border:"1px solid #1f1f1f", borderRadius:8, padding:"8px", fontSize:11, color:"#555", textAlign:"center" }}>
                  Leave: {e.annual_leave_balance}d left
                </div>
                <button onClick={() => deactivate(e.id)} style={{ background:"transparent", border:"1px solid #7f1d1d", borderRadius:8, padding:"8px 12px", color:"#f87171", fontSize:11, cursor:"pointer" }}>
                  Deactivate
                </button>
              </div>
            </div>
          ))}
        </div>
      }

      {/* Register modal */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:100 }} onClick={() => setModal(false)}>
          <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:"16px 16px 0 0", padding:"1.5rem", width:"100%", maxWidth:500, maxHeight:"90vh", overflowY:"auto" }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize:16, marginBottom:16 }}>Register New Employee</h2>
            {error && <div style={{ background:"#2d1515", color:"#f87171", borderRadius:8, padding:"10px 12px", marginBottom:14, fontSize:13 }}>{error}</div>}
            <form onSubmit={handleRegister}>
              {[
                { label:"Full Name", key:"name" },
                { label:"Email",     key:"email", type:"email" },
                { label:"Phone",     key:"phone", type:"tel" },
                { label:"Position",  key:"position" },
                { label:"Date Joined", key:"date_joined", type:"date" },
                { label:"Salary (Ksh)", key:"salary", type:"number" },
              ].map(({ label, key, type }) => (
                <div key={key} style={{ marginBottom:12 }}>
                  <label style={{ fontSize:12, color:"#a8a8a8", display:"block", marginBottom:4 }}>{label}</label>
                  <input type={type||"text"} required {...f(key)} style={inputStyle} />
                </div>
              ))}
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:12, color:"#a8a8a8", display:"block", marginBottom:4 }}>Role</label>
                <select required {...f("role")} style={inputStyle}>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:12, color:"#a8a8a8", display:"block", marginBottom:4 }}>Department</label>
                <select required {...f("department")} style={inputStyle}>
                  <option value="front_of_house">Front of House</option>
                  <option value="back_of_house">Back of House</option>
                  <option value="bar">Bar</option>
                  <option value="management">Management</option>
                  <option value="finance">Finance</option>
                </select>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button type="button" onClick={() => setModal(false)} style={{ flex:1, background:"transparent", border:"1px solid #2a2a2a", borderRadius:8, color:"#a09880", padding:"10px", cursor:"pointer", fontSize:13 }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ flex:1, background:"#c9a84c", border:"none", borderRadius:8, color:"#0d0d0d", padding:"10px", cursor:"pointer", fontSize:13, fontWeight:700 }}>
                  {saving ? "Registering..." : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperLayout>
  );
}
