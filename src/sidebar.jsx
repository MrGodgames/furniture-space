import { useState, useEffect } from 'react'
import './sidebar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCouch, faBookOpen, faUtensils, faBed } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { categoriesAPI } from './services/api';

const iconMap = {
  'диван': faCouch,
  'шкаф': faBookOpen,
  'стол': faUtensils,
  'кровать': faBed,
  'мебель': faHome,
  'кухня': faUtensils,
};

function Sidebar() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data.slice(0, 5)); // Показываем только первые 5 категорий
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconForCategory = (categoryName) => {
    const name = categoryName.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (name.includes(key)) {
        return icon;
      }
    }
    return faHome; // Иконка по умолчанию
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/search?q=${encodeURIComponent('')}&category=${categoryId}`);
  };

  if (loading) {
    return (
      <nav className="sidebar">
        <div className="sidebar-header">
          <p>Категории</p>
        </div>
        <div className="categories">
          <div className="loading-categories">Загрузка...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <p>Категории</p>
      </div>
      <div className="categories">
        <Link to="/" className='categorybut'>
          <FontAwesomeIcon icon={faHome} className='bar-buttonico'/>
          Главная
        </Link>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className='categorybut'
          >
            <FontAwesomeIcon 
              icon={getIconForCategory(category.name)} 
              className='bar-buttonico'
            />
            {category.name}
          </button>
        ))}
        <Link to="/catalog" className='categorybut'>
          <FontAwesomeIcon icon={faBookOpen} className='bar-buttonico'/>
          Все товары
        </Link>
      </div>
    </nav>
  );
}

export default Sidebar;
