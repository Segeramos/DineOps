// src/components/layout/Footer.jsx
export default function Footer() {
  return (
    <div style={{ background:"#080808", borderTop:"1px solid #1a1a1a", padding:"2rem 1rem", textAlign:"center" }}>
      <div style={{ fontSize:20, fontStyle:"italic", color:"#c9a84c", marginBottom:6 }}>DineOps</div>
      <p style={{ fontSize:12, color:"#3a3a3a", letterSpacing:2 }}>
        © {new Date().getFullYear()} DineOps Restaurant. All rights reserved.
      </p>
    </div>
  );
}
