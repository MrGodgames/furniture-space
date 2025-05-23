import { useState, useEffect } from 'react'
import './hero.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

const slides = [
  {
    image: "https://ruminatop.ru/hero.jpeg",
    title: "Купи себе что-то",
    description: "Всё что ты хочешь, у нас есть",
    buttonText: "Купить",
    url: "/catalog"
  },
  {
    image: "https://ruminatop.ru/about.jpg",
    title: "Новая коллекция",
    description: "Скидки до 50% на все товары",
    buttonText: "Смотреть",
    url: "/new-collection"
  },
  {
    image: "https://ruminatop.ru/uploads/9d58ebc8-13a2-4b25-973f-318366747f42.jpeg",
    title: "Ограниченное предложение",
    description: "Только этой неделей",
    buttonText: "Успеть",
    url: "/special-offer"
  }
];


function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    
    useEffect(() => {
      let interval;
      if (isAutoPlay) {
        interval = setInterval(() => {
          goToNextSlide();
        }, 5000);
      }
      return () => clearInterval(interval);
    }, [currentSlide, isAutoPlay]);
    
    const goToNextSlide = () => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };
    
    const goToPrevSlide = () => {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };
    
    const goToSlide = (index) => {
      setCurrentSlide(index);
      setIsAutoPlay(false);
      setTimeout(() => setIsAutoPlay(true), 10000);
    };
  
    return (
      <div className='heroic'>
        <div className='heroic-image'>
          {slides.map((slide, index) => (
            <img
              key={index}
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className={index === currentSlide ? 'active' : ''}
            />
          ))}
        </div>
        
        <div className='heroic-text'>
          <h1>{slides[currentSlide].title}</h1>
          <p>{slides[currentSlide].description}</p>
          <NavLink to={slides[currentSlide].url} className='heroic-button'>
            {slides[currentSlide].buttonText}
          </NavLink>
        </div>
        
        <button className='heroic-before' onClick={goToPrevSlide}>
          <FontAwesomeIcon icon={faChevronLeft}/>
        </button>
        
        <button className='heroic-next' onClick={goToNextSlide}>
          <FontAwesomeIcon icon={faChevronRight}/>
        </button>
        
        <div className="slide-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    )
  }
  
  export default Hero;