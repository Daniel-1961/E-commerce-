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
  }