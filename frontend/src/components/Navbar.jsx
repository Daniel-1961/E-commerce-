// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { ShoppingCartIcon, HeartIcon, UserIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import categoriesJson from "../mock/categories.json";
import { useAuth } from "../contexts/AuthContexts";

export default function Navbar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlQ = searchParams.get("q") || "";
  const [searchQ, setSearchQ] = useState(urlQ);
  const categoryFromUrl = searchParams.get("category") || "";
  const [searchCategory, setSearchCategory] = useState(categoryFromUrl);

useEffect(() => {
  setSearchCategory(categoryFromUrl);
  setSearchQ(urlQ);
}, [categoryFromUrl,urlQ]);

  const {user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    const readCartCount = () => {
      try {
        const raw = localStorage.getItem("cart");
        if (!raw) return setCartCount(0);
        const items = JSON.parse(raw);
        const count = Array.isArray(items) ? items.reduce((s, it) => s + (it.quantity || 0), 0) : 0;
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };
    readCartCount();
    const onStorage = (e) => {
      if (e.key === "cart") readCartCount();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

 const onSubmitSearch = (e) => {
  e.preventDefault();

  const q = ( searchQ|| "").trim();
  const category = (searchCategory || "").trim();

  const params = new URLSearchParams();

  if (q) params.set("q", q);
  if (category) params.set("category", category);

  navigate(`/?${params.toString()}`);
};
  const handleLogout = () => {
    logout();
   // navigate("/login");
  };

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="text-2xl font-bold tracking-tight">
          <Link to="/">MyStore</Link>
        </div>
        {/* Desktop search (hidden on small screens) */}
        <div className="hidden md:flex flex-1 mx-8">
          <form onSubmit={onSubmitSearch} className="flex flex-1 items-center gap-2">
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Categories</option>
              { (categoriesJson.data || []).map(c => (
                <option key={c.id} value={String(c.id)}>{c.name}</option>
              )) }
            </select>
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-black rounded-md text-sm"
            >
              Search
            </button>
          </form>
        </div>

        {/* Icons and auth */}
        <div className="flex items-center gap-6 text-gray-700">
          {/* Wishlist */}
          <Link to="/wishlist" title="Wishlist" className="relative hover:text-black transition">
            <HeartIcon className="w-6 h-6" />
          </Link>
          <Link to="/cart" className="relative px-3 py-1 rounded hover:bg-gray-100">
            <ShoppingCartIcon className="w-7 h-7" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          </Link>

          {/* Account: show login/register or name+logout */}
          {!user ? (
            <>
              <Link to="/login" className="px-3 py-1 border rounded text-sm">Login</Link>
              <Link to="/register" className="px-3 py-1 bg-primary text-black rounded text-sm">Sign up</Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50">
                <UserIcon className="w-5 h-5" />
                <span className="text-sm">Hi, <span className="font-semibold">{user.name}</span></span>
              </div>
              <button onClick={handleLogout} className="text-sm text-red-500">Logout</button>
            </div>
          )}

          {/* Cart */}
          
        </div>
      </div>

      {/* Mobile search area (visible on small screens) */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={onSubmitSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="px-3 py-2 bg-primary text-black rounded">Go</button>
        </form>
      </div>
    </nav>
  );
}
