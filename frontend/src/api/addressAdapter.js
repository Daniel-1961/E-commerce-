// src/api/addressAdapter.js

export async function listAddresses(token) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/users/addresses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch addresses");
  return json.data;
}

export async function addAddress(token, addressData) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/users/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(addressData),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to add address");
  return json.data;
}

export async function updateAddress(token, id, addressData) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/users/addresses/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(addressData),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to update address");
  return json.data;
}

