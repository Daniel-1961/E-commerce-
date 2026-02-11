import { useCart } from "../context/CartContext";

export default function OrderSummary() {
  const { cart, subtotal, totalItems } = useCart();

  return (
    <div className="border rounded p-6 bg-gray-50 shadow">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

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

      <button className="mt-6 w-full bg-primary text-white py-2 rounded hover:opacity-90">
        Place Order
      </button>
    </div>
  );
}
