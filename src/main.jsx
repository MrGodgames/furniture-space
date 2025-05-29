import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import App from './App.jsx'
import Sidebar from './sidebar.jsx'
import Hero from './hero.jsx'
import Cart from './pages/cart.jsx'
import About from './pages/about.jsx'
import Profile from './pages/profile.jsx'
import Login from './pages/login.jsx'
import Catalog from './pages/catalog.jsx'
import Filter from './components/filter.jsx'
import TopCat from './components/topcat.jsx'
import NewProduct from './components/newproduct.jsx'

const Home = () => (
  <div>
    <div  className='header-container'>
      <App />
    </div>
    <div  className='main-container'>
    <div className='sidebar-container'>
      <Sidebar />
      </div>
      <div className='maincontent'>
      <Hero />
      <TopCat />
      <NewProduct />
      </div>
      </div>
  </div>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<Cart />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/new-collection" element={<Catalog />} />
            <Route path="/special-offer" element={<Catalog />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
