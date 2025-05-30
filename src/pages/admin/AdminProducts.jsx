import React, { useState, useEffect } from 'react';
import { productsAPI } from '../../services/api';
import './AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'asc'
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch (err) {
      console.error('Ошибка загрузки товаров:', err);
      setError('Не удалось загрузить товары');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(amount);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedProducts = () => {
    let sortableProducts = [...filteredProducts];
    if (sortConfig.key) {
      sortableProducts.sort((a, b) => {
        if (sortConfig.key === 'price' || sortConfig.key === 'rating' || sortConfig.key === 'discount') {
          const aValue = Number(a[sortConfig.key]) || 0;
          const bValue = Number(b[sortConfig.key]) || 0;
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        const aValue = a[sortConfig.key]?.toString().toLowerCase() || '';
        const bValue = b[sortConfig.key]?.toString().toLowerCase() || '';
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableProducts;
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = getSortedProducts();

  const getSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

  if (loading) {
    return (
      <div className="admin-products">
        <div className="products-loading">Загрузка товаров...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-products">
        <div className="products-error">
          {error}
          <button onClick={loadProducts} className="retry-btn">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-products">
      <div className="products-header">
        <h1>Каталог товаров</h1>
        <div className="products-summary">
          <span className="total-count">Всего товаров: {products.length}</span>
          {searchTerm && (
            <span className="filtered-count">
              Найдено: {filteredProducts.length}
            </span>
          )}
        </div>
      </div>

      <div className="products-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Поиск по названию или категории..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="clear-search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} className="sortable">
                ID {getSortIcon('id')}
              </th>
              <th>Изображение</th>
              <th onClick={() => handleSort('name')} className="sortable">
                Название {getSortIcon('name')}
              </th>
              <th onClick={() => handleSort('category')} className="sortable">
                Категория {getSortIcon('category')}
              </th>
              <th onClick={() => handleSort('price')} className="sortable">
                Цена {getSortIcon('price')}
              </th>
              <th onClick={() => handleSort('discount')} className="sortable">
                Скидка {getSortIcon('discount')}
              </th>
              <th onClick={() => handleSort('rating')} className="sortable">
                Рейтинг {getSortIcon('rating')}
              </th>
              <th>Статус</th>
              <th>Метки</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <tr key={product.id} className="product-row">
                  <td className="product-id">{product.id}</td>
                  <td className="product-image-cell">
                    <img 
                      src={`http://localhost:5173${product.image}`} 
                      alt={product.name}
                      className="product-thumbnail"
                    />
                  </td>
                  <td className="product-name">
                    <div className="name-cell">
                      <span className="name-text">{product.name}</span>
                      {product.description && (
                        <span className="description-preview">
                          {product.description.substring(0, 100)}...
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="product-category">
                    <span className="category-badge">{product.category}</span>
                  </td>
                  <td className="product-price">
                    {product.discount > 0 ? (
                      <div className="price-with-discount">
                        <span className="original-price">
                          {formatCurrency(product.price)}
                        </span>
                        <span className="final-price">
                          {formatCurrency(product.price * (1 - product.discount / 100))}
                        </span>
                      </div>
                    ) : (
                      <span className="regular-price">{formatCurrency(product.price)}</span>
                    )}
                  </td>
                  <td className="product-discount">
                    {product.discount > 0 ? (
                      <span className="discount-badge">-{product.discount}%</span>
                    ) : (
                      <span className="no-discount">—</span>
                    )}
                  </td>
                  <td className="product-rating">
                    <div className="rating-display">
                      <span className="rating-value">
                        {product.rating ? product.rating.toFixed(1) : '0.0'}
                      </span>
                      <span className="rating-stars">⭐</span>
                    </div>
                  </td>
                  <td className="product-status">
                    <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                      {product.inStock ? '✓ В наличии' : '✗ Нет в наличии'}
                    </span>
                  </td>
                  <td className="product-badges">
                    <div className="badges-container">
                      {product.isNew && <span className="badge new">Новинка</span>}
                      {product.isFeatured && <span className="badge featured">Топ</span>}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-products">
                  {searchTerm ? 'Товары не найдены по вашему запросу' : 'Нет товаров в каталоге'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {sortedProducts.length > 0 && (
        <div className="table-footer">
          <div className="table-info">
            Показано {sortedProducts.length} из {products.length} товаров
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts; 