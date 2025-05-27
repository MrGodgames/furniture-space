import React, { useState } from 'react';
import './CategoryCard.css';

const CategoryCard = ({ category, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Получаем изображение категории (можно добавить поле image в базу данных позже)
  const getCategoryImage = () => {
    // Временно используем статические изображения на основе названия категории
    const categoryImages = {
      'шкафы': 'https://ruminatop.ru/uploads/731d6c18-bfe2-4137-978e-b9df79600621.jpeg',
      'кровати': 'https://ruminatop.ru/uploads/8d13e5fe-cf55-4ff5-9378-770abffed59e.png',
      'кухни': 'https://ruminatop.ru/uploads/kitchen-placeholder.jpg',
      'стулья': 'https://ruminatop.ru/uploads/chair-placeholder.jpg',
      'тумбы': 'https://ruminatop.ru/uploads/cabinet-placeholder.jpg',
      'прихожии': 'https://ruminatop.ru/uploads/hallway-placeholder.jpg',
      'комоды': 'https://ruminatop.ru/uploads/dresser-placeholder.jpg',
      'туалетные столы': 'https://ruminatop.ru/uploads/vanity-placeholder.jpg',
      'тумбы обувные': 'https://ruminatop.ru/uploads/shoe-cabinet-placeholder.jpg'
    };

    const categoryName = category.name.toLowerCase();
    return categoryImages[categoryName] || null;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const imageUrl = getCategoryImage();

  return (
    <div 
      className="category-card" 
      onClick={() => onClick && onClick(category)}
    >
      <div className="category-image-container">
        {imageUrl && !imageError ? (
          <img 
            src={imageUrl} 
            alt={category.name}
            className="category-image"
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
        ) : (
          <div className="category-image category-placeholder">
            <span>{category.name.charAt(0).toUpperCase()}</span>
          </div>
        )}
      </div>
      <h2 className="category-name">{category.name}</h2>
    </div>
  );
};

export default CategoryCard; 