import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Sidebar from './sidebar.jsx'
import Maincont from './maincont.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Sidebar />
    <Maincont />
  </StrictMode>,
)
