// src/pages/public/About.jsx
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function About() {
  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#f5f0e8" }}>
      <Navbar />

      <div style={{ background:"#111", padding:"3rem 1rem", textAlign:"center", borderBottom:"1px solid #2a2a2a" }}>
        <p style={{ fontSize:11, letterSpacing:5, color:"#c9a84c", textTransform:"uppercase", marginBottom:12 }}>Our Story</p>
        <h1 style={{ fontSize:"clamp(28px, 5vw, 48px)", lineHeight:1.2 }}>Crafting Memories<br/>Since 2010</h1>
        <p style={{ fontSize:15, color:"#a09880", maxWidth:520, margin:"1rem auto 0" }}>
          Nestled in the heart of Nairobi, we have been a destination for food lovers who appreciate fine dining.
        </p>
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"3rem 1rem" }}>

        {/* Story grid — stacks on mobile */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:40, alignItems:"center", marginBottom:60 }}>
          <div>
            <p style={{ fontSize:11, letterSpacing:4, color:"#c9a84c", textTransform:"uppercase", marginBottom:12 }}>Who We Are</p>
            <h2 style={{ fontSize:"clamp(22px,4vw,32px)", marginBottom:20, lineHeight:1.3 }}>A Passion for Exceptional Food</h2>
            <p style={{ color:"#a09880", lineHeight:1.9, marginBottom:14, fontSize:15 }}>
              Our chefs bring decades of experience from across the world, blending international techniques with the finest local ingredients.
            </p>
            <p style={{ color:"#a09880", lineHeight:1.9, fontSize:15 }}>
              Every dish is a celebration — of culture, of family, and of ingredients sourced locally and internationally.
            </p>
            <div style={{ marginTop:28, fontSize:26, color:"#c9a84c", fontStyle:"italic" }}>Chef Guru</div>
            <div style={{ fontSize:11, color:"#555", letterSpacing:2 }}>EXECUTIVE CHEF & FOUNDER</div>
          </div>
          <div style={{
            background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:12,
            height:300, display:"flex", alignItems:"center", justifyContent:"center",
            color:"#3a3a3a", fontSize:13, letterSpacing:2
          }}>[ Restaurant Photo ]</div>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, borderTop:"1px solid #2a2a2a", paddingTop:48, textAlign:"center", marginBottom:60 }}>
          {[["15+","Years"],["50K+","Guests"],["200+","Menu Items"]].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontSize:"clamp(28px,5vw,42px)", color:"#c9a84c", fontWeight:700, marginBottom:4 }}>{num}</div>
              <div style={{ fontSize:11, color:"#706856", letterSpacing:2, textTransform:"uppercase" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Values — stacks on mobile */}
        <p style={{ fontSize:11, letterSpacing:5, color:"#c9a84c", textTransform:"uppercase", marginBottom:12, textAlign:"center" }}>What We Stand For</p>
        <h2 style={{ fontSize:"clamp(22px,4vw,36px)", textAlign:"center", marginBottom:32 }}>Our Values</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16 }}>
          {[
            { title:"Quality", desc:"We source only the finest ingredients, working with local farmers and trusted suppliers." },
            { title:"Hospitality", desc:"Every guest is family. Our team is trained to make every visit warm and unforgettable." },
            { title:"Innovation", desc:"We constantly evolve our menu, blending traditional recipes with modern culinary techniques." },
          ].map(v => (
            <div key={v.title} style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:12, padding:"1.5rem" }}>
              <h3 style={{ color:"#c9a84c", fontSize:17, marginBottom:10 }}>{v.title}</h3>
              <p style={{ color:"#706856", fontSize:13, lineHeight:1.8 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
