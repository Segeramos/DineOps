// src/components/layout/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, profile, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  if (role === "customer"   && profile?.role !== "customer")   return <Navigate to="/" replace />;
  if (role === "admin"      && !["admin","superadmin"].includes(profile?.role)) return <Navigate to="/" replace />;
  if (role === "superadmin" && profile?.role !== "superadmin") return <Navigate to="/" replace />;

  return children;
}
