import { useState } from 'react'
import './filter.css';

const Filter = () => {
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    
    const handleApplyFilter = () => {
        console.log('Фильтр в диапазоне:', { minPrice, maxPrice });
    };

    const handleMinPriceChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d+$/.test(value)) {
            setMinPrice(value);
        }
    };

    const handleMaxPriceChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d+$/.test(value)) {
            setMaxPrice(value);
        }
    };

    return (
        <div className="filter-container">
            <div className="filter-header">
                <h2>Фильтр</h2>
            </div>
            <div className="filter-body">
                <h3>Цена</h3>
                <div className="filter-item">
                    <input 
                        type="text" 
                        value={minPrice} 
                        onChange={handleMinPriceChange} 
                        placeholder='От' 
                    />
                    <input 
                        type="text" 
                        value={maxPrice} 
                        onChange={handleMaxPriceChange} 
                        placeholder='До' 
                    />
                </div>
            </div>
            <div className="filter-footer">
                <button onClick={handleApplyFilter}>Применить</button>
            </div> 
        </div>
    );
};

export default Filter;