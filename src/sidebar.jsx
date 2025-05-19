import { useState } from 'react'
import './sidebar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faHeart, faPhone, faSearch, faShoppingCart, faUser, faHome, faBed } from '@fortawesome/free-solid-svg-icons';

    function Sidebar() {
        return (
            <nav className="sidebar">
                <div className="sidebar-header">
                    <p>Категории</p>
                    </div>
                <div className="categories">
                    <a className='categorybut'><FontAwesomeIcon icon={faHome} className='bar-buttonico'/>Главная</a>
                    <a className='categorybut'><FontAwesomeIcon icon={faHome} className='bar-buttonico'/>Шкафы</a>
                    <a className='categorybut'><FontAwesomeIcon icon={faBed} className='bar-buttonico'/>Диваны</a>
                </div>
            </nav>
        )
    }

export default Sidebar;
