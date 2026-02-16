// src/pages/AddressManagement.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { listAddresses, updateAddress } from "../api/addressAdapter";

export default function AddressManagement() {
  const { token } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const data = await listAddresses(token);
        setAddresses(data);
        
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [token]);
  console.log(addresses);

  const handleEdit = (address) => {
    setEditingId(address.id);
    setForm(address);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const updated = await updateAddress(token, editingId, form);
      setAddresses(addresses.map(a => a.id === editingId ? updated : a));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-4">
    
      {error && <div className="text-red-600">{error}</div>}
      {addresses.length === 0 && <p>No addresses saved yet.</p>}

      {addresses.map(addr => (
        <div key={addr.id} className="border rounded p-4 bg-gray-50">
          {editingId === addr.id ? (
            <div className="space-y-2">
              <input name="street" value={form.street || ""} onChange={handleChange} className="border p-2 w-full" />
              <input name="city" value={form.city || ""} onChange={handleChange} className="border p-2 w-full" />
              <input name="postal_code" value={form.postal_code || ""} onChange={handleChange} className="border p-2 w-full" />
              <input name="country" value={form.country || ""} onChange={handleChange} className="border p-2 w-full" />
              <button onClick={handleSave} className="bg-primary text-black px-4 py-2 rounded">Save</button>
            </div>
          ) : (
            <div>
              <p>{addr.street}</p>
              <p>{addr.city}, {addr.postal_code}</p>
              <p>{addr.country}</p>
              <button onClick={() => handleEdit(addr)} className="mt-2 text-blue-600 underline">Edit</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
