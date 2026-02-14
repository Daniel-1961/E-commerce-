import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContexts";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/orderAdapter";

export default function OrderSummary({ addressId }) {
  const { cart, subtotal, totalItems } = useCart();
  const { token } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (!addressId) {
      setError("Please save your delivery address first.");
      return;
    }
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }
    setLoading(true);
    try {
      const order = await createOrder(token, addressId, paymentMethod);
      navigate("/order-confirmation", { state: { order } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded p-6 bg-gray-50 shadow">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}

      {cart.map(item => (
        <div key={item.id} className="flex justify-between mb-2">
          <span>{item.name} x {item.quantity}</span>
          <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
        </div>
      ))}

      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between font-semibold">
          <span>Subtotal ({totalItems} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="text-md font-semibold mb-2">Payment Method</h3>
        {["wallet", "cod", "card"].map(method => (
          <label key={method} className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value={method}
              checked={paymentMethod === method}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            {method}
          </label>
        ))}
      </div>

      <button
        className="mt-6 w-full bg-primary text-black py-2 rounded hover:opacity-90"
        onClick={handlePlaceOrder}
        disabled={loading}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
