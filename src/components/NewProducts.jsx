import React from 'react';
import ProductCard from './ProductCard';
import './NewProducts.css';

const NewProducts = ({ products, loading }) => {
  // Берем только 6 товаров
  const newProducts = products.slice(0, 6);

  if (loading) {
    return (
      <div className="new-products">
        <h2>Новинки</h2>
        <div className="new-products-loading">Загрузка...</div>
      </div>
    );
  }

  if (newProducts.length === 0) {
    return null;
  }

  return (
    <div className="new-products">
      <h2>Новинки</h2>
      <div className="new-products-grid">
        {newProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default NewProducts; 