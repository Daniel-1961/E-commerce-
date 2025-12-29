import { createContext,useState,useEffect } from "react";
const CartContext=createContext(null);
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
    localStorage.setItem("cart",JSON.stringify(cart),
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
      return[...prev,{...product,quantity:product.quantity+1}];
    }
        
        
      })
    }
  
  const updateQuantity=(itemId,quantity)=>{
    setCart((prev)=>prev.map(item=>
      item.id===itemId?{...item, quantity:Math.max(1,quantity)}:item
    ).filter(item=>item.quantity>0)

    )
  }
  const removeItem=(itemId)=>{
    setCart((prev)=>prev.filter(item=>item.id!==itemId));
  }
  const clearCart=()=>setCart([]);

  //hooks that manages calculation between different renders;
  const {totalItems, subTotal}=useMemo(()=>{
    const totalItems=cart.reduce((sum,i)=>sum+i.quantity,0)
  const subTotal=cart.reduce((sum,i)=>sum+i.price*i.quantity,0);
  return {totalItems,subTotal}
},[cart])

const values={
  cart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
  totalItems,
  subTotal
};
return <CartContext.Provider values={values}>{children}</CartContext.Provider>
}
export function useCart() {
   const ctx = useContext(CartContext); 
   if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
   }