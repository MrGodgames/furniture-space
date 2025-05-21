import { useState } from 'react'
import './hero.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faArrowRight, faArrowRightLong, faChevronLeft, faChevronRight, faHeart, faPhone, faSearch, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';

function Hero() {
    return (

        <>
            <div className='heroic'>
                <div className='heroic-image'>
                    <img src="https://ruminatop.ru/hero.jpeg" alt="heroimg" />
                </div>
                <div className='heroic-text'>
                    <h1>Купи себе что-то</h1>
                    <p>Всё что ты хочешь, у нас есть</p>
                    <button className='heroic-button'>Купить</button>
                </div>
                <button className='heroic-before'><i><FontAwesomeIcon icon={faChevronLeft}/></i></button>
                <button className='heroic-next'><i><FontAwesomeIcon icon={faChevronRight}/></i></button>
            </div>
        </>
    )
}
export default Hero;