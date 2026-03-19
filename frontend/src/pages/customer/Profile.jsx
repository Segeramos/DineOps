// src/pages/customer/Profile.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function CustomerProfile() {
  const { profile, user, logout } = useAuth();
  const [form, setForm]     = useState({ name: profile?.name || "", phone: profile?.phone || "" });
  const [saved, setSaved]   = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch("/accounts/profile/update/", form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width:"100%", padding:"11px 14px", borderRadius:8,
    border:"1px solid #2a2a2a", background:"#0f0f0f",
    color:"#f5f0e8", fontSize:14, outline:"none", boxSizing:"border-box"
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#f5f0e8" }}>
      <Navbar />
      <div style={{ maxWidth:600, margin:"0 auto", padding:"2rem 1rem" }}>
        <h1 style={{ fontSize:"clamp(20px,4vw,30px)", marginBottom:8 }}>My Profile</h1>
        <p style={{ color:"#706856", fontSize:13, marginBottom:32 }}>{user?.email}</p>

        {/* Avatar */}
        <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:32 }}>
          <div style={{
            width:72, height:72, borderRadius:"50%",
            background:"#c9a84c", display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:28, color:"#0d0d0d", fontWeight:700
          }}>
            {(profile?.name || user?.email || "U")[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize:18, fontWeight:600 }}>{profile?.name || "Guest"}</div>
            <div style={{ fontSize:12, color:"#706856", marginTop:4 }}>
              {profile?.role === "customer" ? "Customer Account" : profile?.role}
            </div>
          </div>
        </div>

        {/* Edit form */}
        <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:14, padding:"1.5rem", marginBottom:16 }}>
          <h2 style={{ fontSize:16, marginBottom:20 }}>Edit Profile</h2>
          {saved && (
            <div style={{ background:"#0f2d1a", color:"#86efac", borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:13 }}>
              ✓ Profile updated successfully!
            </div>
          )}
          <form onSubmit={handleSave}>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, color:"#a8a8a8", display:"block", marginBottom:4 }}>Full name</label>
              <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, color:"#a8a8a8", display:"block", marginBottom:4 }}>Email address</label>
              <input type="email" value={user?.email || ""} disabled style={{ ...inputStyle, opacity:0.5, cursor:"not-allowed" }} />
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:12, color:"#a8a8a8", display:"block", marginBottom:4 }}>Phone number</label>
              <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+254 700 000 000" style={inputStyle} />
            </div>
            <button type="submit" disabled={loading} style={{
              width:"100%", background:"#c9a84c", color:"#0d0d0d",
              border:"none", borderRadius:8, padding:"12px",
              fontSize:14, fontWeight:700, cursor:"pointer"
            }}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Logout */}
        <button onClick={logout} style={{
          width:"100%", background:"transparent", color:"#f87171",
          border:"1px solid #7f1d1d", borderRadius:8, padding:"12px",
          fontSize:14, cursor:"pointer"
        }}>Sign Out</button>
      </div>
      <Footer />
    </div>
  );
}
