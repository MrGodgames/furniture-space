import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import './AdminStatistics.css';

const AdminStatistics = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [salesStats, setSalesStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const [dashboard, sales] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getProductSales()
      ]);
      setDashboardData(dashboard);
      setSalesStats(sales);
    } catch (err) {
      console.error('Ошибка загрузки статистики:', err);
      setError('Не удалось загрузить статистику');
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
      day: 'numeric'
    });
  };

  // Расчеты для детальной статистики
  const totalSoldItems = salesStats.reduce((sum, product) => sum + product.totalSold, 0);
  const salesRevenue = salesStats.reduce((sum, product) => sum + product.totalRevenue, 0);
  const totalProductOrders = salesStats.reduce((sum, product) => sum + product.totalOrders, 0);
  const averageOrderValue = dashboardData ? (dashboardData.totalRevenue / (dashboardData.totalOrders || 1)) : 0;
  const averageItemsPerOrder = totalSoldItems / (dashboardData?.totalOrders || 1);

  if (loading) {
    return (
      <div className="admin-statistics">
        <div className="statistics-loading">Загрузка статистики...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-statistics">
        <div className="statistics-error">
          {error}
          <button onClick={loadStatistics} className="retry-btn">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-statistics">
      <div className="statistics-header">
        <h1>Детальная статистика</h1>
        <p>Подробная аналитика работы магазина</p>
      </div>

      {/* Основные метрики - те же что в дашборде */}
      <div className="main-metrics">
        <h2>Основные показатели</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">📦</div>
            <div className="metric-content">
              <h3>{dashboardData.totalProducts}</h3>
              <p>Товаров в каталоге</p>
              <span className="metric-detail">
                {salesStats.length} продавались
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">🛒</div>
            <div className="metric-content">
              <h3>{dashboardData.totalOrders}</h3>
              <p>Всего заказов</p>
              <span className="metric-detail">
                {dashboardData.ordersToday} сегодня
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">👥</div>
            <div className="metric-content">
              <h3>{dashboardData.totalUsers}</h3>
              <p>Зарегистрированных пользователей</p>
              <span className="metric-detail">
                База клиентов
              </span>
            </div>
          </div>

          <div className="metric-card highlight">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <h3>{formatCurrency(dashboardData.totalRevenue)}</h3>
              <p>Общий доход от заказов</p>
              <span className="metric-detail">
                {formatCurrency(dashboardData.revenueToday)} сегодня
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Детальная аналитика продаж */}
      <div className="detailed-analytics">
        <h2>Аналитика продаж</h2>
        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-icon">📊</div>
            <div className="analytics-content">
              <h3>{totalSoldItems}</h3>
              <p>Товаров продано (шт.)</p>
              <span className="analytics-detail">
                Средний чек: {formatCurrency(averageOrderValue)}
              </span>
            </div>
          </div>

          <div className="analytics-card">
            <div className="analytics-icon">💵</div>
            <div className="analytics-content">
              <h3>{formatCurrency(salesRevenue)}</h3>
              <p>Выручка с продаж</p>
              <span className="analytics-detail">
                {((salesRevenue / dashboardData.totalRevenue) * 100).toFixed(1)}% от общего дохода
              </span>
            </div>
          </div>

          <div className="analytics-card">
            <div className="analytics-icon">📈</div>
            <div className="analytics-content">
              <h3>{averageItemsPerOrder.toFixed(1)}</h3>
              <p>Товаров в среднем за заказ</p>
              <span className="analytics-detail">
                {totalProductOrders} заказов с товарами
              </span>
            </div>
          </div>

          <div className="analytics-card">
            <div className="analytics-icon">🎯</div>
            <div className="analytics-content">
              <h3>{((salesStats.length / dashboardData.totalProducts) * 100).toFixed(1)}%</h3>
              <p>Конверсия товаров</p>
              <span className="analytics-detail">
                Товары которые продавались
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Топ товары с расширенной информацией */}
      <div className="top-products-extended">
        <h2>Рейтинг товаров по продажам</h2>
        
        {salesStats.length > 0 ? (
          <div className="stats-table-container">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Позиция</th>
                  <th>Товар</th>
                  <th>Продано шт.</th>
                  <th>Заказов</th>
                  <th>Выручка</th>
                  <th>Средняя цена</th>
                  <th>% от общих продаж</th>
                </tr>
              </thead>
              <tbody>
                {salesStats.map((product, index) => (
                  <tr key={product.productId} className={index < 3 ? 'top-product' : ''}>
                    <td className="rank">
                      {index + 1}
                      {index === 0 && <span className="rank-badge gold">🥇</span>}
                      {index === 1 && <span className="rank-badge silver">🥈</span>}
                      {index === 2 && <span className="rank-badge bronze">🥉</span>}
                    </td>
                    <td className="product-info">
                      <div className="product-cell">
                        <img 
                          src={`http://localhost:5173${product.productImage}`} 
                          alt={product.productName}
                          className="product-thumb"
                        />
                        <span className="product-name">{product.productName}</span>
                      </div>
                    </td>
                    <td className="sold-count">
                      <span className="number">{product.totalSold}</span>
                    </td>
                    <td className="orders-count">
                      <span className="number">{product.totalOrders}</span>
                    </td>
                    <td className="revenue">
                      <span className="price">{formatCurrency(product.totalRevenue)}</span>
                    </td>
                    <td className="avg-price">
                      <span className="price">
                        {formatCurrency(product.totalRevenue / (product.totalSold || 1))}
                      </span>
                    </td>
                    <td className="percentage">
                      <span className="percent">
                        {((product.totalRevenue / salesRevenue) * 100).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-stats">
            <p>Нет данных о продажах</p>
          </div>
        )}
      </div>

      {/* Последние заказы */}
      <div className="recent-orders-extended">
        <h2>Последние заказы</h2>
        <div className="orders-list">
          {dashboardData.recentOrders.length > 0 ? (
            dashboardData.recentOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h4>Заказ #{order.id}</h4>
                  <span className={`order-status ${order.status}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-details">
                  <p>Дата: {formatDate(order.createdAt)}</p>
                  <p className="order-amount">{formatCurrency(order.totalAmount)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">Нет заказов</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics; 