import { useState } from 'react'
import './filter.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

const Filter = () => {
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);
    return (
        <div className="filter-container">
            <div className="filter-header">
                <h2>Фильтр</h2>
            </div>
            <div className="filter-body">
                <div className="filter-item">
                    <h3>Цена</h3>
                    <input type="range" min="0" max="50000" />
                    <p>От {minPrice} до {maxPrice}</p>
                </div>
            </div>
        </div>
    );
};
export default Filter;