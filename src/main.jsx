import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Sidebar from './sidebar.jsx'
import Hero from './hero.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <div className='maincontent'>
    <Sidebar />
    <Hero />
    </div>
  </StrictMode>,
)
