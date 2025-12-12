import React from "react";
export default function Navbar(){
  return(
<nav  className="w-full bg-white shadow-sm sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
    <div>
      MyStore
    </div>
    <div className="hidden md:flex flex-1 mx-6">
      <input type="text"
      placeholder="Searching products"
      className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
       />
    </div>
    <div>
      <button>Login</button>
      <button>Favorite</button>
      <button>Cart</button>
    </div>

  </div>
</nav>

  )
}