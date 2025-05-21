import React from 'react';
import './cart.css';
import '../App.css';
import Sidebar from '../sidebar.jsx';

function Cart() {
  return (
    <div className="maincontent">
      <Sidebar />
      <div className="cart-page">
        <h1>Корзина</h1>
        <div className="cart-container">
          <div className="cart-container">
          <p>Здесь будут товары...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart; 