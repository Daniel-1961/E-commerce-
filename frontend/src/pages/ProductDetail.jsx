import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/adapter";
import categoriesJson from "../mock/categories.json"
import {useCart} from "../contexts/CartContext"

export default function ProductDetail()
{
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const categories = categoriesJson.data || [];
  const {addToCart}=useCart();

  useEffect(()=>{
    (async()=>{
      try{
        const res = await getProductById(id);
        setProduct(res.data || null);
      }catch(err){
        console.log("Failed to load the product:", err);
        setProduct(null);
      }

    })();

  }, [id]);

  if (!product) {
    return <div className="max-w-5xl mx-auto p-6">Loading product…</div>;
  }

  return(
     <div className="max-w-5xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <div>
          <div className="w-full h-80 rounded-xl overflow-hidden shadow">
            <img
              src={product.images?.[0] || "https://via.placeholder.com/800x600?text=image+not+found"}
              alt={product.name || "product"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/800x600?text=image+not+found";
              }}
            />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

          <p className="text-gray-600 text-sm mb-4">{product.description}</p>

          <div className="text-3xl font-bold mb-4">
            ${typeof product.price === 'number' ? product.price.toFixed(2) : "-"}
          </div>

          <div className="text-sm text-gray-700 mb-2">
            <span className="font-semibold">Stock:</span> {product.stock}
          </div>

          <div className="text-sm text-gray-700 mb-6">
            <span className="font-semibold">Category:</span> {categories.find(c => String(c.id) === String(product.category_id))?.name || "—"}
          </div>

        
          <button 
          className="px-6 py-3 bg-primary text-black rounded-2xl shadow hover: bg-dark opacity-90 transition"
          onClick={()=>
          addToCart({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.images?.[0],
            
          })
          
        }
      >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
    
  );
  
}
