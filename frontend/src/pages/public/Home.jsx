// src/pages/public/Home.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { label: "Menu",         to: "/menu" },
  { label: "Reservations", to: "/reservations" },
  { label: "About",        to: "/about" },
  { label: "Gallery",      to: "/gallery" },
  { label: "Contact",      to: "/contact" },
];

const FEATURES = [
  { icon: "🍽", title: "Fine Dining",      desc: "Experience world-class cuisine crafted by our award-winning chefs." },
  { icon: "📅", title: "Easy Reservations", desc: "Book your table online in seconds. No waiting, no hassle." },
  { icon: "🚀", title: "Fast Ordering",     desc: "Order from our menu online and pay securely with Mpesa, card or PayPal." },
  { icon: "⭐", title: "Premium Service",   desc: "Our dedicated staff ensure every visit is unforgettable." },
];

const MENU_HIGHLIGHTS = [
  { name: "Butter Chicken",   price: "Ksh 1,450", tag: "Chef's Pick",  emoji: "🍛" },
  { name: "Grilled Sea Bass", price: "Ksh 1,850", tag: "Trending",     emoji: "🐟" },
  { name: "Lamb Biryani",     price: "Ksh 1,600", tag: "Must Try",     emoji: "🍲" },
  { name: "Mango Kulfi",      price: "Ksh 500",   tag: "Dessert",      emoji: "🍨" },
];

export default function Home() {
  const { user, profile } = useAuth();

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (profile?.role === "superadmin") return "/superadmin";
    if (profile?.role === "admin") return "/admin";
    return "/dashboard";
  };

  return (
    <div style={{ background: "#0d0d0d", color: "#f5f0e8", fontFamily: "Georgia, serif", minHeight: "100vh" }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 40px", borderBottom: "1px solid #2a2a2a",
        position: "sticky", top: 0, background: "#0d0d0d", zIndex: 50
      }}>
        <Link to="/" style={{ fontSize: 22, fontWeight: 700, color: "#c9a84c", textDecoration: "none", fontStyle: "italic" }}>
          DineOps
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to} style={{
              color: "#d4c9b0", fontSize: 13, letterSpacing: 2,
              textDecoration: "none", textTransform: "uppercase", fontFamily: "Arial, sans-serif"
            }}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <Link to={getDashboardLink()} style={{
              background: "#c9a84c", color: "#0d0d0d", padding: "8px 20px",
              borderRadius: 8, fontSize: 13, fontWeight: 700,
              textDecoration: "none", fontFamily: "Arial, sans-serif"
            }}>
              Dashboard
            </Link>
          ) : (
            <Link to="/login" style={{
              background: "#c9a84c", color: "#0d0d0d", padding: "8px 20px",
              borderRadius: 8, fontSize: 13, fontWeight: 700,
              textDecoration: "none", fontFamily: "Arial, sans-serif"
            }}>
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: "88vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "60px 24px", borderBottom: "1px solid #1a1a1a"
      }}>
        <p style={{ fontSize: 11, letterSpacing: 6, color: "#c9a84c", textTransform: "uppercase", fontFamily: "Arial", marginBottom: 20 }}>
          Est. 2026 — Nairobi, Kenya
        </p>
        <h1 style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, marginBottom: 20, maxWidth: 700 }}>
          A Dining Experience<br />
          Like <em style={{ color: "#c9a84c" }}>No Other</em>
        </h1>
        <p style={{ fontSize: 18, color: "#a09880", maxWidth: 520, lineHeight: 1.8, marginBottom: 40, fontFamily: "Arial" }}>
          Authentic flavours, crafted with passion. Where every meal tells a story worth savouring.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <Link to="/reservations" style={{
            background: "#c9a84c", color: "#0d0d0d", padding: "14px 36px",
            fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
            textDecoration: "none", fontFamily: "Arial"
          }}>
            Reserve a Table
          </Link>
          <Link to="/menu" style={{
            background: "transparent", color: "#c9a84c", padding: "14px 36px",
            fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
            textDecoration: "none", fontFamily: "Arial", border: "1px solid #c9a84c"
          }}>
            View Our Menu
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 40px", borderBottom: "1px solid #1a1a1a" }}>
        <p style={{ fontSize: 11, letterSpacing: 5, color: "#c9a84c", textTransform: "uppercase", fontFamily: "Arial", textAlign: "center", marginBottom: 12 }}>Why Choose Us</p>
        <h2 style={{ fontSize: 36, textAlign: "center", marginBottom: 50 }}>The DineOps Difference</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{
              background: "#141414", border: "1px solid #2a2a2a", borderRadius: 16,
              padding: "2rem", textAlign: "center"
            }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, color: "#c9a84c", marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "#a09880", lineHeight: 1.7, fontFamily: "Arial" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Menu Highlights */}
      <section style={{ padding: "80px 40px", borderBottom: "1px solid #1a1a1a" }}>
        <p style={{ fontSize: 11, letterSpacing: 5, color: "#c9a84c", textTransform: "uppercase", fontFamily: "Arial", textAlign: "center", marginBottom: 12 }}>Culinary Selections</p>
        <h2 style={{ fontSize: 36, textAlign: "center", marginBottom: 50 }}>Featured Dishes</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, maxWidth: 900, margin: "0 auto 40px" }}>
          {MENU_HIGHLIGHTS.map(item => (
            <div key={item.name} style={{
              background: "#141414", border: "1px solid #2a2a2a", borderRadius: 16,
              padding: "1.5rem", textAlign: "center"
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{item.emoji}</div>
              <span style={{
                fontSize: 10, background: "#c9a84c22", color: "#c9a84c",
                padding: "3px 10px", borderRadius: 20, fontFamily: "Arial", letterSpacing: 1
              }}>{item.tag}</span>
              <h3 style={{ fontSize: 16, margin: "10px 0 6px" }}>{item.name}</h3>
              <p style={{ fontSize: 15, color: "#c9a84c", fontFamily: "Arial" }}>{item.price}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <Link to="/menu" style={{
            background: "transparent", color: "#c9a84c", padding: "12px 32px",
            fontSize: 13, letterSpacing: 2, textTransform: "uppercase",
            textDecoration: "none", fontFamily: "Arial", border: "1px solid #c9a84c", borderRadius: 4
          }}>
            View Full Menu
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 40px", textAlign: "center" }}>
        <p style={{ fontSize: 11, letterSpacing: 5, color: "#c9a84c", textTransform: "uppercase", fontFamily: "Arial", marginBottom: 12 }}>Book Your Experience</p>
        <h2 style={{ fontSize: 40, marginBottom: 16 }}>Ready for an Unforgettable Evening?</h2>
        <p style={{ fontSize: 16, color: "#a09880", marginBottom: 36, fontFamily: "Arial" }}>Reserve your table today and let us take care of the rest.</p>
        <Link to={user ? "/make-reservation" : "/register"} style={{
          background: "#c9a84c", color: "#0d0d0d", padding: "16px 44px",
          fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
          textDecoration: "none", fontFamily: "Arial"
        }}>
          {user ? "Make a Reservation" : "Create Account & Reserve"}
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ background: "#080808", borderTop: "1px solid #1a1a1a", padding: "32px 40px", textAlign: "center" }}>
        <p style={{ fontSize: 22, color: "#c9a84c", fontStyle: "italic", marginBottom: 8 }}>DineOps</p>
        <p style={{ fontSize: 12, color: "#3a3a3a", letterSpacing: 2, fontFamily: "Arial" }}>
          © {new Date().getFullYear()} DineOps Restaurant. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

