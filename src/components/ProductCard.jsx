import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeart, 
  faEye, 
  faShoppingCart, 
  faPlus, 
  faMinus, 
  faTrash,
  faStar,
  faStarHalfAlt,
  faTruck,
  faCheckCircle,
  faExpand,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import './ProductCard.css';

const ProductCard = ({ product, showQuickActions = true, compact = false }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity, updateQuantity, removeFromCart } = useCart();

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

  // Функция для получения экономии
  const getSavings = (price, discount) => {
    if (!discount || discount === 0) return 0;
    return price * discount / 100;
  };

  // Получаем все изображения товара
  const getProductImages = () => {
    const images = [];
    
    // Основное изображение
    if (product.image) {
      images.push(product.image);
    }
    
    // Дополнительные изображения
    if (product.images && Array.isArray(product.images)) {
      images.push(...product.images);
    }
    
    // Если есть массив imagePath
    if (product.imagePaths && Array.isArray(product.imagePaths)) {
      images.push(...product.imagePaths);
    }
    
    // Если нет изображений, возвращаем пустой массив
    return images.length > 0 ? images : [null];
  };

  // Рендер звезд рейтинга
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className="star filled" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} className="star filled" />);
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faStar} className="star empty" />);
    }
    
    return stars;
  };

  const discountedPrice = getDiscountedPrice(product.price, product.discount);
  const savings = getSavings(product.price, product.discount);
  const hasDiscount = product.discount && product.discount > 0;
  const hasRating = product.rating && product.rating > 0;
  const productImages = getProductImages();
  const hasMultipleImages = productImages.length > 1;
  const currentImage = productImages[currentImageIndex];
  const cartQuantity = getItemQuantity(product.id);
  const inCart = isInCart(product.id);

  const handleQuickView = (e) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // Здесь можно добавить API вызов для сохранения в избранное
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleQuantityChange = (e, newQuantity) => {
    e.stopPropagation();
    if (newQuantity <= 0) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, newQuantity);
    }
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => 
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => 
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleImageClick = (e, index) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const handleExpandImage = (e) => {
    e.stopPropagation();
    setShowImageModal(true);
  };

  return (
    <>
      <div 
        className={`product-card ${compact ? 'compact' : ''} ${inCart ? 'in-cart' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Контейнер изображения */}
        <div className="product-image-container">
          {currentImage && !imageError ? (
            <img 
              src={getImageUrl(currentImage)} 
              alt={product.name}
              className={`product-image ${imageLoaded ? 'loaded' : ''} ${isHovered ? 'zoomed' : ''}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="product-image-placeholder">
              <FontAwesomeIcon icon={faShoppingCart} size="2x" />
              <span>FURNITURE SPACE</span>
            </div>
          )}
          
          {/* Навигация по изображениям */}
          {hasMultipleImages && (
            <>
              <button 
                className="image-nav prev"
                onClick={handlePrevImage}
                title="Предыдущее изображение"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button 
                className="image-nav next"
                onClick={handleNextImage}
                title="Следующее изображение"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
              
              {/* Индикаторы изображений */}
              <div className="image-indicators">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={(e) => handleImageClick(e, index)}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Наложение при наведении */}
          {isHovered && showQuickActions && (
            <div className="image-overlay">
              <div className="quick-actions">
                <button 
                  className="quick-action-btn favorite"
                  onClick={handleToggleFavorite}
                  title="Добавить в избранное"
                >
                  <FontAwesomeIcon icon={faHeart} className={isFavorite ? 'active' : ''} />
                </button>
                <button 
                  className="quick-action-btn expand"
                  onClick={handleExpandImage}
                  title="Увеличить изображение"
                >
                  <FontAwesomeIcon icon={faExpand} />
                </button>
                <button 
                  className="quick-action-btn view"
                  onClick={handleQuickView}
                  title="Быстрый просмотр"
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
              </div>
            </div>
          )}

          {/* Бейджи */}
          <div className="badges">
            {product.isNew && <span className="badge new">Новинка</span>}
            {hasDiscount && <span className="badge discount">-{product.discount}%</span>}
            {product.inStock === false && <span className="badge out-of-stock">Нет в наличии</span>}
            {product.isFeatured && <span className="badge featured">Хит</span>}
          </div>

          {/* Индикатор загрузки */}
          {!imageLoaded && !imageError && (
            <div className="image-loading">
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>
        
        {/* Информация о товаре */}
        <div className="product-info">
          <div className="product-header">
            <h3 className="product-name" title={product.name}>
              {product.name}
            </h3>
            
            {/* Категория */}
            {(product.categoryNavigation || product.category) && (
              <span className="product-category">
                {product.categoryNavigation?.name || product.category}
              </span>
            )}
          </div>

          {/* Рейтинг */}
          {hasRating && (
            <div className="product-rating">
              <div className="stars">
                {renderStars(product.rating)}
              </div>
              <span className="rating-value">({product.rating})</span>
            </div>
          )}

          {/* Краткое описание */}
          {product.description && !compact && (
            <p className="product-description">
              {product.description.length > 80 
                ? `${product.description.substring(0, 80)}...` 
                : product.description
              }
            </p>
          )}

          {/* Цены */}
          <div className="price-container">
            <div className="prices">
              {hasDiscount ? (
                <>
                  <span className="price-current">{formatPrice(discountedPrice)}</span>
                  <span className="price-old">{formatPrice(product.price)}</span>
                </>
              ) : (
                <span className="price-current">{formatPrice(product.price)}</span>
              )}
            </div>
            {hasDiscount && (
              <div className="savings">
                Экономия: {formatPrice(savings)}
              </div>
            )}
          </div>

          {/* Дополнительная информация */}
          <div className="product-features">
            {product.inStock !== false && (
              <div className="feature">
                <FontAwesomeIcon icon={faCheckCircle} className="icon success" />
                <span>В наличии</span>
              </div>
            )}
            {product.freeShipping && (
              <div className="feature">
                <FontAwesomeIcon icon={faTruck} className="icon" />
                <span>Бесплатная доставка</span>
              </div>
            )}
          </div>

          {/* Действия */}
          <div className="product-actions">
            {inCart ? (
              <div className="cart-controls">
                <button 
                  className="quantity-btn minus"
                  onClick={(e) => handleQuantityChange(e, cartQuantity - 1)}
                  title="Уменьшить количество"
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <span className="quantity-display">{cartQuantity}</span>
                <button 
                  className="quantity-btn plus"
                  onClick={(e) => handleQuantityChange(e, cartQuantity + 1)}
                  title="Увеличить количество"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
                <button 
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromCart(product.id);
                  }}
                  title="Удалить из корзины"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ) : (
              <button 
                className={`add-to-cart-btn ${product.inStock === false ? 'disabled' : ''}`}
                disabled={product.inStock === false}
                onClick={handleAddToCart}
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                {product.inStock !== false ? 'В корзину' : 'Нет в наличии'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно с увеличенным изображением */}
      {showImageModal && (
        <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-modal"
              onClick={() => setShowImageModal(false)}
            >
              ×
            </button>
            <img 
              src={getImageUrl(currentImage)} 
              alt={product.name}
              className="modal-image"
            />
            {hasMultipleImages && (
              <div className="modal-navigation">
                <button onClick={() => setCurrentImageIndex(prev => prev === 0 ? productImages.length - 1 : prev - 1)}>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <span>{currentImageIndex + 1} / {productImages.length}</span>
                <button onClick={() => setCurrentImageIndex(prev => prev === productImages.length - 1 ? 0 : prev + 1)}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard; 