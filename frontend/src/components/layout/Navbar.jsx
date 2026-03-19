// src/components/layout/Navbar.jsx
// Shared responsive navbar used across all public pages
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV = ["Menu","Reservations","About","Gallery","Contact"];
const PATHS = ["/menu","/reservations","/about","/gallery","/contact"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const dashPath = isSuperAdmin ? "/superadmin" : isAdmin ? "/admin" : "/dashboard";

  return (
    <nav style={{ background:"#0d0d0d", borderBottom:"1px solid #2a2a2a", position:"sticky", top:0, zIndex:50 }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 }}>
        {/* Logo */}
        <Link to="/" style={{ fontSize:20, fontStyle:"italic", color:"#c9a84c", textDecoration:"none", fontWeight:700 }}>DineOps</Link>

        {/* Desktop links */}
        <div style={{ display:"flex", gap:24, alignItems:"center" }} className="desktop-nav">
          {NAV.map((n,i) => (
            <Link key={n} to={PATHS[i]} style={{ fontSize:11, letterSpacing:2, textTransform:"uppercase", color:"#d4c9b0", textDecoration:"none" }}>{n}</Link>
          ))}
          <Link to={user ? dashPath : "/login"} style={{
            background:"#c9a84c", color:"#0d0d0d", padding:"7px 18px",
            fontSize:11, fontWeight:700, textDecoration:"none", borderRadius:4, letterSpacing:1
          }}>
            {user ? "Dashboard" : "Sign In"}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(o => !o)} style={{
          background:"transparent", border:"1px solid #2a2a2a", borderRadius:6,
          color:"#f5f0e8", padding:"6px 10px", cursor:"pointer", fontSize:18,
          display:"none"
        }} className="mobile-menu-btn">
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div style={{
          background:"#141414", borderTop:"1px solid #2a2a2a",
          padding:"1rem 20px", display:"flex", flexDirection:"column", gap:16
        }}>
          {NAV.map((n,i) => (
            <Link key={n} to={PATHS[i]} onClick={() => setOpen(false)}
              style={{ fontSize:14, color:"#d4c9b0", textDecoration:"none", letterSpacing:1 }}>{n}</Link>
          ))}
          <Link to={user ? dashPath : "/login"} onClick={() => setOpen(false)} style={{
            background:"#c9a84c", color:"#0d0d0d", padding:"10px 18px",
            fontSize:13, fontWeight:700, textDecoration:"none", borderRadius:6,
            textAlign:"center", marginTop:8
          }}>
            {user ? "Dashboard" : "Sign In"}
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
