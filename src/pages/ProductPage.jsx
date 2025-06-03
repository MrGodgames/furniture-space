import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, getImageUrl } from '../services/api';
import { useCart } from '../context/CartContext';
import App from '../App.jsx';
import Sidebar from '../sidebar.jsx';
import './ProductPage.css';

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, getCartItemQuantity, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const productData = await productsAPI.getById(productId);
      setProduct(productData);
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

  const cartQuantity = getCartItemQuantity(product.id);

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
                <img
                  src={getImageUrl(product.imagePath)}
                  alt={product.name}
                  className="product-main-image"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0yMDAgMTQwQzE3NS4xMjUgMTQwIDE1NCAxNjEuMTI1IDE1NCAxODZTMTc1LjEyNSAyMzIgMjAwIDIzMlMyNDYgMjEwLjg3NSAyNDYgMTg2UzIyNC44NzUgMTQwIDIwMCAxNDBaTTIwMCAxNThDMjE0Ljg4IDE1OCAyMjggMTcxLjEyIDIyOCAxODZTMjE0Ljg4IDIxNCAyMDAgMjE0UzE3MiAyMDAuODggMTcyIDE4NlMxODUuMTIgMTU4IDIwMCAxNThaIiBmaWxsPSIjOTk5OTk5Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZVUk5JVFVSRSBTUEFDRTU8L3RleHQ+Cjwvc3ZnPgo=';
                  }}
                />
              </div>

              <div className="product-info-section">
                <h1 className="product-title">{product.name}</h1>
                
                <div className="product-price-section">
                  <span className="product-price">{formatPrice(product.price)}</span>
                </div>

                <div className="product-description">
                  <h3>Описание</h3>
                  <p>{product.description || 'Описание товара отсутствует.'}</p>
                </div>

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

                {product.categoryName && (
                  <div className="product-category">
                    <span className="category-label">Категория:</span>
                    <span className="category-name">{product.categoryName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage; 