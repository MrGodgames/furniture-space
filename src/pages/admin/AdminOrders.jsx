import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      // Если обновляем заказ, который сейчас открыт в модальном окне
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updatedOrder);
      }
    } catch (err) {
      console.error('Ошибка обновления статуса:', err);
      alert('Не удалось обновить статус заказа');
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeOrderDetails = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
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

  const getStatusLabel = (status) => {
    const statusMap = {
      'pending': 'Ожидает',
      'processing': 'В обработке',
      'shipped': 'Отправлен',
      'delivered': 'Доставлен',
      'cancelled': 'Отменен'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'pending': '#ffc107',
      'processing': '#17a2b8',
      'shipped': '#007bff',
      'delivered': '#28a745',
      'cancelled': '#dc3545'
    };
    return colorMap[status] || '#6c757d';
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

      {/* Компактный список заказов */}
      <div className="orders-table">
        <div className="table-header">
          <div className="col-order">Заказ</div>
          <div className="col-customer">Клиент</div>
          <div className="col-date">Дата</div>
          <div className="col-status">Статус</div>
          <div className="col-amount">Сумма</div>
          <div className="col-actions">Действия</div>
        </div>

        <div className="table-body">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="table-row" onClick={() => openOrderDetails(order)}>
                <div className="col-order">
                  <span className="order-number">#{order.id}</span>
                </div>
                <div className="col-customer">
                  <div className="customer-info">
                    <span className="customer-name">{order.customerName || 'Не указано'}</span>
                    <span className="customer-email">{order.customerEmail || 'Не указан'}</span>
                  </div>
                </div>
                <div className="col-date">
                  {formatDate(order.date || order.createdAt)}
                </div>
                <div className="col-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                <div className="col-amount">
                  {formatCurrency(order.totalAmount)}
                </div>
                <div className="col-actions">
                  <button 
                    className="view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openOrderDetails(order);
                    }}
                  >
                    Подробнее
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-orders">
              {statusFilter === 'all' ? 'Нет заказов' : `Нет заказов со статусом "${statusOptions.find(opt => opt.value === statusFilter)?.label}"`}
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно с деталями заказа */}
      {isModalOpen && selectedOrder && (
        <div className="modal-overlay" onClick={closeOrderDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Заказ #{selectedOrder.id}</h2>
              <button className="close-btn" onClick={closeOrderDetails}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Основная информация */}
              <div className="order-summary">
                <div className="summary-item">
                  <span className="label">Дата заказа:</span>
                  <span className="value">{formatDate(selectedOrder.date || selectedOrder.createdAt)}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Общая сумма:</span>
                  <span className="value amount">{formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Текущий статус:</span>
                  <span 
                    className="value status-badge"
                    style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
                  >
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>
              </div>

              {/* Информация о клиенте */}
              <div className="section">
                <h3>Информация о клиенте</h3>
                <div className="section-content">
                  <div className="info-item">
                    <span className="label">Имя:</span>
                    <span className="value">{selectedOrder.customerName || 'Не указано'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Email:</span>
                    <span className="value">{selectedOrder.customerEmail || 'Не указан'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Телефон:</span>
                    <span className="value">{selectedOrder.customerPhone || 'Не указан'}</span>
                  </div>
                </div>
              </div>

              {/* Доставка и оплата */}
              <div className="section">
                <h3>Доставка и оплата</h3>
                <div className="section-content">
                  <div className="info-item">
                    <span className="label">Адрес доставки:</span>
                    <span className="value">{selectedOrder.shippingAddress || 'Не указан'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Способ оплаты:</span>
                    <span className="value">{selectedOrder.paymentMethod || 'Не указан'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Статус оплаты:</span>
                    <span className="value">{selectedOrder.paymentStatus || 'Не указан'}</span>
                  </div>
                  {selectedOrder.notes && (
                    <div className="info-item">
                      <span className="label">Примечания:</span>
                      <span className="value">{selectedOrder.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Товары в заказе */}
              {((selectedOrder.items && selectedOrder.items.length > 0) || (selectedOrder.orderItems && selectedOrder.orderItems.length > 0)) && (
                <div className="section">
                  <h3>Товары в заказе</h3>
                  <div className="items-list">
                    {(selectedOrder.items || selectedOrder.orderItems || []).map((item, index) => (
                      <div key={index} className="item-row">
                        <div className="item-info">
                          <span className="item-name">
                            {item.name || item.product?.name || `Товар ID: ${item.productId}`}
                          </span>
                          <span className="item-details">
                            {item.quantity} шт. × {formatCurrency(item.unitPrice || item.price)}
                          </span>
                        </div>
                        <div className="item-total">
                          {formatCurrency(item.totalPrice || (item.price * item.quantity))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Управление статусом */}
              <div className="section">
                <h3>Управление заказом</h3>
                <div className="status-control">
                  <label>Изменить статус заказа:</label>
                  <select 
                    value={selectedOrder.status || 'pending'}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                    className="status-select"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders; 