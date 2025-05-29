import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, getImageUrl } from '../services/api';
import './cart.css';
import '../App.css';
import Sidebar from '../sidebar.jsx';
import App from '../App.jsx';

function Cart() {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert('Для оформления заказа необходимо войти в систему');
      return;
    }

    if (items.length === 0) {
      alert('Корзина пуста');
      return;
    }

    try {
      const orderData = {
        shippingAddress: "Будет запрошен при оформлении",
        paymentMethod: "Наличные",
        notes: "",
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      await ordersAPI.create(orderData);
      clearCart();
      alert('Заказ успешно оформлен!');
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      alert('Ошибка при оформлении заказа. Попробуйте позже.');
    }
  };

  return (
    <div>
      <div className='header-container'>
        <App />
      </div>
      <div className='main-container'>
        <div className='sidebar-container'>
          <Sidebar />
        </div>
        <div className="maincontent">
          <div className="cart-page">
            <h1>Корзина</h1>
            <div className="cart-container">
              {items.length === 0 ? (
                <div className="empty-cart">
                  <p>Корзина пуста</p>
                  <p>Добавьте товары в корзину, чтобы увидеть их здесь</p>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {items.map(item => (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-image">
                          {item.image ? (
                            <img 
                              src={getImageUrl(item.image)} 
                              alt={item.name}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="cart-item-placeholder" style={{ display: item.image ? 'none' : 'flex' }}>
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="cart-item-info">
                          <h3>{item.name}</h3>
                          <p className="cart-item-price">{formatPrice(item.price)}</p>
                        </div>
                        <div className="cart-item-controls">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="quantity-btn"
                          >
                            -
                          </button>
                          <span className="quantity-display">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="quantity-btn"
                          >
                            +
                          </button>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="remove-item-btn"
                            title="Удалить товар"
                          >
                            🗑️
                          </button>
                        </div>
                        <div className="cart-item-total">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="cart-summary">
                    <div className="cart-total">
                      <h2>Итого: {formatPrice(getTotalPrice())}</h2>
                    </div>
                    <div className="cart-actions">
                      <button 
                        onClick={clearCart}
                        className="clear-cart-btn"
                      >
                        Очистить корзину
                      </button>
                      <button 
                        onClick={handleCheckout}
                        className="checkout-btn"
                      >
                        Оформить заказ
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart; 