// src/pages/Login.jsx
import React, { useState } from "react";
import { login as adapterLogin } from "../api/adapter";
import { validateLogin } from "../utils/validators";
import { useAuth } from "../contexts/AuthContexts";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const err = validateLogin(form);
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      const res = await adapterLogin(form);
      const payload = res.data;
      if (!payload || !payload.user || !payload.token) throw new Error("Invalid server response");
      login(payload.user, payload.token);
      // redirect back to intended page or home
      const to = location.state?.from?.pathname || "/";
      navigate(to, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      {error && <div className="bg-red-50 text-red-700 p-2 mb-3 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="email" value={form.email} onChange={onChange} placeholder="Email" className="w-full border rounded px-3 py-2" />
        <input name="password" type="password" value={form.password} onChange={onChange} placeholder="Password" className="w-full border rounded px-3 py-2" />
        <button disabled={loading} className="w-full bg-primary text-white py-2 rounded">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
