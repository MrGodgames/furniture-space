import { useState } from 'react'
import './hero.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faHeart, faPhone, faSearch, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import strelkaImg from './assets/items/strelka.svg';

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
                <img src={strelkaImg} alt="стрелка" style={{ width: 100, height: 100 }} className='heroic-before'/>
                <img src={strelkaImg} alt="стрелка" style={{ width: 100, height: 100 }} className='heroic-next'/>
            </div>
        </>
    )
}
export default Hero;