import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './CategorySelector.css';

const CategorySelector = ({ categories, onCategorySelect, selectedCategory }) => {
  const { categorySlug } = useParams();

  return (
    <div className="category-selector">
      <h2>Выберите категорию</h2>
      <div className="category-tabs">
        <button 
          className={!selectedCategory && !categorySlug ? 'category-tab active' : 'category-tab'}
          onClick={() => onCategorySelect(null)}
        >
          Все товары
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            className={
              (selectedCategory && selectedCategory.id === category.id) || 
              categorySlug === (category.slug || category.name.toLowerCase()) 
                ? 'category-tab active' 
                : 'category-tab'
            }
            onClick={() => onCategorySelect(category)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector; 