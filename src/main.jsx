import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './variables.css'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import App from './App.jsx'
import Sidebar from './sidebar.jsx'
import Hero from './hero.jsx'
import Cart from './pages/cart.jsx'
import Checkout from './pages/Checkout.jsx'
import About from './pages/about.jsx'
import Profile from './pages/profile.jsx'
import Login from './pages/login.jsx'
import Catalog from './pages/catalog.jsx'
import SearchPage from './pages/SearchPage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import Filter from './components/filter.jsx'
import TopCat from './components/topcat.jsx'
import NewProduct from './components/newproduct.jsx'
import Features from './components/Features.jsx'
import Register from './pages/register.jsx'
import AdminLayout from './components/AdminLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminProducts from './pages/admin/AdminProducts.jsx'
import AdminOrders from './pages/admin/AdminOrders.jsx'
import AdminStatistics from './pages/admin/AdminStatistics.jsx'
import Footer from './components/Footer.jsx'
import './fixes.css'

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
      <Features />
      </div>
      </div>
      <div className='footer-container'>
        <Footer />
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
            <Route path="/search" element={<SearchPage />} />
            <Route path="/product/:productId" element={<ProductPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<Cart />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:categorySlug" element={<Catalog />} />
            <Route path="/new-collection" element={<Catalog />} />
            <Route path="/special-offer" element={<Catalog />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="statistics" element={<AdminStatistics />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
