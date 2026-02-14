// src/api/orderAdapter.js
export async function createOrder(token, addressId, paymentMethod) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/orders/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ address_id: addressId, payment_method: paymentMethod }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to create order");
  return json.data; // full order object with items + address
}

export async function getMyOrders(token) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/orders/my-orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch orders");
  return json.data; // array of orders
}

export async function getOrderById(token, orderId) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch order");
  return json.data; // single order object
}

export async function updateOrderStatus(token, orderId, status) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/orders/${orderId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to update order status");
  return json.data;
}
