import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './catalog.css';
import '../App.css';
import App from '../App.jsx';
import Sidebar from '../sidebar.jsx';
import ProductCard from '../components/ProductCard.jsx';
import CategorySelector from '../components/CategorySelector.jsx';
import NewProducts from '../components/NewProducts.jsx';
import { categoriesAPI, productsAPI } from '../services/api.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faHeart, faPhone, faSearch, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Catalog() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useAuth();

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadInitialData();
  }, []);

  // Обработка изменения категории из URL
  useEffect(() => {
    if (categorySlug && categories.length > 0) {
      const category = categories.find(cat => 
        (cat.slug && cat.slug === categorySlug) || 
        cat.name.toLowerCase() === categorySlug
      );
      if (category) {
        loadCategoryProducts(category);
      }
    } else if (!categorySlug) {
      setSelectedCategory(null);
      loadAllProducts();
    }
  }, [categorySlug, categories]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Загружаем категории и новинки
      const [categoriesData, newProductsData] = await Promise.all([
        categoriesAPI.getAll(),
        productsAPI.getNew()
      ]);

      setCategories(categoriesData);
      setNewProducts(newProductsData);

      // Загружаем все товары если не выбрана конкретная категория
      if (!categorySlug) {
        const allProducts = await productsAPI.getAll();
        setProducts(allProducts);
      }
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      setError('Не удалось загрузить данные. Проверьте подключение к серверу.');
    } finally {
      setLoading(false);
    }
  };

  const loadAllProducts = async () => {
    try {
      setProductsLoading(true);
      const allProducts = await productsAPI.getAll();
      setProducts(allProducts);
    } catch (err) {
      console.error('Ошибка загрузки товаров:', err);
      setError('Не удалось загрузить товары.');
    } finally {
      setProductsLoading(false);
    }
  };

  const loadCategoryProducts = async (category) => {
    try {
      setProductsLoading(true);
      setSelectedCategory(category);
      const categoryProducts = await productsAPI.getByCategory(category.id);
      setProducts(categoryProducts);
    } catch (err) {
      console.error('Ошибка загрузки продуктов категории:', err);
      setError('Не удалось загрузить продукты категории.');
    } finally {
      setProductsLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    if (category) {
      setSelectedCategory(category);
      navigate(`/catalog/${category.slug || category.name.toLowerCase()}`);
    } else {
      setSelectedCategory(null);
      navigate('/catalog');
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
        <App />
      </div>
      <div className="main-container">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="catalog-page">
          <h1>Каталог товаров</h1>
          
          {error && (
            <div className="error-message">
              {error}
              <button onClick={loadInitialData} className="retry-button">
                Попробовать снова
              </button>
            </div>
          )}

          {/* Селектор категорий */}
          <CategorySelector 
            categories={categories}
            onCategorySelect={handleCategorySelect}
          />

          {/* Новинки (показываем только если не выбрана категория) */}
          {!selectedCategory && (
            <NewProducts 
              products={newProducts}
              loading={false}
            />
          )}

          {/* Основной каталог */}
          <div className="main-catalog">
            <div className="catalog-header">
              <h2>
                {selectedCategory 
                  ? `Категория: ${selectedCategory.name}` 
                  : 'Все товары'
                }
              </h2>
              {products.length > 0 && (
                <span className="products-count">({products.length} товаров)</span>
              )}
            </div>

            <div className="products-grid">
              {productsLoading ? (
                <div className="products-loading">Загрузка товаров...</div>
              ) : products.length > 0 ? (
                products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="no-products">
                  {selectedCategory 
                    ? `В категории "${selectedCategory.name}" пока нет товаров` 
                    : 'Товары не найдены'
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Catalog; 