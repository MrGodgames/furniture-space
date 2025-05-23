import React from 'react';
import './catalog.css';
import '../App.css';
import Sidebar from '../sidebar.jsx';

function Catalog() {
  return (
    <div className="maincontent">
      <Sidebar />
      <div className="catalog-page">
        <h1>Каталог</h1>
        <div className="catalog-container">
          <div className="catalog-container">
          <h1>Мега крутая мебель</h1>
          <p>такая мебель только у тебя и у майкла джексона</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Catalog; 