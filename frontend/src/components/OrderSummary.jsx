import { useCart } from "../contexts/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function OrderSummary() {
  const { cart, subtotal, totalItems,clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate=useNavigate();
  const handlePlaceOrder = () => { 
    if (!paymentMethod) { 
        alert("Please select a payment method before placing your order."); 
        return;    
    }
    clearCart();
    navigate("/order-confirmation", {state:{paymentMethod}})
  }
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

<div className="mt-4 space-y-2">
     <h3 className="text-md font-semibold mb-2">Payment Method</h3>
    <label className="flex items-center gap-2">
        <input type="radio" name="payment" value="bank" checked={paymentMethod === "bank"} onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Bank Transfer
        </label>

    <label className="flex items-center gap-2">
        <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Cash on Delivery
        </label>

    <label className="flex items-center gap-2">
        <input type="radio" name="payment" value="paypal" checked={paymentMethod === "paypal"} onChange={(e) => setPaymentMethod(e.target.value)}
        />
        PayPal
        </label>
</div>
<button className="mt-6 w-full bg-primary text-black py-2 rounded hover:opacity-90"
onClick={handlePlaceOrder}>
Place Order
</button>
</div>
  );
}
