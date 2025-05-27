import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Sidebar from './sidebar.jsx'
import Hero from './hero.jsx'
import Cart from './pages/cart.jsx'
import About from './pages/about.jsx'
import Profile from './pages/profile.jsx'
import Catalog from './pages/catalog.jsx'
import Filter from './components/filter.jsx'
import TopCat from './components/topcat.jsx'

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
      </div>
      </div>
  </div>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorites" element={<Cart />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/new-collection" element={<Catalog />} />
        <Route path="/special-offer" element={<Catalog />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
