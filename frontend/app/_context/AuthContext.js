"use client";

import { createContext, useContext, useEffect, useState } from "react";
import fetcher from "../lib/fetcher";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const signup = async (formData) => {
    await fetcher("/auth/signup", {
      method: "POST",
      body: formData,
      headers: {},
    });
  };

  const login = async (email, password) => {
    const res = await fetcher("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setUser(res.data);
    localStorage.setItem("user", JSON.stringify(res.data));
  };

  const logout = async () => {
    await fetcher("/auth/logout", { method: "POST" });
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
