import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Функция для форматирования цены
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Функция для вычисления цены со скидкой
  const getDiscountedPrice = (price, discount) => {
    if (!discount || discount === 0) return price;
    return price - (price * discount / 100);
  };

  // Получаем основное изображение
  const getMainImage = () => {
    if (product.image) return product.image;
    if (product.images && product.images.length > 0) return product.images[0];
    return null;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const discountedPrice = getDiscountedPrice(product.price, product.discount);
  const hasDiscount = product.discount && product.discount > 0;
  const hasRating = product.rating && product.rating > 0;
  const imageUrl = getMainImage();

  return (
    <div className="product-card">
      <div className="product-image-container">
        {imageUrl && !imageError ? (
          <img 
            src={imageUrl} 
            alt={product.name}
            className="product-image"
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
        ) : (
          <div className="product-image product-placeholder">
            <span>{product.name.charAt(0).toUpperCase()}</span>
          </div>
        )}
        {product.isNew && <span className="badge new-badge">Новинка</span>}
        {hasDiscount && <span className="badge discount-badge">-{product.discount}%</span>}
        {product.inStock === false && <span className="badge out-of-stock-badge">Нет в наличии</span>}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        {product.categoryNavigation && (
          <p className="product-category">Категория: {product.categoryNavigation.name}</p>
        )}
        
        <div className="product-price-container">
          {hasDiscount ? (
            <>
              <span className="product-price-old">{formatPrice(product.price)}</span>
              <span className="product-price">{formatPrice(discountedPrice)}</span>
            </>
          ) : (
            <span className="product-price">{formatPrice(product.price)}</span>
          )}
        </div>

        {hasRating && (
          <div className="product-rating">
            <span className="rating-stars">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </span>
            <span className="rating-value">({product.rating})</span>
          </div>
        )}

        <button 
          className={`product-buy-button ${product.inStock === false ? 'disabled' : ''}`}
          disabled={product.inStock === false}
        >
          {product.inStock !== false ? 'Купить' : 'Нет в наличии'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 