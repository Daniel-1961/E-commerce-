// src/api/addressAdapter.js
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
  return json.data; // returns { id, ...fields }
}

export async function listAddresses(token) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/addresses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch addresses");
  return json.data; // array of addresses
}
