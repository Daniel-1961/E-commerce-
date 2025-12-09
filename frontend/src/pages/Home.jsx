// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { getProducts } from "../api/adapter";
import categoriesJson from "../mock/categories.json"; // for category name lookup

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const categories = categoriesJson.data || [];

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await getProducts({ q, category_id: categoryId || null });
        if (!mounted) return;
        setProducts(res.data || []);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [q, categoryId]);

  return (
    <div>
      <div className="flex gap-3 items-center mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products..."
          className="border px-3 py-2 rounded w-full"
        />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="border px-3 py-2 rounded">
          <option value="">All categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div>Loading products…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.length === 0 && <div className="text-muted">No products found.</div>}
          {products.map(p => (
            <div key={p.id} className="bg-white rounded shadow p-3 flex flex-col">
              <div className="h-40 mb-3 overflow-hidden rounded">
                <img
                  src={p.images?.[0] || "https://via.placeholder.com/600x400?text=no+image"}
                  alt={p.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/600x400?text=img+not+found"; }}
                />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm mb-1">{p.name}</div>
                <div className="text-xs text-muted mb-2">{p.description}</div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="font-bold">${p.price.toFixed(2)}</div>
                <div className="text-xs text-muted">Stock: {p.stock}</div>
              </div>
              <div className="text-xs text-muted mt-1">Category: {categories.find(c => c.id === p.category_id)?.name || "—"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
