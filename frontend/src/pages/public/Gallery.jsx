// src/pages/public/Gallery.jsx
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const ITEMS = [
  "Fine Dining","Chef's Special","Ambience",
  "Bar & Lounge","Private Dining","Desserts",
  "Live Events","The Kitchen","Our Team",
];

export default function Gallery() {
  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", color:"#f5f0e8" }}>
      <Navbar />

      <div style={{ background:"#111", padding:"3rem 1rem", textAlign:"center", borderBottom:"1px solid #2a2a2a" }}>
        <p style={{ fontSize:11, letterSpacing:5, color:"#c9a84c", textTransform:"uppercase", marginBottom:12 }}>Visual Journey</p>
        <h1 style={{ fontSize:"clamp(28px, 5vw, 48px)" }}>Gallery</h1>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"2rem 1rem" }}>
        {/* Responsive masonry-style grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:12 }}>
          {ITEMS.map((item, i) => (
            <div key={i} style={{
              background:"#141414", border:"1px solid #2a2a2a", borderRadius:10,
              height: i % 3 === 0 ? 280 : 200,
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"#3a3a3a", fontSize:12, letterSpacing:2, textTransform:"uppercase",
              cursor:"pointer", transition:"border-color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor="#c9a84c"}
              onMouseLeave={e => e.currentTarget.style.borderColor="#2a2a2a"}
            >
              {item}
            </div>
          ))}
        </div>
        <p style={{ textAlign:"center", color:"#555", fontSize:13, marginTop:28 }}>
          Photos will appear here once added by the restaurant team.
        </p>
      </div>

      <Footer />
    </div>
  );
}
