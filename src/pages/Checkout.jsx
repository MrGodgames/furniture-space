import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, authAPI, getImageUrl } from '../services/api';
import './Checkout.css';

function Checkout() {
  const { items, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    // Загружаем адрес пользователя для автозаполнения
    loadUserAddress();
  }, [isAuthenticated, items.length, navigate]);

  const loadUserAddress = async () => {
    try {
      const response = await authAPI.getUserAddress();
      if (response.address) {
        setShippingAddress(response.address);
      }
    } catch (error) {
      console.error('Ошибка загрузки адреса:', error);
      // Не показываем ошибку пользователю, просто оставляем поле пустым
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!shippingAddress.trim()) {
      setError('Пожалуйста, укажите адрес доставки');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        shippingAddress: shippingAddress.trim(),
        paymentMethod,
        notes: notes.trim(),
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      await ordersAPI.create(orderData);
      clearCart();
      
      // Перенаправляем на страницу успеха или профиль
      navigate('/profile', { 
        state: { 
          message: 'Заказ успешно оформлен! Вы можете отслеживать его статус в истории заказов.' 
        }
      });
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      setError('Ошибка при оформлении заказа. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-container">
          <h1>Оформление заказа</h1>
          
          <div className="checkout-content">
            {/* Форма заказа */}
            <div className="checkout-form-section">
              <form onSubmit={handleSubmit} className="checkout-form">
                <div className="form-group">
                  <label htmlFor="address">Адрес доставки *</label>
                  <textarea
                    id="address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Введите полный адрес доставки"
                    rows="3"
                    required
                  />
                  <small className="form-hint">
                    {shippingAddress === '' ? 
                      'Адрес будет автоматически заполнен из вашего профиля, если он указан' :
                      'Вы можете изменить адрес доставки при необходимости'
                    }
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="payment">Способ оплаты *</label>
                  <select
                    id="payment"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                  >
                    <option value="cash">Наличными при получении</option>
                    <option value="card">Банковской картой</option>
                    <option value="transfer">Банковским переводом</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Примечания к заказу</label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Дополнительная информация для курьера или менеджера"
                    rows="3"
                  />
                </div>

                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}

                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={() => navigate('/cart')}
                    className="btn-secondary"
                  >
                    Вернуться в корзину
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Оформляем заказ...' : 'Оформить заказ'}
                  </button>
                </div>
              </form>
            </div>

            {/* Сводка заказа */}
            <div className="order-summary-section">
              <div className="order-summary">
                <h2>Ваш заказ</h2>
                
                <div className="order-items">
                  {items.map((item) => (
                    <div key={item.id} className="order-item">
                      <img 
                        src={getImageUrl(item.image)} 
                        alt={item.name}
                        className="item-image"
                      />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p className="item-price">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                        <p className="item-total">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-total">
                  <div className="total-row">
                    <span>Итого:</span>
                    <span className="total-amount">{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>

                <div className="delivery-info">
                  <h3>Информация о доставке</h3>
                  <p>• Доставка по городу: бесплатно</p>
                  <p>• Время доставки: 1-3 рабочих дня</p>
                  <p>• Возможна срочная доставка за дополнительную плату</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout; 