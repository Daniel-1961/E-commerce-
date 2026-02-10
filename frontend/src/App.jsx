import { CartProvider } from './contexts/CartContext.jsx'
import {Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Navbar from './components/Navbar.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
function App() {
  

  return (
    <> 
    <CartProvider>
      <Navbar />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
        </Routes>
    </CartProvider>
       
    </>
  )
}

export default App
