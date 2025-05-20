import { useState } from 'react'
import './hero.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faHeart, faPhone, faSearch, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import strelkaImg from './assets/items/strelka.svg';

function Hero() {
    return (

        <>
            <div className='heroic'>heroheroheroherohero
            <img src={strelkaImg} alt="стрелка" style={{ width: 100, height: 100 }} />
            </div>
        </>
    )
}
export default Hero;