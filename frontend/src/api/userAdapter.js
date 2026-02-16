// src/api/userAdapter.js
export async function getUserProfile(token) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch profile");
  return json.data;
}

export async function updateProfile(token, updates) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to update profile");
  return json.data;
}
