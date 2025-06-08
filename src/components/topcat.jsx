import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWarehouse, 
  faBed, 
  faCouch, 
  faChair,
  faImage,
  faTable,
  faGem
} from '@fortawesome/free-solid-svg-icons';
import './topcat.css';

const TopCat = () => {
  const navigate = useNavigate();
  const [imageLoadStates, setImageLoadStates] = useState({});

  const topCategories = [
    {
      id: 'wardrobes',
      name: 'Шкафы',
      image: 'https://ruminatop.ru/uploads/731d6c18-bfe2-4137-978e-b9df79600621.jpeg',
      path: '/catalog/wardrobes',
      icon: faWarehouse,
      description: 'Современные и просторные'
    },
    {
      id: 'beds',
      name: 'Кровати',
      image: 'https://ruminatop.ru/uploads/8d13e5fe-cf55-4ff5-9378-770abffed59e.png',
      path: '/catalog/beds',
      icon: faBed,
      description: 'Комфорт для здорового сна'
    },
    {
      id: 'sofas',
      name: 'Диваны',
      image: 'https://ruminatop.ru/uploads/9d58ebc8-13a2-4b25-973f-318366747f42.jpeg',
      path: '/catalog/sofas',
      icon: faCouch,
      description: 'Уют и релаксация'
    },
    {
      id: 'tables',
      name: 'Столы',
      image: 'https://ruminatop.ru/hero.jpeg',
      path: '/catalog/tables',
      icon: faTable,
      description: 'Функциональность и стиль'
    },
    {
      id: 'chairs',
      name: 'Стулья',
      image: 'https://ruminatop.ru/about.jpg',
      path: '/catalog/chairs',
      icon: faChair,
      description: 'Эргономика и дизайн'
    },
    {
      id: 'decor',
      name: 'Декор',
      image: 'https://ruminatop.ru/uploads/731d6c18-bfe2-4137-978e-b9df79600621.jpeg',
      path: '/catalog/decor',
      icon: faGem,
      description: 'Завершающие штрихи'
    }
  ];

  const handleCategoryClick = (category) => {
    navigate(category.path);
  };

  const handleImageLoad = (categoryId) => {
    setImageLoadStates(prev => ({
      ...prev,
      [categoryId]: 'loaded'
    }));
  };

  const handleImageError = (categoryId) => {
    setImageLoadStates(prev => ({
      ...prev,
      [categoryId]: 'error'
    }));
  };

  const getImageState = (categoryId) => {
    return imageLoadStates[categoryId] || 'loading';
  };

  return (
    <div className="topcatalog">
      <div className="topcatalog-header">
        <h1>Популярные категории</h1>
        <p className="topcatalog-subtitle">Откройте для себя лучшую мебель для вашего дома</p>
      </div>
      
      <div className="topcatalog-container">
        {topCategories.map((category, index) => (
          <div 
            key={category.id}
            className={`topcategory-item ${getImageState(category.id)}`}
            onClick={() => handleCategoryClick(category)}
            role="button"
            tabIndex={0}
            style={{ '--animation-delay': `${index * 0.1}s` }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCategoryClick(category);
              }
            }}
          >
            <div className="category-image-container">
              {getImageState(category.id) === 'loading' && (
                <div className="image-skeleton">
                  <FontAwesomeIcon icon={faImage} />
                </div>
              )}
              
              {getImageState(category.id) === 'error' ? (
                <div className="image-fallback">
                  <FontAwesomeIcon icon={category.icon} />
                  <span>Изображение недоступно</span>
                </div>
              ) : (
                <img 
                  src={category.image} 
                  alt={category.name}
                  onLoad={() => handleImageLoad(category.id)}
                  onError={() => handleImageError(category.id)}
                  style={{ 
                    opacity: getImageState(category.id) === 'loaded' ? 1 : 0 
                  }}
                />
              )}
              
              <div className="category-overlay">
                <FontAwesomeIcon icon={category.icon} className="category-icon" />
              </div>
            </div>
            
            <div className="category-content">
              <h2>{category.name}</h2>
              <p className="category-description">{category.description}</p>
              <div className="category-action">
                <span>Посмотреть →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCat;  