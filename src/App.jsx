import { useState } from 'react'
import './App.css'

function App() {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <>
    <header>
      <div className="header">
        <div className="logo">
          <img src="./public/images/logo.jpg" alt="logo" />
        </div>
        <div className='search'>
          <p>Поиск...</p>
          <button className={`sr-button ${isHovered ? 'hover' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          >
          </button>
        </div>
        <div className="fastnav">

        </div>
      </div>
    </header>
    </>
  )
}

export default App
