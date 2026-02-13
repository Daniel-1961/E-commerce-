// src/api/cartAdapter.js
export async function getMyCart(token) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/carts/my-cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch cart");
  return json.data; // { id, items, subtotal }
}

export async function addToCart(token, productId, quantity = 1) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/carts/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product_id: productId, quantity }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to add to cart");
  return json.data; // { cartItemId }
}

export async function updateCartItem(token, itemId, quantity) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/carts/update/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to update cart item");
  return json.data; // { id, quantity }
}

export async function removeCartItem(token, itemId) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/carts/item/${itemId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to remove item");
  return json; // success message
}

export async function clearCart(token) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/carts/clear`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to clear cart");
  return json; // success message
}
