import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Проверяем что пользователь админ
  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-access-denied">
        <h1>Доступ запрещен</h1>
        <p>У вас нет прав доступа к админ панели</p>
        <button onClick={() => navigate('/')}>Вернуться на главную</button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h2>Админ панель</h2>
          <p>Добро пожаловать, {user.name}</p>
        </div>
        
        <nav className="admin-nav">
          <NavLink 
            to="/admin" 
            end
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            📊 Дашборд
          </NavLink>
          
          <NavLink 
            to="/admin/products" 
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            📦 Товары
          </NavLink>
          
          <NavLink 
            to="/admin/orders" 
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            🛒 Заказы
          </NavLink>
          
          <NavLink 
            to="/admin/statistics" 
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            📈 Статистика
          </NavLink>
        </nav>

        <div className="admin-footer">
          <button onClick={() => navigate('/')} className="admin-btn secondary">
            🏠 На сайт
          </button>
          <button onClick={handleLogout} className="admin-btn danger">
            🚪 Выйти
          </button>
        </div>
      </div>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout; 