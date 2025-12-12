// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { register as adapterRegister } from "../api/adapter"; // your adapter.register()
import { useAuth } from "../contexts/AuthContexts";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth(); // function from AuthContext

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // where to return after successful register (if redirected here)
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // simple client-side validation
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      // call adapter.register; adapter uses mock when VITE_USE_MOCKS=true
      const res = await adapterRegister({ name, email, password });

      // adapter mock returns shape like: { data: { user, token } }
      const payload = res?.data ?? res;
      const user = payload?.user;
      const token = payload?.token;

      if (!user || !token) {
        throw new Error("Registration failed: invalid server response");
      }

      // persist auth (login user immediately after register)
      authLogin(user, token);

      // redirect to where they came from
      navigate(from, { replace: true });
    } catch (err) {
      // show server-provided message when available
      const msg = err?.response?.data?.message || err?.message || "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create an account</h2>

      {error && <div className="mb-3 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Full name"
          className="w-full border px-3 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          className="w-full border px-3 py-2 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-black py-2 rounded disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
