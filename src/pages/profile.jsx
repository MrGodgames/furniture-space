import React, { useState, useEffect } from 'react';
import '../App.css';
import './profile.css';
import App from '../App.jsx';
import Sidebar from '../sidebar.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEdit, faShoppingBag, faCalendarAlt, faMapMarkerAlt, faEnvelope, faPhone, faStar, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api.js';

function Profile() {
    const { user, isAuthenticated, logout, updateUser } = useAuth();
    const navigate = useNavigate();

    // Перенаправляем на страницу входа если пользователь не авторизован
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Состояние для заказов
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [ordersError, setOrdersError] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editUser, setEditUser] = useState(user || {});

    // Загружаем заказы пользователя
    useEffect(() => {
        const loadOrders = async () => {
            if (!isAuthenticated) return;
            
            try {
                setOrdersLoading(true);
                const userOrders = await authAPI.getUserOrders();
                setOrders(userOrders);
                setOrdersError(null);
            } catch (error) {
                console.error('Ошибка загрузки заказов:', error);
                setOrdersError('Не удалось загрузить историю заказов');
                setOrders([]);
            } finally {
                setOrdersLoading(false);
            }
        };

        loadOrders();
    }, [isAuthenticated]);

    // Обновляем editUser когда пользователь изменяется
    useEffect(() => {
        if (user) {
            setEditUser(user);
        }
    }, [user]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Доставлен': 
            case 'Completed':
            case 'Delivered': return '#28a745';
            case 'В обработке': 
            case 'Processing':
            case 'Pending': return '#ffc107';
            case 'Отменен': 
            case 'Cancelled':
            case 'Canceled': return '#dc3545';
            case 'Отправлен':
            case 'Shipped': return '#17a2b8';
            default: return '#6c757d';
        }
    };

    const handleSaveProfile = () => {
        updateUser(editUser);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditUser(user);
        setIsEditing(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Показываем загрузку если пользователь еще не загружен
    if (!user) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <div className='header-container'>
                <App />
            </div>
            <div className='main-container'>
                <div className='sidebar-container'>
                    <Sidebar />
                </div>
                <div className='maincontent'>
                    <div className="profile-header-section">
                        <h1>Личный кабинет</h1>
                        <button className="logout-button" onClick={handleLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            Выйти
                        </button>
                    </div>
                    
                    <div className="profile-page">
                        {/* Информация о пользователе */}
                        <div className="profile-info">
                            <div className="profile-avatar-section">
                                <div className="profile-avatar">
                                    <img src={user.avatar} alt="Аватар пользователя" />
                                    <div className="avatar-overlay">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </div>
                                </div>
                                <div className="profile-stats">
                                    <div className="stat-item">
                                        <FontAwesomeIcon icon={faShoppingBag} />
                                        <span>{user.totalOrders} заказов</span>
                                    </div>
                                    <div className="stat-item">
                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                        <span>С {formatDate(user.joinDate)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="profile-details">
                                {!isEditing ? (
                                    <>
                                        <div className="profile-header">
                                            <h2>{user.name}</h2>
                                            <button className="edit-button" onClick={() => setIsEditing(true)}>
                                                <FontAwesomeIcon icon={faEdit} />
                                                Редактировать
                                            </button>
                                        </div>
                                        
                                        <div className="profile-info-grid">
                                            <div className="info-item">
                                                <FontAwesomeIcon icon={faEnvelope} />
                                                <span>{user.email}</span>
                                            </div>
                                            <div className="info-item">
                                                <FontAwesomeIcon icon={faPhone} />
                                                <span>{user.phone}</span>
                                            </div>
                                            <div className="info-item">
                                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                                                <span>{user.address}</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="edit-form">
                                        <h2>Редактирование профиля</h2>
                                        <div className="form-group">
                                            <label>Имя:</label>
                                            <input 
                                                type="text" 
                                                value={editUser.name || ''}
                                                onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Email:</label>
                                            <input 
                                                type="email" 
                                                value={editUser.email || ''}
                                                onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Телефон:</label>
                                            <input 
                                                type="text" 
                                                value={editUser.phone || ''}
                                                onChange={(e) => setEditUser({...editUser, phone: e.target.value})}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Адрес:</label>
                                            <textarea 
                                                value={editUser.address || ''}
                                                onChange={(e) => setEditUser({...editUser, address: e.target.value})}
                                            />
                                        </div>
                                        <div className="form-buttons">
                                            <button className="save-button" onClick={handleSaveProfile}>
                                                Сохранить
                                            </button>
                                            <button className="cancel-button" onClick={handleCancelEdit}>
                                                Отмена
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* История заказов */}
                        <div className="orders-section">
                            <h2>История заказов</h2>
                            {ordersLoading ? (
                                <div className="orders-loading">
                                    <p>Загрузка заказов...</p>
                                </div>
                            ) : ordersError ? (
                                <div className="orders-error">
                                    <p>{ordersError}</p>
                                    <button onClick={() => window.location.reload()}>
                                        Попробовать снова
                                    </button>
                                </div>
                            ) : orders.length > 0 ? (
                                <div className="orders-list">
                                    {orders.map(order => (
                                        <div key={order.id} className="order-card">
                                            <div className="order-header">
                                                <div className="order-info">
                                                    <h3>Заказ #{order.id}</h3>
                                                    <span className="order-date">{formatDate(order.date)}</span>
                                                </div>
                                                <div className="order-status">
                                                    <span 
                                                        className="status-badge"
                                                        style={{ backgroundColor: getStatusColor(order.status) }}
                                                    >
                                                        {order.status}
                                                    </span>
                                                    <span className="order-total">{order.totalAmount.toLocaleString()} ₽</span>
                                                </div>
                                            </div>
                                            <div className="order-items">
                                                {order.items && order.items.length > 0 ? (
                                                    order.items.map((item, index) => (
                                                        <div key={index} className="order-item">
                                                            <span className="item-name">{item.name}</span>
                                                            <span className="item-details">
                                                                {item.quantity} x {item.price.toLocaleString()} ₽
                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="order-item">
                                                        <span className="item-name">Детали заказа недоступны</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-orders">
                                    <FontAwesomeIcon icon={faShoppingBag} />
                                    <p>У вас пока нет заказов</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;