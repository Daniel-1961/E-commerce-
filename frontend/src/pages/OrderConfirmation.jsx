// src/pages/OrderConfirmation.jsx
import { useLocation, Link } from "react-router-dom";

export default function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">No Order Found</h1>
        <p>It looks like you navigated here without placing an order.</p>
        <Link to="/" className="text-blue-600 underline">Go back to shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
      <p className="mb-2">Thank you! Your order has been placed successfully.</p>

      <div className="border rounded p-4 bg-gray-50 shadow mb-6">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Order #{order.id}</span>
          <span className="text-sm text-gray-600">
            {new Date(order.created_at).toLocaleDateString()}
          </span>
        </div>
        <div>Status: <span className="font-medium">{order.status}</span></div>
        <div>Total: ${order.total}</div>
      </div>

      <h2 className="text-lg font-semibold mb-2">Items</h2>
      <div className="border rounded p-4 bg-white shadow mb-6">
        {order.OrderItems.map(item => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.Product?.name} x {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
      <div className="border rounded p-4 bg-white shadow">
        <p>{order.Address?.street}</p>
        <p>{order.Address?.city}, {order.Address?.postal_code}</p>
        <p>{order.Address?.country}</p>
      </div>

      <div className="mt-6">
        <Link to="/orders" className="bg-primary text-black px-4 py-2 rounded">
          View My Orders
        </Link>
      </div>
    </div>
  );
}
