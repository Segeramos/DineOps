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
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const loadProfile = async () => {
        try {
          if (firebaseUser) {
            setUser(firebaseUser);

            const token = await firebaseUser.getIdToken();

            const res = await api.get("/accounts/profile/", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            setProfile(res.data);
          } else {
            setUser(null);
            setProfile(null);
          }
        } catch (error) {
          console.error("Profile fetch error:", error);
          console.error("Profile fetch status:", error?.response?.status);
          console.error("Profile fetch data:", error?.response?.data);
          setProfile(null);
        } finally {
          setLoading(false);
        }
      };

      loadProfile();
    });

    return () => unsubscribe();
  }, []);

  const getToken = async () => {
    if (!user) return null;
    return await user.getIdToken();
  };

  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    return await signInWithPopup(auth, new GoogleAuthProvider());
  };

  const logout = async () => {
    setUser(null);
    setProfile(null);
    return await signOut(auth);
  };

  const resetPassword = async (email) => {
    return await sendPasswordResetEmail(auth, email);
  };

  const isRole = (role) => profile?.role === role;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        resetPassword,
        getToken,
        isCustomer: isRole("customer"),
        isAdmin: profile?.role === "admin" || profile?.role === "superadmin",
        isSuperAdmin: isRole("superadmin"),
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);