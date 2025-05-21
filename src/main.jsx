import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Sidebar from './sidebar.jsx'
import Hero from './hero.jsx'
import Cart from './pages/cart.jsx'
import About from './pages/about.jsx'

const Home = () => (
  <div className='maincontent'>
    <Sidebar />
    <Hero />
  </div>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
