import { createContext,useState,useEffect, useContext,useMemo } from "react";
const CartContext=createContext();
export function CartProvider({children}){
  const [cart,setCart]=useState(()=>{
    try{
      const saved=localStorage.getItem("cart");
      return saved?JSON.parse(saved):[];
    }catch{
      return [];
    }
  });

  useEffect(()=>{
    localStorage.setItem("cart", JSON.stringify(cart),
  [cart])
  });
  
const addToCart=(product)=>{
  setCart((prev)=>{
    const existing=prev.find(item=>item.id===product.id);
    if(existing){
      return prev.map(item=>
        item.id===product.id?
          {...item, quantity: item.quantity+1}:
          item
      );
    } else{
      return[...prev, {...product, quantity:1}];
    }  
      })
    }

  const updateQuantity = (itemId, quantity) => {
    setCart((prev) => prev .map((item) => item.id === itemId ? 
      {
        ...item, quantity: Math.max(1, quantity) } : item ).filter((item) => item.quantity > 0) );
        };
  const removeItem = (itemId) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
   };

  const clearCart= ()=>setCart([]);
  // derived totals 
  const { totalItems, subtotal } = useMemo(() => { 
  const totalItems = cart.reduce((sum, i) => {
    const quantity=Number(i.quantity);
    return sum + quantity
  }, 0);
  const subtotal = cart.reduce((sum, i) =>{
    const price=Number(i.price);
    const quantity=Number(i.quantity);
    return sum + price * quantity}, 0);
  return { totalItems, subtotal }; }, [cart])

  const value={
        cart,
        setCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        subtotal
      };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
    }

  export function useCart(){
    const ctx=useContext(CartContext);
    if(!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
  }