import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { productsAPI, categoriesAPI, getImageUrl } from '../services/api';
import { useCart } from '../context/CartContext';
import './SearchPage.css';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState({ products: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { addToCart, getItemQuantity, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  
  const searchTerm = searchParams.get('q') || '';
  const categoryId = searchParams.get('category');

  useEffect(() => {
    if (searchTerm || categoryId) {
      performSearch(searchTerm, categoryId);
    } else {
      setLoading(false);
    }
  }, [searchTerm, categoryId]);

  const performSearch = async (term, catId) => {
    setLoading(true);
    setError(null);
    try {
      let productsResponse = [];
      let filteredCategories = [];

      if (catId) {
        // Поиск по категории
        productsResponse = await productsAPI.getByCategory(catId);
        
        // Получаем информацию о выбранной категории
        const categoryInfo = await categoriesAPI.getById(catId);
        setSelectedCategory(categoryInfo);
      } else if (term) {
        // Обычный поиск
        const [productsRes, categoriesResponse] = await Promise.all([
          productsAPI.search(term),
          categoriesAPI.getAll()
        ]);
        
        productsResponse = productsRes;
        filteredCategories = categoriesResponse.filter(category =>
          category.name.toLowerCase().includes(term.toLowerCase())
        );
        setSelectedCategory(null);
      }

      setSearchResults({
        products: productsResponse,
        categories: filteredCategories
      });
    } catch (error) {
      console.error('Ошибка поиска:', error);
      setError('Произошла ошибка при поиске. Попробуйте снова.');
      setSearchResults({ products: [], categories: [] });
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

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/search?category=${categoryId}`);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const clearCategoryFilter = () => {
    navigate('/search');
    setSelectedCategory(null);
  };

  if (!searchTerm && !categoryId) {
    return (
      <div className="search-page">
        <div className="container">
          <h1>Поиск</h1>
          <p>Введите запрос в строку поиска или выберите категорию для начала поиска.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    const loadingText = selectedCategory 
      ? `Загрузка товаров категории "${selectedCategory?.name}"...`
      : `Поиск результатов для "${searchTerm}"...`;
      
    return (
      <div className="search-page">
        <div className="container">
          <div className="search-loading">
            <h1>{loadingText}</h1>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-page">
        <div className="container">
          <h1>Ошибка поиска</h1>
          <p>{error}</p>
          <button onClick={() => performSearch(searchTerm, categoryId)} className="retry-btn">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  const totalResults = searchResults.products.length + searchResults.categories.length;
  
  const getPageTitle = () => {
    if (selectedCategory) {
      return `Товары в категории "${selectedCategory.name}"`;
    }
    return `Результаты поиска для "${searchTerm}"`;
  };

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-header">
          <h1>{getPageTitle()}</h1>
          {selectedCategory ? (
            <div className="category-filter-info">
              <p>Найдено товаров: {searchResults.products.length}</p>
              <button onClick={clearCategoryFilter} className="clear-filter-btn">
                Очистить фильтр
              </button>
            </div>
          ) : (
            <p>Найдено: {totalResults} результат(ов)</p>
          )}
        </div>

        {totalResults === 0 ? (
          <div className="no-results">
            <h2>
              {selectedCategory 
                ? `В категории "${selectedCategory.name}" нет товаров`
                : `По вашему запросу ничего не найдено`
              }
            </h2>
            <p>Попробуйте:</p>
            <ul>
              {selectedCategory ? (
                <li>Выбрать другую категорию</li>
              ) : (
                <>
                  <li>Проверить правильность написания</li>
                  <li>Использовать более общие термины</li>
                  <li>Попробовать синонимы</li>
                </>
              )}
            </ul>
          </div>
        ) : (
          <>
            {/* Категории (только при текстовом поиске) */}
            {!selectedCategory && searchResults.categories.length > 0 && (
              <section className="search-section">
                <h2>Категории ({searchResults.categories.length})</h2>
                <div className="categories-grid">
                  {searchResults.categories.map((category) => (
                    <div
                      key={category.id}
                      className="category-card"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <div className="category-content">
                        <h3>{category.name}</h3>
                        <p>{category.description || 'Посмотреть все товары в категории'}</p>
                        <span className="category-badge">Категория</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Продукты */}
            {searchResults.products.length > 0 && (
              <section className="search-section">
                <h2>
                  {selectedCategory 
                    ? `Товары (${searchResults.products.length})`
                    : `Товары (${searchResults.products.length})`
                  }
                </h2>
                <div className="products-grid">
                  {searchResults.products.map((product) => {
                    const cartQuantity = getItemQuantity(product.id);
                    
                    return (
                      <div key={product.id} className="product-card">
                        <div className="product-image" onClick={() => handleProductClick(product.id)}>
                          <img
                            src={getImageUrl(product.imagePath)}
                            alt={product.name}
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0xMDAgNzBDODcuNTYyNSA3MCA3NyA4MC41NjI1IDc3IDkzUzg3LjU2MjUgMTE2IDEwMCAxMTZTMTIzIDEwNS40MzggMTIzIDkzUzExMi40MzggNzAgMTAwIDcwWk0xMDAgNzlDMTA3LjQ0IDc5IDExNCA4NS41NiAxMTQgOTNTMTA3LjQ0IDEwNyAxMDAgMTA3Uzg2IDEwMC40NCA4NiA5M1M5Mi41NiA3OSAxMDAgNzlaIiBmaWxsPSIjOTk5OTk5Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZVUk5JVFVSRSBTUEFDRTU8L3RleHQ+Cjwvc3ZnPgo=';
                            }}
                          />
                        </div>
                        <div className="product-info">
                          <h3 onClick={() => handleProductClick(product.id)}>{product.name}</h3>
                          <p className="product-description">{product.description}</p>
                          <div className="product-footer">
                            <span className="product-price">{formatPrice(product.price)}</span>
                            <div className="cart-controls">
                              {cartQuantity > 0 ? (
                                <div className="quantity-controls">
                                  <button 
                                    onClick={() => handleUpdateQuantity(product.id, cartQuantity - 1)}
                                    className="quantity-btn minus"
                                  >
                                    -
                                  </button>
                                  <span className="quantity">{cartQuantity}</span>
                                  <button 
                                    onClick={() => handleUpdateQuantity(product.id, cartQuantity + 1)}
                                    className="quantity-btn plus"
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => handleAddToCart(product)}
                                  className="add-to-cart-btn"
                                >
                                  В корзину
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 