import { useState } from 'react'
import './sidebar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faHeart, faPhone, faSearch, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';

    function Sidebar() {
        return (
            <nav className="sidebar">
                <div className="sidebar-header">
                    <p>Категории</p>
                    </div>
                <div className="categories">
                    <a className='categorybut'>Главная</a>
                    <a className='categorybut'>Шкафы</a>
                    <a className='categorybut'>Диваны</a>
                </div>
            </nav>
        )
    }

export default Sidebar;
