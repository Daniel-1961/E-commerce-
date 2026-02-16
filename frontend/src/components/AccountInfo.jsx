// src/components/AccountInfo.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { getUserProfile, updateProfile } from "../api/userAdapter";

export default function AccountInfo() {
  const { user, token } = useAuth(); // using AuthContext
  const [profile, setProfile] = useState(user || null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const data = await getUserProfile(token);
        setProfile(data);
        setForm({ name: data.name || "", email: data.email || "" });
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      const updated = await updateProfile(token, form);
      setProfile(updated);
      setSuccess("Profile updated successfully!");
      setError("");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const updated = await updateProfile(token, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setProfile(updated);
      setSuccess("Password updated successfully!");
      setError("");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="border rounded p-4 bg-gray-50 shadow space-y-6">
      <h2 className="text-lg font-semibold">Account Info</h2>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}

      {/* Update name/email */}
      <div>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="border p-2 w-full mb-2"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 w-full mb-2"
        />
        <button
          onClick={handleSaveProfile}
          className="bg-primary text-black px-4 py-2 rounded"
        >
          Save Profile
        </button>
      </div>

      {/* Update password */}
      <div>
        <h3 className="text-md font-semibold mb-2">Change Password</h3>
        <input
          type="password"
          name="currentPassword"
          value={passwordForm.currentPassword}
          onChange={handlePasswordChange}
          placeholder="Current Password"
          className="border p-2 w-full mb-2"
        />
        <input
          type="password"
          name="newPassword"
          value={passwordForm.newPassword}
          onChange={handlePasswordChange}
          placeholder="New Password"
          className="border p-2 w-full mb-2"
        />
        <button
          onClick={handleUpdatePassword}
          className="bg-primary text-black px-4 py-2 rounded"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
