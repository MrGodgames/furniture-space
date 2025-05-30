import { useState } from 'react'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faHeart, faPhone, faSearch, faShoppingCart, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { useCart } from './context/CartContext.jsx';

function App() {
  const [isHovered, setIsHovered] = useState(false)
  const { isAuthenticated, user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  
  return (
    <>
    <header>
      <div className="header">
        <div className="logo">
          <img src="./src/assets/images/logo.png" alt="logo" />
        </div>
        <div className='search'>
          <input type="text" placeholder='Поиск...' className='search-input' />

          <button className={`sr-button ${isHovered ? 'hover' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          >
            <FontAwesomeIcon icon={faSearch} color='white'/>
          </button>
        </div>
        <div className='phonenumber'>
          <FontAwesomeIcon icon={faPhone} className='phonenumberico'/>
          <p>8 (800) 555-35-35</p>
        </div>
        <div className="fastnav">
          <NavLink to="/favorites" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
            <FontAwesomeIcon icon={faHeart} />
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
            <FontAwesomeIcon icon={faAddressBook} />
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
            <div className="cart-icon-container">
              <FontAwesomeIcon icon={faShoppingCart} />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </div>
          </NavLink>
          {isAuthenticated ? (
            <div className="user-menu">
              <NavLink to="/profile" className="nav-link user-profile">
                <FontAwesomeIcon icon={faUser} />
                {user?.name}
              </NavLink>
              {user?.role === 'admin' && (
                <NavLink to="/admin" className="nav-link admin-panel">
                  ⚙️ Админ панель
                </NavLink>
              )}
              <button onClick={logout} className="logout-btn">
                Выйти
              </button>
            </div>
          ) : (
            <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
              <FontAwesomeIcon icon={faUser} />
            </NavLink>
          )}
        </div>
      </div>
    </header>
    </>
  )
}

export default App
