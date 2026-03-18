// src/pages/auth/ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ForgotPassword() {
  const [email, setEmail]     = useState("");
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError("Failed to send reset email. Check the address and try again.");
    } finally {
      setLoading(false);
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
        <div style={{ fontSize: 32, marginBottom: 8 }}>🔑</div>
        <h1 style={{ color: "#c9a84c", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Reset Password</h1>
        <p style={{ color: "#666", fontSize: 13, marginBottom: 28 }}>
          Enter your email and we'll send you a reset link
        </p>

        {sent ? (
          <div style={{ background: "#0f2d1a", color: "#86efac", padding: "12px 16px", borderRadius: 10, fontSize: 14 }}>
            ✓ Reset link sent! Check your email inbox.
            <br /><br />
            <Link to="/login" style={{ color: "#c9a84c", textDecoration: "none", fontSize: 13 }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset}>
            {error && (
              <div style={{
                background: "#2d1515", color: "#f87171", fontSize: 13,
                padding: "8px 12px", borderRadius: 8, marginBottom: 16
              }}>
                {error}
              </div>
            )}
            <div style={{ marginBottom: 20, textAlign: "left" }}>
              <label style={{ fontSize: 12, color: "#a8a8a8", display: "block", marginBottom: 4 }}>
                Email address
              </label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 10,
                  border: "1px solid #2a2a2a", background: "#0f0f0f",
                  color: "#f5f0e8", fontSize: 14, outline: "none", boxSizing: "border-box"
                }}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              width: "100%", background: "#c9a84c", color: "#0d0d0d",
              border: "none", borderRadius: 10, padding: "12px",
              fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 16
            }}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <Link to="/login" style={{ fontSize: 13, color: "#666", textDecoration: "none" }}>
              ← Back to Sign In
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
