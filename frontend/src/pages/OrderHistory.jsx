// src/pages/OrderHistory.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { getMyOrders } from "../api/orderAdapter";

export default function OrderHistory() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("You must be logged in to view your orders.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const data = await getMyOrders(token);
        
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) return <div>Loading your orders...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (orders.length === 0) return <div>You have no orders yet.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="border rounded p-4 bg-gray-50 shadow">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Order #{order.id}</span>
              <span className="text-sm text-gray-600">
                {console.log(order.created_at)}
                {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="mb-2">Status: <span className="font-medium">{order.status}</span></div>
            <div className="mb-2">Total: ${order.total}</div>
            <div className="border-t pt-2 mt-2">
              {order.OrderItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.Product?.name} x {Number(item.quantity)}</span>
                  <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
