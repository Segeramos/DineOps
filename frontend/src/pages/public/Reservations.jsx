// src/pages/public/Reservations.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const TIMES = ["12:00 PM","1:00 PM","2:00 PM","6:00 PM","7:00 PM","8:00 PM","9:00 PM","10:00 PM"];
const OCCASIONS = ["Regular Dining","Birthday","Anniversary","Business Dinner","Other"];

export default function Reservations() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm] = useState({
    name:"", phone:"", email:"", date:"", time:"", guests:"2", occasion:"Regular Dining", special_requests:""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  const f = key => ({ value: form[key], onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    setLoading(true); setError("");
    try {
      await api.post("/reservations/create/", { ...form, guests: parseInt(form.guests) });
      setSuccess(true);
    } catch {
      setError("Failed to make reservation. Please try again.");
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

      <div style={{ background:"#111", padding:"3rem 1rem", textAlign:"center", borderBottom:"1px solid #2a2a2a" }}>
        <p style={{ fontSize:11, letterSpacing:5, color:"#c9a84c", textTransform:"uppercase", marginBottom:12 }}>Book a Table</p>
        <h1 style={{ fontSize:"clamp(28px, 5vw, 48px)" }}>Reservations</h1>
      </div>

      <div style={{ maxWidth:620, margin:"0 auto", padding:"2rem 1rem" }}>
        {success ? (
          <div style={{ background:"#0f2d1a", border:"1px solid #166534", borderRadius:12, padding:"2rem", textAlign:"center" }}>
            <div style={{ fontSize:36, marginBottom:12 }}>🎉</div>
            <h2 style={{ color:"#86efac", fontSize:20, marginBottom:10 }}>Reservation Confirmed!</h2>
            <p style={{ color:"#a09880", marginBottom:20, fontSize:14 }}>
              We look forward to welcoming you. Check your dashboard for details.
            </p>
            <Link to="/dashboard" style={{
              background:"#c9a84c", color:"#0d0d0d", padding:"11px 24px",
              borderRadius:8, textDecoration:"none", fontSize:14, fontWeight:700
            }}>View My Reservations</Link>
          </div>
        ) : (
          <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:14, padding:"1.5rem" }}>
            {!user && (
              <div style={{ background:"#1a1209", border:"1px solid #854F0B", borderRadius:8, padding:"12px 14px", marginBottom:20, fontSize:13, color:"#fde68a" }}>
                Please <Link to="/login" style={{ color:"#c9a84c" }}>sign in</Link> to make a reservation.
              </div>
            )}
            {error && (
              <div style={{ background:"#2d1515", color:"#f87171", borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:13 }}>{error}</div>
            )}
            <form onSubmit={handleSubmit}>
              {/* Two column on desktop, single on mobile */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14, marginBottom:14 }}>
                <div>
                  <label style={{ fontSize:12, color:"#a8a8a8", display:"block", marginBottom:4 }}>Full name</label>
                  <input type="text" required placeholder="John Doe" {...f("name")} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize:12, color:"#a8a8a8", display:"block", marginBottom:4 }}>Phone</label>
                  <input type="tel" required placeholder="+254 700 000 000" {...f("phone")} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize:12, color:"#a8a8a8", display:"block", marginBottom:4 }}>Date</label>
                  <input type="date" required {...f("date")} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize:12, color:"#a8a8a8", display:"block", marginBottom:4 }}>Time</label>
                  <select required {...f("time")} style={inputStyle}>
                    <option value="">Select time</option>
                    {TIMES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:12, color:"#a8a8a8", display:"block", marginBottom:4 }}>Guests</label>
                  <select required {...f("guests")} style={inputStyle}>
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Guest{n>1?"s":""}</option>)}
                    <option value="9">9+ Guests</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:12, color:"#a8a8a8", display:"block", marginBottom:4 }}>Occasion</label>
                  <select {...f("occasion")} style={inputStyle}>
                    {OCCASIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:12, color:"#a8a8a8", display:"block", marginBottom:4 }}>Special requests</label>
                <textarea rows={3} placeholder="Dietary requirements, allergies, special arrangements..."
                  {...f("special_requests")} style={{ ...inputStyle, resize:"vertical" }} />
              </div>

              <button type="submit" disabled={loading} style={{
                width:"100%", background:"#c9a84c", color:"#0d0d0d",
                border:"none", borderRadius:10, padding:"13px",
                fontSize:15, fontWeight:700, cursor:"pointer"
              }}>
                {loading ? "Confirming..." : "Confirm Reservation"}
              </button>
            </form>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
