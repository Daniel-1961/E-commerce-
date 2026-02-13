// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProducts } from "../api/adapter";
import categoriesJson from "../mock/categories.json";

export default function Home() {
  const [searchParams] = useSearchParams();
  const urlQ = searchParams.get("q") || "";
  const urlCategory = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const categories = categoriesJson.data || [];

useEffect(() => {
  let mounted = true;
  (async () => {
    setLoading(true);
    try {
      const res = await getProducts({ q: urlQ, category_id: urlCategory || null });
      if (!mounted) return;

      // Normalize backend response
      const normalized = res.data.map(p => ({
        ...p,
        images: p.ProductImages?.map(img => img.image_url) || [],
        category_id: p.Category?.id,
        category_name: p.Category?.name,
      }));
    console.log(normalized);
      setProducts(normalized);
      
    } catch (err) {
      console.error("Failed to load products:", err);
      if (mounted) setProducts([]);
    } finally {
      if (mounted) setLoading(false);
    }
  })();
  return () => { mounted = false; };
}, [urlQ, urlCategory]);


  return (
    <div>
      { (urlQ || urlCategory) && (
        <div className="mb-4 text-sm text-muted">
          Showing results {urlQ ? `for "${urlQ}"` : ""} {urlCategory ? `in ${categories.find(c => String(c.id) === String(urlCategory))?.name || ""}` : ""}
        </div>
      )}

      {loading ? (
        <div>Loading products…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.length === 0 && <div className="text-muted">No products found.</div>}
          {products.map(p => (
            <Link key={p.id} to={`/product/${p.id}`} className="hover:shadow-md">
            <div className="bg-white rounded shadow p-3 flex flex-col">
              <div className="h-40 mb-3 overflow-hidden rounded">
                <img
                  src={p.images[0]}
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
                <div className="font-bold">${Number(p.price)}</div>
                <div className="text-xs text-muted">Stock: {p.stock}</div>
              </div>
              <div className="text-xs text-muted mt-1">Category: {p.category_name || "—"}</div>
            </div>
            </Link>
          ))
          }
        </div>
      )}
    </div>
  );
}
