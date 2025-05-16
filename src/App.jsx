import { useState } from 'react'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faSearch } from '@fortawesome/free-solid-svg-icons';


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
            <FontAwesomeIcon icon={faSearch} color='white'/>
          </button>
        </div>
        <div className='phonenumber'>
          <FontAwesomeIcon icon={faPhone}/>
          <p>8 (800) 555-35-35</p>
        </div>
        <div className="fastnav">
        </div>
      </div>
    </header>
    </>
  )
}

export default App
