import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Ошибка загрузки заказов:', err);
      setError('Не удалось загрузить заказы');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const updatedOrder = await adminAPI.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? updatedOrder : order
      ));
    } catch (err) {
      console.error('Ошибка обновления статуса:', err);
      alert('Не удалось обновить статус заказа');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusOptions = [
    { value: 'pending', label: 'Ожидает' },
    { value: 'processing', label: 'В обработке' },
    { value: 'shipped', label: 'Отправлен' },
    { value: 'delivered', label: 'Доставлен' },
    { value: 'cancelled', label: 'Отменен' }
  ];

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  if (loading) {
    return (
      <div className="admin-orders">
        <div className="orders-loading">Загрузка заказов...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-orders">
        <div className="orders-error">
          {error}
          <button onClick={loadOrders} className="retry-btn">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <div className="orders-header">
        <h1>Управление заказами</h1>
        <p>Всего заказов: {orders.length}</p>
      </div>

      <div className="orders-controls">
        <div className="filter-box">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Все статусы</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="orders-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <h3>Заказ #{order.id}</h3>
                  <p>от {formatDate(order.createdAt)}</p>
                </div>
                <div className="order-amount">
                  {formatCurrency(order.totalAmount)}
                </div>
              </div>

              <div className="order-details">
                <div className="order-info">
                  <p><strong>Адрес доставки:</strong> {order.shippingAddress || 'Не указан'}</p>
                  <p><strong>Способ оплаты:</strong> {order.paymentMethod || 'Не указан'}</p>
                  <p><strong>Статус оплаты:</strong> {order.paymentStatus || 'Не указан'}</p>
                  {order.notes && (
                    <p><strong>Примечания:</strong> {order.notes}</p>
                  )}
                </div>

                <div className="order-status-control">
                  <label>Статус заказа:</label>
                  <select 
                    value={order.status || 'pending'}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className={`status-select ${order.status}`}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {order.orderItems && order.orderItems.length > 0 && (
                <div className="order-items">
                  <h4>Товары в заказе:</h4>
                  <div className="items-list">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-info">
                          <span className="item-name">
                            {item.product?.name || `Товар ID: ${item.productId}`}
                          </span>
                          <span className="item-quantity">
                            Количество: {item.quantity} шт.
                          </span>
                        </div>
                        <div className="item-prices">
                          <span className="unit-price">
                            {formatCurrency(item.unitPrice)} за шт.
                          </span>
                          <span className="total-price">
                            Итого: {formatCurrency(item.totalPrice)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-orders">
            {statusFilter === 'all' ? 'Нет заказов' : `Нет заказов со статусом "${statusOptions.find(opt => opt.value === statusFilter)?.label}"`}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders; 