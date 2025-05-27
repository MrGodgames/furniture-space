import React from 'react';
import './topcat.css';

const TopCat = () => {
  return (


    <div className="catalog-page">
        <h1>Каталог</h1>
        <div className="categories-container">
          <div className="category-item">
            <img src="https://ruminatop.ru/uploads/731d6c18-bfe2-4137-978e-b9df79600621.jpeg" alt="Мебель" />
            <h2>Шкафы</h2>
          </div>
          <div className="category-item">
            <img src="https://ruminatop.ru/uploads/8d13e5fe-cf55-4ff5-9378-770abffed59e.png" alt="Мебель" />
            <h2>Кровати</h2>
          </div>
          <div className="category-item">
            <img src="https://ruminatop.ru/uploads/731d6c18-bfe2-4137-978e-b9df79600621.jpeg" alt="Мебель" />
            <h2>Шкафы</h2>
          </div>
          <div className="category-item">
            <img src="https://ruminatop.ru/uploads/8d13e5fe-cf55-4ff5-9378-770abffed59e.png" alt="Мебель" />
            <h2>Кровати</h2>
          </div>
        </div>
        <h2>Популярные товары</h2>
        <div className="products-container">
          <div className="product-item">
            <img src="https://ruminatop.ru/uploads/731d6c18-bfe2-4137-978e-b9df79600621.jpeg" alt="Мебель" />
            <h2>Авангард</h2>
            <p>Категория: Шкафы</p>
            <p>Цена: 100000 руб.</p>
            <button>Купить</button>
          </div>
        </div>
    </div>
  );
};

export default TopCat;  