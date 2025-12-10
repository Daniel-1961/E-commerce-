// src/pages/Register.jsx
import React, { useState } from "react";
import { register } from "../api/adapter";
import { validateRegister } from "../utils/validators";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // controlled form state
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // client-side validation
    const err = validateRegister(form);
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      const res = await register(form);
      // adapter returns { data: { user, token } }
      const payload = res.data;
      if (!payload || !payload.user || !payload.token) {
        throw new Error("Invalid server response");
      }
      // store user + token centrally
      login(payload.user, payload.token);
      // navigate to home or previous page
      navigate("/");
    } catch (err) {
      // prefer server message when available
      const msg = err?.message || err?.response?.data?.message || "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create account</h2>
      {error && <div className="bg-red-50 text-red-700 p-2 mb-3 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" value={form.name} onChange={onChange} placeholder="Full name" className="w-full border rounded px-3 py-2" />
        <input name="email" value={form.email} onChange={onChange} placeholder="Email" className="w-full border rounded px-3 py-2" />
        <input name="password" type="password" value={form.password} onChange={onChange} placeholder="Password" className="w-full border rounded px-3 py-2" />
        <button disabled={loading} className="w-full bg-primary text-white py-2 rounded">
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
