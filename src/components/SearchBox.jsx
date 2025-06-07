import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { productsAPI, categoriesAPI, getImageUrl } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './SearchBox.css';

const SearchBox = ({ isHovered, setIsHovered }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({ products: [], categories: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const searchBoxRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Дебаунс для поиска
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults({ products: [], categories: [] });
      setShowResults(false);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      await performSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Закрытие результатов при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setShowResults(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (term) => {
    setIsLoading(true);
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        productsAPI.search(term),
        categoriesAPI.getAll()
      ]);

      // Фильтруем категории по названию
      const filteredCategories = categoriesResponse.filter(category =>
        category.name.toLowerCase().includes(term.toLowerCase())
      );

      setSearchResults({
        products: productsResponse.slice(0, 6), // Ограничиваем до 6 продуктов
        categories: filteredCategories.slice(0, 3) // Ограничиваем до 3 категорий
      });
      setShowResults(true);
    } catch (error) {
      console.error('Ошибка поиска:', error);
      setSearchResults({ products: [], categories: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowResults(false);
      inputRef.current.blur();
    }
  };

  const handleItemClick = (type, item) => {
    if (type === 'product') {
      navigate(`/product/${item.id}`);
    } else if (type === 'category') {
      navigate(`/catalog?category=${item.id}`);
    }
    setShowResults(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e) => {
    if (!showResults) return;

    const totalItems = searchResults.categories.length + searchResults.products.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < totalItems - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : totalItems - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          const categories = searchResults.categories;
          const products = searchResults.products;
          
          if (highlightedIndex < categories.length) {
            handleItemClick('category', categories[highlightedIndex]);
          } else {
            const productIndex = highlightedIndex - categories.length;
            handleItemClick('product', products[productIndex]);
          }
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setHighlightedIndex(-1);
        inputRef.current.blur();
        break;
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults({ products: [], categories: [] });
    setShowResults(false);
    setHighlightedIndex(-1);
    inputRef.current.focus();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(price);
  };

  const totalResults = searchResults.categories.length + searchResults.products.length;

  return (
    <div className="search-box-container" ref={searchBoxRef}>
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
          placeholder="Поиск товаров и категорий..."
          className="search-input"
        />
        
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="clear-button"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
        
        <button
          type="submit"
          className={`search-button ${isHovered ? 'hover' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isLoading ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : (
            <FontAwesomeIcon icon={faSearch} />
          )}
        </button>
      </form>

      {showResults && totalResults > 0 && (
        <div className="search-results">
          {/* Категории */}
          {searchResults.categories.length > 0 && (
            <div className="search-section">
              <h4 className="search-section-title">Категории</h4>
              {searchResults.categories.map((category, index) => (
                <div
                  key={`category-${category.id}`}
                  className={`search-item category-item ${
                    highlightedIndex === index ? 'highlighted' : ''
                  }`}
                  onClick={() => handleItemClick('category', category)}
                >
                  <div className="category-info">
                    <span className="category-name">{category.name}</span>
                    <span className="category-description">
                      {category.description || 'Посмотреть все товары'}
                    </span>
                  </div>
                  <span className="item-type-badge">Категория</span>
                </div>
              ))}
            </div>
          )}

          {/* Продукты */}
          {searchResults.products.length > 0 && (
            <div className="search-section">
              <h4 className="search-section-title">Товары</h4>
              {searchResults.products.map((product, index) => {
                const resultIndex = searchResults.categories.length + index;
                return (
                  <div
                    key={`product-${product.id}`}
                    className={`search-item product-item ${
                      highlightedIndex === resultIndex ? 'highlighted' : ''
                    }`}
                    onClick={() => handleItemClick('product', product)}
                  >
                    <div className="product-image">
                      <img
                        src={getImageUrl(product.imagePath)}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0yNSAxNUMyMC4wMzEyIDE1IDE2IDE5LjAzMTIgMTYgMjRTMjAuMDMxMiAzMyAyNSAzM1MzNCAyOC45Njg4IDM0IDI0UzI5Ljk2ODggMTUgMjUgMTVaTTI1IDE3QzI4Ljg3NSAxNyAzMiAyMC4xMjUgMzIgMjRTMjguODc1IDMxIDI1IDMxUzE4IDI3Ljg3NSAxOCAyNFMyMS4xMjUgMTcgMjUgMTdaIiBmaWxsPSIjOTk5OTk5Ii8+Cjwvc3ZnPgo=';
                        }}
                      />
                    </div>
                    <div className="product-info">
                      <span className="product-name">{product.name}</span>
                      <span className="product-price">{formatPrice(product.price)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {searchTerm.length >= 2 && (
            <div className="search-footer">
              <button
                onClick={handleSubmit}
                className="view-all-button"
              >
                Посмотреть все результаты для "{searchTerm}"
              </button>
            </div>
          )}
        </div>
      )}

      {showResults && searchTerm.length >= 2 && totalResults === 0 && !isLoading && (
        <div className="search-results">
          <div className="no-results">
            <p>Ничего не найдено по запросу "{searchTerm}"</p>
            <p>Попробуйте изменить запрос или поискать что-то другое</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBox; 