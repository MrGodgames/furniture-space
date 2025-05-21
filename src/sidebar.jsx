import { useState } from 'react'
import './sidebar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faHeart, faPhone, faSearch, faShoppingCart, faUser, faHome, faBed } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

    function Sidebar() {
        return (
            <nav className="sidebar">
                <div className="sidebar-header">
                    <p>Категории</p>
                    </div>
                <div className="categories">
                    <Link to="/" className='categorybut'>
                        <FontAwesomeIcon icon={faHome} className='bar-buttonico'/>Главная
                    </Link>
                    <Link to="/" className='categorybut'>
                        <FontAwesomeIcon icon={faHome} className='bar-buttonico'/>Шкафы
                    </Link>
                    <Link to="/" className='categorybut'>
                        <FontAwesomeIcon icon={faBed} className='bar-buttonico'/>Диваны
                    </Link>
                </div>
            </nav>
        )
    }

export default Sidebar;
