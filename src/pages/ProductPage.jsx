import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, getImageUrl } from '../services/api';
import { useCart } from '../context/CartContext';
import App from '../App.jsx';
import Sidebar from '../sidebar.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Reviews from '../components/Reviews.jsx';
import './ProductPage.css';

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const { addToCart, getItemQuantity, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const productData = await productsAPI.getById(productId);
      setProduct(productData);
      
      // Загружаем похожие товары из той же категории
      if (productData.categoryId) {
        try {
          const categoryProducts = await productsAPI.getByCategory(productData.categoryId);
          // Исключаем текущий товар и берем максимум 4 похожих
          const filtered = categoryProducts
            .filter(p => p.id !== parseInt(productId))
            .slice(0, 4);
          setRelatedProducts(filtered);
        } catch (relatedError) {
          console.error('Ошибка загрузки похожих товаров:', relatedError);
        }
      }
    } catch (err) {
      console.error('Ошибка загрузки продукта:', err);
      setError('Не удалось загрузить информацию о продукте.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleUpdateQuantity = (newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, newQuantity);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  // Создаем массив изображений (основное + дополнительные если есть)
  const getProductImages = () => {
    const images = [];
    
    // Основное изображение
    if (product.image) {
      images.push(product.image);
    } else if (product.imagePath) {
      images.push(product.imagePath);
    }
    
    // Дополнительные изображения
    if (product.images && Array.isArray(product.images)) {
      images.push(...product.images);
    }
    
    if (product.additionalImages && Array.isArray(product.additionalImages)) {
      images.push(...product.additionalImages);
    }
    
    if (product.imagePaths && Array.isArray(product.imagePaths)) {
      images.push(...product.imagePaths);
    }
    
    return images.length > 0 ? images : [null];
  };

  const handleImageClick = () => {
    setShowImageModal(true);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex(prev => 
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex(prev => 
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <div>
        <div className="header-container">
          <App />
        </div>
        <div className="main-container">
          <div className="sidebar-container">
            <Sidebar />
          </div>
          <div className="product-page">
            <div className="loading">Загрузка продукта...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        <div className="header-container">
          <App />
        </div>
        <div className="main-container">
          <div className="sidebar-container">
            <Sidebar />
          </div>
          <div className="product-page">
            <div className="error-container">
              <h2>Ошибка</h2>
              <p>{error || 'Продукт не найден'}</p>
              <button onClick={goBack} className="back-btn">
                Назад
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const cartQuantity = getItemQuantity(product.id);
  const productImages = getProductImages();

  return (
    <div>
      <div className="header-container">
        <App />
      </div>
      <div className="main-container">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="product-page">
          <div className="product-container">
            <button onClick={goBack} className="back-btn">
              ← Назад
            </button>
            
            <div className="product-content">
              <div className="product-image-section">
                <div className="main-image-container">
                  <img
                    src={getImageUrl(productImages[selectedImageIndex])}
                    alt={product.name}
                    className="product-main-image"
                    onClick={handleImageClick}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0yMDAgMTQwQzE3NS4xMjUgMTQwIDE1NCAxNjEuMTI1IDE1NCAxODZTMTc1LjEyNSAyMzIgMjAwIDIzMlMyNDYgMjEwLjg3NSAyNDYgMTg2UzIyNC44NzUgMTQwIDIwMCAxNDBaTTIwMCAxNThDMjE0Ljg4IDE1OCAyMjggMTcxLjEyIDIyOCAxODZTMjE0Ljg4IDIxNCAyMDAgMjE0UzE3MiAyMDAuODggMTcyIDE4NlMxODUuMTIgMTU4IDIwMCAxNThaIiBmaWxsPSIjOTk5OTk5Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZVUk5JVFVSRSBTUEFDRTU8L3RleHQ+Cjwvc3ZnPgo=';
                    }}
                  />
                  
                  {/* Навигация по изображениям */}
                  {productImages.length > 1 && (
                    <>
                      <button 
                        className="image-nav-btn prev"
                        onClick={handlePrevImage}
                        title="Предыдущее изображение"
                      >
                        ‹
                      </button>
                      <button 
                        className="image-nav-btn next"
                        onClick={handleNextImage}
                        title="Следующее изображение"
                      >
                        ›
                      </button>
                    </>
                  )}
                  
                  {/* Индикатор увеличения */}
                  <div className="zoom-hint">🔍 Нажмите для увеличения</div>
                </div>
                
                {/* Миниатюры изображений */}
                {productImages.length > 1 && (
                  <div className="image-thumbnails">
                    {productImages.map((image, index) => (
                      <img
                        key={index}
                        src={getImageUrl(image)}
                        alt={`${product.name} ${index + 1}`}
                        className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                        onClick={() => setSelectedImageIndex(index)}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjBGMEYwIi8+Cjwvc3ZnPgo=';
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="product-info-section">
                <h1 className="product-title">{product.name}</h1>
                
                <div className="product-price-section">
                  <span className="product-price">{formatPrice(product.price)}</span>
                  {product.discountPrice && (
                    <>
                      <span className="original-price">{formatPrice(product.originalPrice)}</span>
                      <span className="discount-badge">-{Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
                    </>
                  )}
                </div>

                {/* Краткая информация */}
                <div className="product-quick-info">
                  {product.availability && (
                    <div className="availability-badge available">
                      ✓ В наличии
                    </div>
                  )}
                  {product.categoryName && (
                    <div className="product-category">
                      <span className="category-label">Категория:</span>
                      <span className="category-name">{product.categoryName}</span>
                    </div>
                  )}
                </div>

                <div className="product-description">
                  <h3>Описание</h3>
                  <p>{product.description || 'Описание товара отсутствует.'}</p>
                </div>

                {/* Характеристики товара */}
                {(product.material || product.dimensions || product.weight) && (
                  <div className="product-specifications">
                    <h3>Характеристики</h3>
                    <div className="specs-grid">
                      {product.material && (
                        <div className="spec-item">
                          <span className="spec-label">Материал:</span>
                          <span className="spec-value">{product.material}</span>
                        </div>
                      )}
                      {product.dimensions && (
                        <div className="spec-item">
                          <span className="spec-label">Размеры:</span>
                          <span className="spec-value">{product.dimensions}</span>
                        </div>
                      )}
                      {product.weight && (
                        <div className="spec-item">
                          <span className="spec-label">Вес:</span>
                          <span className="spec-value">{product.weight}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="product-actions">
                  {cartQuantity > 0 ? (
                    <div className="quantity-controls">
                      <button 
                        onClick={() => handleUpdateQuantity(cartQuantity - 1)}
                        className="quantity-btn minus"
                      >
                        -
                      </button>
                      <span className="quantity">{cartQuantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(cartQuantity + 1)}
                        className="quantity-btn plus"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={handleAddToCart}
                      className="add-to-cart-btn-large"
                    >
                      Добавить в корзину
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Похожие товары */}
            {relatedProducts.length > 0 && (
              <div className="related-products-section">
                <h2>Похожие товары</h2>
                <div className="related-products-grid">
                  {relatedProducts.map(relatedProduct => (
                    <ProductCard key={relatedProduct.id} product={relatedProduct} />
                  ))}
                </div>
              </div>
            )}

            {/* Отзывы */}
            <Reviews productId={product.id} productName={product.name} />
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
              src={getImageUrl(productImages[selectedImageIndex])} 
              alt={product.name}
              className="modal-image"
            />
            {productImages.length > 1 && (
              <div className="modal-navigation">
                <button onClick={handlePrevImage}>
                  ‹
                </button>
                <span>{selectedImageIndex + 1} / {productImages.length}</span>
                <button onClick={handleNextImage}>
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage; 