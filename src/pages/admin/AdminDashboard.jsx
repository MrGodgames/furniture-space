import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [salesStats, setSalesStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboard, sales] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getProductSales()
      ]);
      setDashboardData(dashboard);
      setSalesStats(sales);
    } catch (err) {
      console.error('Ошибка загрузки данных дашборда:', err);
      setError('Не удалось загрузить данные дашборда');
    } finally {
      setLoading(false);
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

  // Расчет статистики из продаж
  const totalSoldItems = salesStats.reduce((sum, product) => sum + product.totalSold, 0);
  const salesRevenue = salesStats.reduce((sum, product) => sum + product.totalRevenue, 0);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-loading">Загрузка данных...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-error">
          {error}
          <button onClick={loadDashboardData} className="retry-btn">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Панель управления</h1>
        <p>Общая статистика и последние события</p>
      </div>

      {/* Основные метрики */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{dashboardData.totalProducts}</h3>
            <p>Товаров в каталоге</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>{dashboardData.totalOrders}</h3>
            <p>Всего заказов</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{dashboardData.totalUsers}</h3>
            <p>Зарегистрированных пользователей</p>
          </div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{formatCurrency(dashboardData.totalRevenue)}</h3>
            <p>Общий доход от заказов</p>
          </div>
        </div>

        <div className="stat-card today">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{dashboardData.ordersToday}</h3>
            <p>Заказов сегодня</p>
          </div>
        </div>

        <div className="stat-card today">
          <div className="stat-icon">💵</div>
          <div className="stat-content">
            <h3>{formatCurrency(dashboardData.revenueToday)}</h3>
            <p>Доход за сегодня</p>
          </div>
        </div>
      </div>

      {/* Дополнительная статистика продаж */}
      <div className="sales-overview">
        <h2>Статистика продаж товаров</h2>
        <div className="sales-stats-grid">
          <div className="sales-stat">
            <div className="sales-icon">📦</div>
            <div className="sales-content">
              <h3>{totalSoldItems}</h3>
              <p>Товаров продано</p>
            </div>
          </div>
          <div className="sales-stat">
            <div className="sales-icon">💰</div>
            <div className="sales-content">
              <h3>{formatCurrency(salesRevenue)}</h3>
              <p>Выручка с продаж</p>
            </div>
          </div>
          <div className="sales-stat">
            <div className="sales-icon">📊</div>
            <div className="sales-content">
              <h3>{salesStats.length}</h3>
              <p>Видов товаров продано</p>
            </div>
          </div>
        </div>
      </div>

      {/* Топ продукты и последние заказы */}
      <div className="dashboard-content">
        <div className="content-section">
          <h2>Топ-5 продаваемых товаров</h2>
          <div className="top-products">
            {dashboardData.topSellingProducts.length > 0 ? (
              dashboardData.topSellingProducts.map((product, index) => (
                <div key={product.productId} className="product-item">
                  <div className="product-rank">#{index + 1}</div>
                  <img 
                    src={`http://localhost:5173${product.productImage}`} 
                    alt={product.productName}
                    className="product-image"
                  />
                  <div className="product-info">
                    <h4>{product.productName}</h4>
                    <p>Продано: <strong>{product.totalSold} шт.</strong></p>
                    <p>Доход: <strong>{formatCurrency(product.totalRevenue)}</strong></p>
                    <p>Заказов: <strong>{product.totalOrders}</strong></p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">Нет данных о продажах</p>
            )}
          </div>
        </div>

        <div className="content-section">
          <h2>Последние заказы</h2>
          <div className="recent-orders">
            {dashboardData.recentOrders.length > 0 ? (
              dashboardData.recentOrders.map((order) => (
                <div key={order.id} className="order-item">
                  <div className="order-info">
                    <h4>Заказ #{order.id}</h4>
                    <p>Дата: {formatDate(order.createdAt)}</p>
                    <p>Статус: <span className={`status ${order.status}`}>{order.status}</span></p>
                  </div>
                  <div className="order-amount">
                    {formatCurrency(order.totalAmount)}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">Нет заказов</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 