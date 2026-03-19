// src/pages/public/Contact.jsx
import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function Contact() {
  const [form, setForm] = useState({ name:"", email:"", phone:"", message:"" });
  const [sent, setSent] = useState(false);
  const f = key => ({ value: form[key], onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) });

  const inputStyle = {
    width:"100%", padding:"11px 14px", borderRadius:8,
    border:"1px solid #2a2a2a", background:"#0f0f0f",
    color:"#f5f0e8", fontSize:14, outline:"none", boxSizing:"border-box"
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#f5f0e8" }}>
      <Navbar />

      <div style={{ background:"#111", padding:"3rem 1rem", textAlign:"center", borderBottom:"1px solid #2a2a2a" }}>
        <p style={{ fontSize:11, letterSpacing:5, color:"#c9a84c", textTransform:"uppercase", marginBottom:12 }}>Get In Touch</p>
        <h1 style={{ fontSize:"clamp(28px, 5vw, 48px)" }}>Contact Us</h1>
      </div>

      {/* Stacks on mobile, side by side on desktop */}
      <div style={{ maxWidth:1000, margin:"0 auto", padding:"2rem 1rem", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:48 }}>

        {/* Info */}
        <div>
          <h2 style={{ fontSize:"clamp(20px,3vw,28px)", marginBottom:24 }}>Visit Us</h2>
          {[
            { label:"Location", value:"123 Kimathi Street, Nairobi CBD" },
            { label:"Phone",    value:"+254 700 000 000" },
            { label:"Email",    value:"info@dineops.co.ke" },
            { label:"Mon – Fri", value:"11:00 AM – 10:00 PM" },
            { label:"Sat – Sun", value:"10:00 AM – 11:00 PM" },
          ].map(({ label, value }) => (
            <div key={label} style={{ marginBottom:20, paddingBottom:20, borderBottom:"1px solid #1f1f1f" }}>
              <div style={{ fontSize:11, letterSpacing:3, color:"#c9a84c", textTransform:"uppercase", marginBottom:4 }}>{label}</div>
              <div style={{ color:"#a09880", fontSize:14 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div>
          <h2 style={{ fontSize:"clamp(20px,3vw,28px)", marginBottom:24 }}>Send a Message</h2>
          {sent ? (
            <div style={{ background:"#0f2d1a", color:"#86efac", padding:"20px", borderRadius:10, fontSize:14 }}>
              ✓ Message sent! We'll get back to you within 24 hours.
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true); }}>
              {[
                { label:"Full name",     key:"name",    type:"text",  placeholder:"John Doe" },
                { label:"Email address", key:"email",   type:"email", placeholder:"you@example.com" },
                { label:"Phone",         key:"phone",   type:"tel",   placeholder:"+254 700 000 000" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key} style={{ marginBottom:14 }}>
                  <label style={{ fontSize:12, color:"#a8a8a8", display:"block", marginBottom:4 }}>{label}</label>
                  <input type={type} placeholder={placeholder} required {...f(key)} style={inputStyle} />
                </div>
              ))}
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:12, color:"#a8a8a8", display:"block", marginBottom:4 }}>Message</label>
                <textarea rows={4} placeholder="How can we help you?" required {...f("message")}
                  style={{ ...inputStyle, resize:"vertical" }} />
              </div>
              <button type="submit" style={{
                width:"100%", background:"#c9a84c", color:"#0d0d0d",
                border:"none", borderRadius:8, padding:"12px",
                fontSize:14, fontWeight:700, cursor:"pointer"
              }}>Send Message</button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
