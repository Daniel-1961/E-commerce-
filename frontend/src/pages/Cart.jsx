import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, updateQuantity, removeItem, subtotal, totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart ({totalItems} items)</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 border rounded mb-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/100?text=no+image";
                }}
              />
              <div className="flex-1">
                <div className="font-semibold">{item.name}</div>
                <div>${item.price}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-2 py-1 border rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-600 ml-4"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-6 text-right">
            <div className="text-lg font-semibold">
              Subtotal: ${subtotal.toFixed(2)}
            </div>

            <button
              className="mt-4 px-6 py-2 bg-primary text-black rounded"
              onClick={() => navigate("/checkout")}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
