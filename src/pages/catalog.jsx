import React, { useState, useEffect } from 'react';
import './catalog.css';
import '../App.css';
import Sidebar from '../sidebar.jsx';
import ProductCard from '../components/ProductCard.jsx';
import CategoryCard from '../components/CategoryCard.jsx';
import { categoriesAPI, productsAPI } from '../services/api.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faHeart, faPhone, faSearch, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

function Catalog() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Загружаем категории и продукты параллельно
      const [categoriesData, productsData, featuredData] = await Promise.all([
        categoriesAPI.getAll(),
        productsAPI.getAll(),
        productsAPI.getFeatured()
      ]);

      setCategories(categoriesData);
      setProducts(productsData);
      setFeaturedProducts(featuredData);
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      setError('Не удалось загрузить данные. Проверьте подключение к серверу.');
    } finally {
      setLoading(false);
    }
  };

  // Обработчик выбора категории
  const handleCategoryClick = async (category) => {
    try {
      setLoading(true);
      setSelectedCategory(category);
      
      const categoryProducts = await productsAPI.getByCategory(category.id);
      setProducts(categoryProducts);
    } catch (err) {
      console.error('Ошибка загрузки продуктов категории:', err);
      setError('Не удалось загрузить продукты категории.');
    } finally {
      setLoading(false);
    }
  };

  // Обработчик поиска из header
  const handleHeaderSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadInitialData();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await productsAPI.search(searchTerm);
      setProducts(searchResults);
      setSelectedCategory(null);
    } catch (err) {
      console.error('Ошибка поиска:', err);
      setError('Ошибка при поиске продуктов.');
    } finally {
      setLoading(false);
    }
  };

  // Сброс фильтров
  const resetFilters = () => {
    setSelectedCategory(null);
    setSearchTerm('');
    loadInitialData();
  };

  if (loading && categories.length === 0) {
    return (
      <div>
        <div className="header-container">
          <header>
            <div className="header">
              <div className="logo">
                <img src="./src/assets/images/logo.png" alt="logo" />
              </div>
              <div className='search'>
                <input 
                  type="text" 
                  placeholder='Поиск...' 
                  className='search-input'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleHeaderSearch(e)}
                />
                <button 
                  className={`sr-button ${isHovered ? 'hover' : ''}`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={handleHeaderSearch}
                >
                  <FontAwesomeIcon icon={faSearch} color='white'/>
                </button>
              </div>
              <div className='phonenumber'>
                <FontAwesomeIcon icon={faPhone} className='phonenumberico'/>
                <p>8 (800) 555-35-35</p>
              </div>
              <div className="fastnav">
                <NavLink to="/favorites" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
                  <FontAwesomeIcon icon={faHeart} />
                </NavLink>
                <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
                  <FontAwesomeIcon icon={faAddressBook} />
                </NavLink>
                <NavLink to="/cart" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
                  <FontAwesomeIcon icon={faShoppingCart} />
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
                  <FontAwesomeIcon icon={faUser} />
                </NavLink>
              </div>
            </div>
          </header>
        </div>
        <div className="main-container">
          <div className="sidebar-container">
            <Sidebar />
          </div>
          <div className="catalog-page">
            <div className="loading">Загрузка...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="header-container">
        <header>
          <div className="header">
            <div className="logo">
              <img src="./src/assets/images/logo.png" alt="logo" />
            </div>
            <div className='search'>
              <input 
                type="text" 
                placeholder='Поиск...' 
                className='search-input'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleHeaderSearch(e)}
              />
              <button 
                className={`sr-button ${isHovered ? 'hover' : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleHeaderSearch}
              >
                <FontAwesomeIcon icon={faSearch} color='white'/>
              </button>
            </div>
            <div className='phonenumber'>
              <FontAwesomeIcon icon={faPhone} className='phonenumberico'/>
              <p>8 (800) 555-35-35</p>
            </div>
            <div className="fastnav">
              <NavLink to="/favorites" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
                <FontAwesomeIcon icon={faHeart} />
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
                <FontAwesomeIcon icon={faAddressBook} />
              </NavLink>
              <NavLink to="/cart" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
                <FontAwesomeIcon icon={faShoppingCart} />
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
                <FontAwesomeIcon icon={faUser} />
              </NavLink>
            </div>
          </div>
        </header>
      </div>
      
      <div className="main-container">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="catalog-page">
          <h1>Каталог</h1>
          
          {error && (
            <div className="error-message">
              {error}
              <button onClick={loadInitialData} className="retry-button">
                Попробовать снова
              </button>
            </div>
          )}

          {/* Кнопка сброса фильтров */}
          {(selectedCategory || searchTerm) && (
            <div className="filter-controls">
              <button onClick={resetFilters} className="reset-filters-button">
                Показать все товары
              </button>
            </div>
          )}

          {/* Категории */}
          {!selectedCategory && !searchTerm && (
            <>
              <h2>Категории</h2>
              <div className="categories-container">
                {categories.map(category => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onClick={handleCategoryClick}
                  />
                ))}
              </div>
            </>
          )}

          {/* Заголовок секции продуктов */}
          <div className="products-section-header">
            {selectedCategory ? (
              <h2>Товары в категории: {selectedCategory.name}</h2>
            ) : searchTerm ? (
              <h2>Результаты поиска: "{searchTerm}"</h2>
            ) : (
              <h2>Популярные товары</h2>
            )}
            
            {products.length > 0 && (
              <span className="products-count">({products.length} товаров)</span>
            )}
          </div>

          {/* Продукты */}
          <div className="products-container">
            {loading ? (
              <div className="loading">Загрузка продуктов...</div>
            ) : products.length > 0 ? (
              products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="no-products">
                {selectedCategory || searchTerm 
                  ? 'Товары не найдены' 
                  : 'Нет доступных товаров'
                }
              </div>
            )}
          </div>

          {/* Рекомендуемые товары (показываем только на главной странице каталога) */}
          {!selectedCategory && !searchTerm && featuredProducts.length > 0 && (
            <>
              <h2>Рекомендуемые товары</h2>
              <div className="products-container">
                {featuredProducts.map(product => (
                  <ProductCard key={`featured-${product.id}`} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Catalog; 