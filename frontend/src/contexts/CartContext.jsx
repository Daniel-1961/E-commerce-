// src/contexts/CartContext.jsx
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../api/cartAdapter";
import { useAuth } from "./AuthContexts";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useAuth(); // get JWT from AuthContext
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  // Load cart from backend on mount
  useEffect(() => {
    if (!token) {
      setCart([]);
      setSubtotal(0);
      return;
    }
    (async () => {
      try {
        const data = await getMyCart(token);
         refreshCart(data);
        setCart(normalized);
        setSubtotal(data.subtotal);
      } catch (err) {
        console.error("Failed to load cart:", err);
        setCart([]);
        setSubtotal(0);
      }
    })();
  }, [token]);

  // Actions
  const addItem = async (productId, quantity = 1) => {
    if (!token) return;
    await addToCart(token, productId, quantity);
    const data = await getMyCart(token);
    refreshCart(data);
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!token) return;
    await updateCartItem(token, itemId, quantity);
    const data = await getMyCart(token);
    refreshCart(data);
  };

  const removeItem = async (itemId) => {
    if (!token) return;
    await removeCartItem(token, itemId);
    const data = await getMyCart(token);
    refreshCart(data);
  };

  const clearAll = async () => {
    if (!token) return;
    await clearCart(token);
    setCart([]);
    setSubtotal(0);
  };

  const refreshCart = (data) => {
    const normalized = data.items.map((i) => ({
      id: i.id,
      name: i.product_name,
      price: i.unit_price,
      quantity: i.quantity,
      image:
        i.Product?.ProductImages?.[0]?.image_url ||
        "https://via.placeholder.com/100?text=no+image",
    }));
    setCart(normalized);
    setSubtotal(data.subtotal);
  };

  // Derived totals
  const totalItems = useMemo(
    () => cart.reduce((sum, i) => sum + i.quantity, 0),
    [cart]
  );

  const value = {
    cart,
    subtotal,
    totalItems,
    addItem,
    updateQuantity,
    removeItem,
    clearAll,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
