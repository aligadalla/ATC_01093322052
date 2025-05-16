"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_context/AuthContext";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.replace("/");
    } catch (e) {
      setErr(e.message);
    }
  };

  if (user) router.replace("/");

  return (
    <main style={{ maxWidth: 320, margin: "80px auto" }}>
      <h2>Login</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
      >
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          type="password"
        />
        {err && <p style={{ color: "red", fontSize: 14 }}>{err}</p>}
        <button style={{ padding: 8 }}>Log in</button>
      </form>
    </main>
  );
}
