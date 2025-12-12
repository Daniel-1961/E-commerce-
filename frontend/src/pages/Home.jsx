// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../api/adapter";
import categoriesJson from "../mock/categories.json";

export default function Home() {
  // read and set URL search params (react-router hook)
  const [searchParams, setSearchParams] = useSearchParams();

  // q is the query from URL, we keep local state synced for the input
  const urlQ = searchParams.get("q") || "";
  const urlCategory = searchParams.get("category") || "";

  const [q, setQ] = useState(urlQ); // visible input value
  const [categoryId, setCategoryId] = useState(urlCategory);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const categories = categoriesJson.data || [];

  // When URL params change (back/forward or manual), update local input state
  useEffect(() => {
    setQ(urlQ);
    setCategoryId(urlCategory);
  }, [urlQ, urlCategory]);

  // Fetch products whenever the URL params (q/category) change.
  // This keeps the displayed list in sync with the URL, not just the local input.
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        // read q and category straight from URL values (so we always reflect URL)
        const res = await getProducts({ q: urlQ, category_id: urlCategory || null });
        if (!mounted) return;
        setProducts(res.data || []);
      } catch (err) {
        console.error("Failed to load products:", err);
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [urlQ, urlCategory]);

  // When the user submits the search form, update the URL.
  // This causes the fetch effect above to re-run.
  const onSearchSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (q && q.trim()) params.q = q.trim();
    if (categoryId) params.category = categoryId;
    setSearchParams(params);
    // no direct fetch here — effect watching URL will fetch
  };

  // If user changes category via select, immediately update URL (and results).
  const onCategoryChange = (e) => {
    const val = e.target.value;
    setCategoryId(val);
    const params = {};
    if (q && q.trim()) params.q = q.trim();
    if (val) params.category = val;
    setSearchParams(params);
  };

  return (
    <div>
      <form onSubmit={onSearchSubmit} className="flex gap-3 items-center mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products..."
          className="border px-3 py-2 rounded w-full"
        />
        <select value={categoryId} onChange={onCategoryChange} className="border px-3 py-2 rounded">
          <option value="">All categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button type="submit" className="px-3 py-2 bg-primary text-white rounded">Search</button>
      </form>

      {loading ? (
        <div>Loading products…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.length === 0 && <div className="text-muted">No products found.</div>}
          {products.map(p => (
            <div key={p.id} className="bg-white rounded shadow p-3 flex flex-col">
              <div className="h-40 mb-3 overflow-hidden rounded">
                <img
                  src={p.images?.[0] || "https://via.placeholder.com/800x600?text=no+image"}
                  alt={p.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/800x600?text=image+not+found"; }}
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
