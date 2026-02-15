// src/components/BillingForm.jsx
import { useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { addAddress } from "../api/addressAdapter";

export default function BillingForm({ onAddressSaved }) {
  const { token } = useAuth();
  const [form, setForm] = useState({ street: "", city: "", postal_code: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("You must be logged in to add an address.");
      return;
    }
    setLoading(true);
    try {
      const address = await addAddress(token, form);
      onAddressSaved(address.id); // pass id up to Checkout
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded bg-gray-50">
      <h2 className="text-lg font-semibold">Billing / Delivery Address</h2>
      {error && <div className="text-red-600">{error}</div>}
      <input
        type="text"
        name="street"
        placeholder="Street"
        value={form.street}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        value={form.city}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="postal_code"
        placeholder="ZIP Code"
        value={form.postal_code}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-black px-4 py-2 rounded"
      >
        {loading ? "Saving..." : "Save Address"}
      </button>
    </form>
  );
}
