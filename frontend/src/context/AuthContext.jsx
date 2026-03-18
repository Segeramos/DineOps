// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch Django profile
        try {
          const token = await firebaseUser.getIdToken();
          const res   = await api.get("/accounts/profile/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProfile(res.data);
        } catch (e) {
          console.error("Profile fetch error:", e);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const getToken = async () => {
    if (!user) return null;
    return await user.getIdToken();
  };

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const loginWithGoogle = () =>
    signInWithPopup(auth, new GoogleAuthProvider());

  const logout = () => signOut(auth);

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const isRole = (role) => profile?.role === role;

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      login, register, loginWithGoogle,
      logout, resetPassword, getToken,
      isCustomer:   isRole("customer"),
      isAdmin:      profile?.role === "admin" || profile?.role === "superadmin",
      isSuperAdmin: isRole("superadmin"),
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
