import BillingForm from "../components/BillingForm";
import OrderSummary from "../components/OrderSummary";

export default function Checkout() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column: Billing + Delivery */}
        <div>
          <BillingForm />
        </div>
        
        <div>
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
