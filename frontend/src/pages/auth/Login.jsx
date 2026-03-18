// src/pages/auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow]         = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const { login, loginWithGoogle, profile } = useAuth();
  const navigate = useNavigate();

  const redirect = (role) => {
    if (role === "superadmin") navigate("/superadmin");
    else if (role === "admin")  navigate("/admin");
    else                        navigate("/dashboard");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      // Profile loads via AuthContext — wait a tick
      setTimeout(() => redirect(profile?.role || "customer"), 500);
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await loginWithGoogle();
      setTimeout(() => redirect(profile?.role || "customer"), 500);
    } catch (err) {
      setError("Google sign-in failed.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0d0d0d",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem"
    }}>
      <div style={{
        background: "#141414", border: "1px solid #2a2a2a", borderRadius: 20,
        padding: "2.5rem 2rem", width: "100%", maxWidth: 400, textAlign: "center"
      }}>
        {/* Logo */}
        <div style={{ fontSize: 32, marginBottom: 8 }}>🍽</div>
        <h1 style={{ color: "#c9a84c", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>DineOps</h1>
        <p style={{ color: "#666", fontSize: 13, marginBottom: 28 }}>Sign in to your account</p>

        {error && (
          <div style={{
            background: "#2d1515", color: "#f87171", fontSize: 13,
            padding: "8px 12px", borderRadius: 8, marginBottom: 16
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={{ marginBottom: 14, textAlign: "left" }}>
            <label style={{ fontSize: 12, color: "#a8a8a8", display: "block", marginBottom: 4 }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 10,
                border: "1px solid #2a2a2a", background: "#0f0f0f",
                color: "#f5f0e8", fontSize: 14, outline: "none", boxSizing: "border-box"
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 8, textAlign: "left" }}>
            <label style={{ fontSize: 12, color: "#a8a8a8", display: "block", marginBottom: 4 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "11px 44px 11px 14px", borderRadius: 10,
                  border: "1px solid #2a2a2a", background: "#0f0f0f",
                  color: "#f5f0e8", fontSize: 14, outline: "none", boxSizing: "border-box"
                }}
              />
              <button type="button" onClick={() => setShow(s => !s)} style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "transparent", border: "none", color: "#666", cursor: "pointer", fontSize: 16
              }}>
                {show ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div style={{ textAlign: "right", marginBottom: 20 }}>
            <Link to="/forgot-password" style={{ fontSize: 12, color: "#c9a84c", textDecoration: "none" }}>
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} style={{
            width: "100%", background: "#c9a84c", color: "#0d0d0d",
            border: "none", borderRadius: 10, padding: "12px",
            fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 12
          }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#2a2a2a" }} />
          <span style={{ fontSize: 12, color: "#555" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "#2a2a2a" }} />
        </div>

        {/* Google */}
        <button onClick={handleGoogle} style={{
          width: "100%", background: "transparent", color: "#f5f0e8",
          border: "1px solid #2a2a2a", borderRadius: 10, padding: "11px",
          fontSize: 14, cursor: "pointer", marginBottom: 20
        }}>
          Continue with Google
        </button>

        <p style={{ fontSize: 13, color: "#666" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#c9a84c", textDecoration: "none" }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
