// src/pages/public/Home.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const FEATURES = [
  { icon:"🍽", title:"Fine Dining",     desc:"Experience world-class cuisine crafted by our award-winning chefs." },
  { icon:"🥂", title:"Private Events",  desc:"Host your special occasions in our elegant private dining spaces." },
  { icon:"🍷", title:"Curated Drinks",  desc:"A carefully selected wine list and signature cocktails to complement your meal." },
];

const MENU_PREVIEWS = [
  { name:"Butter Chicken",    price:"Ksh 1,450", tag:"Main Course" },
  { name:"Tandoori Prawns",   price:"Ksh 950",   tag:"Starters" },
  { name:"Mango Kulfi",       price:"Ksh 500",   tag:"Desserts" },
  { name:"Lamb Biryani",      price:"Ksh 1,600", tag:"Main Course" },
];

export default function Home() {
  const { user, isAdmin, isSuperAdmin } = useAuth();

  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#f5f0e8", fontFamily:"Georgia, serif" }}>
      <Navbar />

      {/* Hero */}
      <div style={{
        minHeight:"90vh", background:"#111", display:"flex",
        alignItems:"center", justifyContent:"center", flexDirection:"column",
        textAlign:"center", padding:"4rem 1.5rem", borderBottom:"1px solid #2a2a2a"
      }}>
        <p style={{ fontSize:11, letterSpacing:5, color:"#c9a84c", textTransform:"uppercase", marginBottom:20, fontFamily:"Arial,sans-serif" }}>
          Est. 2010 — Nairobi, Kenya
        </p>
        <h1 style={{ fontSize:"clamp(32px, 7vw, 72px)", lineHeight:1.15, marginBottom:20, maxWidth:700 }}>
          A Dining Experience<br />Like <em style={{ color:"#c9a84c" }}>No Other</em>
        </h1>
        <p style={{ fontSize:"clamp(14px,2vw,18px)", color:"#a09880", maxWidth:500, lineHeight:1.8, marginBottom:40, fontFamily:"Arial,sans-serif" }}>
          Authentic flavours, crafted with passion. Where every meal tells a story worth savouring.
        </p>
        <div style={{ display:"flex", gap:16, flexWrap:"wrap", justifyContent:"center" }}>
          <Link to="/reservations" style={{
            background:"#c9a84c", color:"#0d0d0d", padding:"14px 32px",
            fontSize:12, fontWeight:700, textDecoration:"none",
            letterSpacing:3, textTransform:"uppercase", border:"2px solid #c9a84c"
          }}>Reserve a Table</Link>
          <Link to="/menu" style={{
            background:"transparent", color:"#c9a84c", padding:"14px 32px",
            fontSize:12, fontWeight:700, textDecoration:"none",
            letterSpacing:3, textTransform:"uppercase", border:"2px solid #c9a84c"
          }}>View Our Menu</Link>
        </div>
      </div>

      {/* Features — stacks on mobile */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"4rem 1.5rem" }}>
        <p style={{ fontSize:11, letterSpacing:5, color:"#c9a84c", textTransform:"uppercase", marginBottom:12, textAlign:"center", fontFamily:"Arial,sans-serif" }}>Why Choose Us</p>
        <h2 style={{ fontSize:"clamp(24px,4vw,40px)", textAlign:"center", marginBottom:48 }}>The DineOps Experience</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:24 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:12, padding:"2rem", textAlign:"center" }}>
              <div style={{ fontSize:36, marginBottom:16 }}>{f.icon}</div>
              <h3 style={{ color:"#c9a84c", fontSize:18, marginBottom:10 }}>{f.title}</h3>
              <p style={{ color:"#706856", fontSize:14, lineHeight:1.8, fontFamily:"Arial,sans-serif" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu preview */}
      <div style={{ background:"#111", padding:"4rem 1.5rem", borderTop:"1px solid #2a2a2a", borderBottom:"1px solid #2a2a2a" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <p style={{ fontSize:11, letterSpacing:5, color:"#c9a84c", textTransform:"uppercase", marginBottom:12, textAlign:"center", fontFamily:"Arial,sans-serif" }}>A Taste of What Awaits</p>
          <h2 style={{ fontSize:"clamp(24px,4vw,40px)", textAlign:"center", marginBottom:48 }}>Featured Dishes</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:40 }}>
            {MENU_PREVIEWS.map(item => (
              <div key={item.name} style={{ background:"#0d0d0d", border:"1px solid #2a2a2a", borderRadius:10, padding:"1.5rem" }}>
                <div style={{ fontSize:11, color:"#c9a84c", letterSpacing:2, textTransform:"uppercase", marginBottom:8, fontFamily:"Arial,sans-serif" }}>{item.tag}</div>
                <div style={{ fontSize:17, marginBottom:6 }}>{item.name}</div>
                <div style={{ color:"#c9a84c", fontSize:15 }}>{item.price}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center" }}>
            <Link to="/menu" style={{
              border:"1px solid #c9a84c", color:"#c9a84c", padding:"12px 32px",
              fontSize:12, fontWeight:700, textDecoration:"none",
              letterSpacing:3, textTransform:"uppercase", borderRadius:4
            }}>Explore Full Menu</Link>
          </div>
        </div>
      </div>

      {/* About snippet */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"4rem 1.5rem" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:48, alignItems:"center" }}>
          <div style={{
            background:"#141414", border:"1px solid #2a2a2a", borderRadius:12,
            height:280, display:"flex", alignItems:"center", justifyContent:"center",
            color:"#3a3a3a", fontSize:13, letterSpacing:2
          }}>[ Restaurant Photo ]</div>
          <div>
            <p style={{ fontSize:11, letterSpacing:4, color:"#c9a84c", textTransform:"uppercase", marginBottom:12, fontFamily:"Arial,sans-serif" }}>Our Story</p>
            <h2 style={{ fontSize:"clamp(22px,4vw,36px)", marginBottom:20, lineHeight:1.3 }}>Crafting Memories Since 2010</h2>
            <p style={{ color:"#a09880", lineHeight:1.9, marginBottom:24, fontSize:15, fontFamily:"Arial,sans-serif" }}>
              Nestled in the heart of Nairobi, we have been a destination for food lovers who appreciate the art of fine dining. Our chefs bring decades of experience to every dish.
            </p>
            <Link to="/about" style={{
              border:"1px solid #c9a84c", color:"#c9a84c", padding:"10px 24px",
              fontSize:11, fontWeight:700, textDecoration:"none",
              letterSpacing:3, textTransform:"uppercase"
            }}>Our Story</Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background:"#111", padding:"5rem 1.5rem", textAlign:"center", borderTop:"1px solid #2a2a2a" }}>
        <h2 style={{ fontSize:"clamp(24px,4vw,42px)", marginBottom:16 }}>Ready to Dine With Us?</h2>
        <p style={{ color:"#a09880", fontSize:15, marginBottom:36, fontFamily:"Arial,sans-serif" }}>
          Reserve your table today and experience dining like never before.
        </p>
        <Link to="/reservations" style={{
          background:"#c9a84c", color:"#0d0d0d", padding:"16px 40px",
          fontSize:13, fontWeight:700, textDecoration:"none",
          letterSpacing:3, textTransform:"uppercase"
        }}>Make a Reservation</Link>
      </div>

      <Footer />
    </div>
  );
}