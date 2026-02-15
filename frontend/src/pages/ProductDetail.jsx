import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/adapter";
import { useCart } from "../contexts/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart(); // from CartContext
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await getProductById(id);
        const normalized = {
          ...res,
          images: res.ProductImages?.map(img => img.image_url) || [],
          category_id: res.Category?.id,
          category_name: res.Category?.name,
        };
        if (mounted) setProduct(normalized);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load product");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div>Loading product…</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!product) return <div>No product found.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white rounded shadow p-6">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <div className="flex gap-4">
        <div className="w-1/2">
          {product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-auto rounded"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/800x600?text=image+not+found"; }}
            />
          ) : (
            <div className="text-muted">No image available</div>
          )}
        </div>
        <div className="flex-1">
          <p className="mb-2">{product.description}</p>
          <p className="font-bold text-lg mb-2">${product.price}</p>
          <p className="text-sm text-muted mb-2">Stock: {product.stock}</p>
          <p className="text-sm text-muted">Category: {product.category_name || "—"}</p>

          {/* Add to Cart button */}
          <button
            className="mt-4 px-6 py-2 bg-primary text-black rounded"
            onClick={() => addItem(product.id, 1)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
