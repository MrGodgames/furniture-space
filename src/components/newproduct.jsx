import React from 'react';
import './newproduct.css';

const NewProduct = () => {
  return (


    <div className="topcatalog">
        <h1>Новинки</h1>
        <div className="topcatalog-container">
          <div className="topcategory-item">
            <img src="https://ruminatop.ru/uploads/731d6c18-bfe2-4137-978e-b9df79600621.jpeg" alt="Мебель" />
            <h2>Шкафы</h2>
          </div>
          <div className="topcategory-item">
            <img src="https://ruminatop.ru/uploads/8d13e5fe-cf55-4ff5-9378-770abffed59e.png" alt="Мебель" />
            <h2>Кровати</h2>
          </div>
          <div className="topcategory-item">
            <img src="https://ruminatop.ru/uploads/731d6c18-bfe2-4137-978e-b9df79600621.jpeg" alt="Мебель" />
            <h2>Шкафы</h2>
          </div>
          <div className="topcategory-item">
            <img src="https://ruminatop.ru/uploads/8d13e5fe-cf55-4ff5-9378-770abffed59e.png" alt="Мебель" />
            <h2>Кровати</h2>
          </div>
        </div>
    </div>
  );
};

export default NewProduct;  