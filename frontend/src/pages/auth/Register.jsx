// src/pages/auth/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function Field({ label, value, onChange, name, type = "text", placeholder }) {
  return (
    <div style={{ marginBottom: 14, textAlign: "left" }}>
      <label
        htmlFor={name}
        style={{
          fontSize: 12,
          color: "#a8a8a8",
          display: "block",
          marginBottom: 4,
        }}
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "11px 14px",
          borderRadius: 10,
          border: "1px solid #2a2a2a",
          background: "#0f0f0f",
          color: "#f5f0e8",
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const f = (key) => ({
    value: form[key],
    onChange: (e) => setForm((p) => ({ ...p, [key]: e.target.value })),
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await register(form.email, form.password);
      await api.patch("/accounts/profile/update/", {
        name: form.name,
        phone: form.phone,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError("Google sign-up failed.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0d0d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "#141414",
          border: "1px solid #2a2a2a",
          borderRadius: 20,
          padding: "2.5rem 2rem",
          width: "100%",
          maxWidth: 420,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 8 }}>🍽</div>
        <h1
          style={{
            color: "#c9a84c",
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 4,
          }}
        >
          Create Account
        </h1>
        <p style={{ color: "#666", fontSize: 13, marginBottom: 28 }}>
          Join DineOps today
        </p>

        {error && (
          <div
            style={{
              background: "#2d1515",
              color: "#f87171",
              fontSize: 13,
              padding: "8px 12px",
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <Field
            label="Full name"
            name="name"
            placeholder="John Doe"
            {...f("name")}
          />

          <Field
            label="Email address"
            name="email"
            type="email"
            placeholder="you@example.com"
            {...f("email")}
          />

          <Field
            label="Phone number"
            name="phone"
            placeholder="+254 700 000 000"
            {...f("phone")}
          />

          <div style={{ marginBottom: 14, textAlign: "left" }}>
            <label
              htmlFor="password"
              style={{
                fontSize: 12,
                color: "#a8a8a8",
                display: "block",
                marginBottom: 4,
              }}
            >
              Password
            </label>

            <div style={{ position: "relative" }}>
              <input
                id="password"
                name="password"
                type={show ? "text" : "password"}
                required
                placeholder="Min. 6 characters"
                {...f("password")}
                style={{
                  width: "100%",
                  padding: "11px 44px 11px 14px",
                  borderRadius: 10,
                  border: "1px solid #2a2a2a",
                  background: "#0f0f0f",
                  color: "#f5f0e8",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />

              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "#666",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                {show ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <Field
            label="Confirm password"
            name="confirm"
            type="password"
            placeholder="••••••••"
            {...f("confirm")}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "#c9a84c",
              color: "#0d0d0d",
              border: "none",
              borderRadius: 10,
              padding: "12px",
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: 12,
              marginTop: 4,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            margin: "16px 0",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "#2a2a2a" }} />
          <span style={{ fontSize: 12, color: "#555" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "#2a2a2a" }} />
        </div>

        <button
          onClick={handleGoogle}
          style={{
            width: "100%",
            background: "transparent",
            color: "#f5f0e8",
            border: "1px solid #2a2a2a",
            borderRadius: 10,
            padding: "11px",
            fontSize: 14,
            cursor: "pointer",
            marginBottom: 20,
          }}
        >
          Continue with Google
        </button>

        <p style={{ fontSize: 13, color: "#666" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#c9a84c", textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}