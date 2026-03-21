// src/components/layout/Navbar.jsx
// Shared responsive navbar used across all public pages
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV = ["Menu", "Reservations", "About", "Gallery", "Contact"];
const PATHS = ["/menu", "/reservations", "/about", "/gallery", "/contact"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, isAdmin, isSuperAdmin } = useAuth();

  const dashPath = isSuperAdmin ? "/superadmin" : isAdmin ? "/admin" : "/dashboard";

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    function handleResize() {
      if (window.innerWidth > 768) setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <nav
        ref={menuRef}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "rgba(8, 8, 10, 0.68)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "0 20px",
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background:
                  "linear-gradient(135deg, rgba(201,168,76,1) 0%, rgba(255,222,120,1) 100%)",
                boxShadow: "0 10px 30px rgba(201,168,76,0.25)",
              }}
            />
            <span
              style={{
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: -0.4,
                color: "#f5efe4",
              }}
            >
              DineOps
            </span>
          </Link>

          {/* Desktop nav */}
          <div
            className="desktop-nav"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flex: 1,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {NAV.map((n, i) => (
                <Link
                  key={n}
                  to={PATHS[i]}
                  style={{
                    textDecoration: "none",
                    color: "#ddd3be",
                    fontSize: 13,
                    fontWeight: 500,
                    padding: "10px 14px",
                    borderRadius: 999,
                    transition: "all 0.3s ease",
                  }}
                  className="nav-link"
                >
                  {n}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop CTA */}
          <div
            className="desktop-nav"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <Link
              to={user ? dashPath : "/login"}
              style={{
                textDecoration: "none",
                color: "#0d0d0d",
                background:
                  "linear-gradient(135deg, rgba(255,221,128,1) 0%, rgba(201,168,76,1) 100%)",
                padding: "11px 18px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 0.2,
                boxShadow: "0 10px 30px rgba(201,168,76,0.28)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              className="cta-btn"
            >
              {user ? "Dashboard" : "Sign In"}
            </Link>
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
            style={{
              display: "none",
              width: 44,
              height: 44,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.05)",
              color: "#f5efe4",
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              transition: "all 0.3s ease",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: open ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.4s ease",
              }}
            >
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>

        {/* Mobile dropdown */}
        <div
          style={{
            maxHeight: open ? 420 : 0,
            opacity: open ? 1 : 0,
            overflow: "hidden",
            transition:
              "max-height 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease",
            borderTop: open ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
            background: "rgba(10, 10, 12, 0.52)",
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
          }}
        >
          <div
            style={{
              maxWidth: 1240,
              margin: "0 auto",
              padding: "14px 20px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              transform: open ? "translateY(0)" : "translateY(-12px)",
              transition: "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {NAV.map((n, i) => (
              <Link
                key={n}
                to={PATHS[i]}
                onClick={() => setOpen(false)}
                style={{
                  textDecoration: "none",
                  color: "#f0e6d2",
                  fontSize: 15,
                  fontWeight: 500,
                  padding: "14px 16px",
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  transition: "all 0.3s ease",
                }}
                className="mobile-link"
              >
                {n}
              </Link>
            ))}

            <Link
              to={user ? dashPath : "/login"}
              onClick={() => setOpen(false)}
              style={{
                textDecoration: "none",
                color: "#0d0d0d",
                background:
                  "linear-gradient(135deg, rgba(255,221,128,1) 0%, rgba(201,168,76,1) 100%)",
                padding: "14px 18px",
                borderRadius: 18,
                textAlign: "center",
                fontSize: 14,
                fontWeight: 800,
                marginTop: 6,
                boxShadow: "0 12px 30px rgba(201,168,76,0.28)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              className="mobile-cta"
            >
              {user ? "Dashboard" : "Sign In"}
            </Link>
          </div>
        </div>

        <style>{`
          .nav-link:hover {
            background: rgba(255,255,255,0.06);
            color: #ffffff !important;
          }

          .cta-btn:hover,
          .mobile-cta:hover {
            transform: translateY(-1px);
            box-shadow: 0 16px 36px rgba(201,168,76,0.32);
          }

          .mobile-menu-btn:hover {
            background: rgba(255,255,255,0.08) !important;
            border-color: rgba(255,255,255,0.14) !important;
          }

          .mobile-link:hover {
            background: rgba(255,255,255,0.07) !important;
            color: #ffffff !important;
            transform: translateX(4px);
          }

          @media (max-width: 768px) {
            .desktop-nav {
              display: none !important;
            }

            .mobile-menu-btn {
              display: inline-flex !important;
            }
          }
        `}</style>
      </nav>
    </>
  );
}