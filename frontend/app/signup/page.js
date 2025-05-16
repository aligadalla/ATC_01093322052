"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_context/AuthContext";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    avatar: null,
  });
  const [err, setErr] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("username", form.username);
    fd.append("email", form.email);
    fd.append("password", form.password);

    if (form.avatar) fd.append("file", form.avatar);

    try {
      await signup(fd);
      router.replace("/login");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <main style={{ maxWidth: 320, margin: "80px auto" }}>
      <h2>Signup</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
      >
        <input
          name="username"
          placeholder="username"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          onChange={handleChange}
          required
        />
        <input
          name="avatar"
          type="file"
          accept="image/*"
          onChange={handleChange}
        />
        {err && <p style={{ color: "red", fontSize: 14 }}>{err}</p>}
        <button style={{ padding: 8 }}>Sign up</button>
      </form>
    </main>
  );
}
