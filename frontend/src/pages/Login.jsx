// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login as adapterLogin } from "../api/adapter"; // your adapter function
import { useAuth } from "../contexts/AuthContexts";   

// your AuthContext hook

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth(); // function to persist user+token and update app state

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If a protected route redirected user to /login, it may set `state.from`
  // After successful login we will redirect to that page (common UX)
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // basic client-side validation (fast feedback)
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
     const {user,token}=await adapterLogin({email,password});

      // persist user+token centrally using AuthContext
      authLogin(user, token);

      // redirect to the page the user wanted, or to home
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message||"Login failed");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>

      {error && <div className="mb-3 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-3">
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-black py-2 rounded disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
