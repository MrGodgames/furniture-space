import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './CategorySelector.css';

const CategorySelector = ({ categories, onCategorySelect }) => {
  const { categorySlug } = useParams();

  return (
    <div className="category-selector">
      <h2>Выберите категорию</h2>
      <div className="category-tabs">
        <Link 
          to="/catalog" 
          className={!categorySlug ? 'category-tab active' : 'category-tab'}
          onClick={() => onCategorySelect(null)}
        >
          Все товары
        </Link>
        {categories.map(category => (
          <Link
            key={category.id}
            to={`/catalog/${category.slug || category.name.toLowerCase()}`}
            className={categorySlug === (category.slug || category.name.toLowerCase()) ? 'category-tab active' : 'category-tab'}
            onClick={() => onCategorySelect(category)}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector; 