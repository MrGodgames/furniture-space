import React from 'react';
import { useNavigate } from 'react-router-dom';
import './newproduct.css';

const NewProduct = () => {
  const navigate = useNavigate();

  const newProducts = [
    {
      id: 'modern-sofa',
      name: 'Современный диван "Milano"',
      image: 'https://ruminatop.ru/uploads/9d58ebc8-13a2-4b25-973f-318366747f42.jpeg',
      price: '89 990 ₽',
      oldPrice: '129 990 ₽',
      path: '/product/modern-sofa'
    },
    {
      id: 'luxury-bed',
      name: 'Кровать "Royal Dream"',
      image: 'https://ruminatop.ru/uploads/8d13e5fe-cf55-4ff5-9378-770abffed59e.png',
      price: '125 490 ₽',
      oldPrice: '149 990 ₽',
      path: '/product/luxury-bed'
    },
    {
      id: 'smart-wardrobe',
      name: 'Умный шкаф "TechSpace"',
      image: 'https://ruminatop.ru/uploads/731d6c18-bfe2-4137-978e-b9df79600621.jpeg',
      price: '67 850 ₽',
      oldPrice: '89 900 ₽',
      path: '/product/smart-wardrobe'
    },
    {
      id: 'dining-set',
      name: 'Обеденная группа "Family"',
      image: 'https://ruminatop.ru/hero.jpeg',
      price: '45 990 ₽',
      oldPrice: '59 990 ₽',
      path: '/product/dining-set'
    }
  ];

  const handleProductClick = (product) => {
    navigate(product.path);
  };

  return (
    <div className="topcatalog">
      <h1>Новинки</h1>
      <div className="topcatalog-container">
        {newProducts.map((product) => (
          <div 
            key={product.id}
            className="topcategory-item"
            onClick={() => handleProductClick(product)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleProductClick(product);
              }
            }}
          >
            <img src={product.image} alt={product.name} />
            <div className="product-info">
              <h2>{product.name}</h2>
              <div className="price-container">
                <span className="new-price">{product.price}</span>
                {product.oldPrice && (
                  <span className="old-price">{product.oldPrice}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewProduct;  