import { useLocation } from "react-router-dom";

export default function OrderConfirmation() {
  const { state } = useLocation();

  return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Order Placed Successfully 🎉</h1>
      <p>Your payment method: {state?.paymentMethod}</p>
      <p>Thank you for shopping with us!</p>
    </div>
  );
}
