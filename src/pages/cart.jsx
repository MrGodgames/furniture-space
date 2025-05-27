import React from 'react';
import './cart.css';
import '../App.css';
import Sidebar from '../sidebar.jsx';
import App from '../App.jsx';

function Cart() {
  return (
    <div>
    <div  className='header-container'>
      <App />
    </div>
    <div  className='main-container'>
    <div className='sidebar-container'>
      <Sidebar />
      </div>
      <div className="maincontent">
      <div className="cart-page">
        <h1>Корзина</h1>
        <div className="cart-container">
          <div className="cart-container">
          <p>Здесь будут товары...</p>
          </div>
        </div>
      </div>
    </div>
      </div>
      </div>
  );
}

export default Cart; 