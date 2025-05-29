import React, { useState, useEffect } from 'react';
import '../App.css';
import './login.css';
import App from '../App.jsx';
import Sidebar from '../sidebar.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faPhone, faMapMarkerAlt, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Login() {
    const [isLogin, setIsLogin] = useState(true); // true - вход, false - регистрация
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login, register, isAuthenticated } = useAuth();

    // Перенаправляем на профиль если пользователь уже авторизован
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/profile');
        }
    }, [isAuthenticated, navigate]);

    // Состояние для формы входа
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    // Состояние для формы регистрации
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    // Валидация email
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Валидация телефона
    const validatePhone = (phone) => {
        const re = /^(\+7|8)\s?\(?\d{3}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;
        return re.test(phone);
    };

    // Обработка входа
    const handleLogin = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!loginData.email) {
            newErrors.email = 'Введите email';
        } else if (!validateEmail(loginData.email)) {
            newErrors.email = 'Некорректный email';
        }

        if (!loginData.password) {
            newErrors.password = 'Введите пароль';
        } else if (loginData.password.length < 6) {
            newErrors.password = 'Пароль должен содержать минимум 6 символов';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            try {
                const result = await login(loginData);
                
                if (result.success) {
                    navigate('/profile');
                } else {
                    setErrors({ general: result.error });
                }
            } catch (error) {
                setErrors({ general: 'Ошибка входа. Проверьте данные.' });
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Обработка регистрации
    const handleRegister = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!registerData.name.trim()) {
            newErrors.name = 'Введите имя';
        }

        if (!registerData.email) {
            newErrors.email = 'Введите email';
        } else if (!validateEmail(registerData.email)) {
            newErrors.email = 'Некорректный email';
        }

        if (!registerData.phone) {
            newErrors.phone = 'Введите телефон';
        } else if (!validatePhone(registerData.phone)) {
            newErrors.phone = 'Некорректный номер телефона';
        }

        if (!registerData.address.trim()) {
            newErrors.address = 'Введите адрес';
        }

        if (!registerData.password) {
            newErrors.password = 'Введите пароль';
        } else if (registerData.password.length < 6) {
            newErrors.password = 'Пароль должен содержать минимум 6 символов';
        }

        if (!registerData.confirmPassword) {
            newErrors.confirmPassword = 'Подтвердите пароль';
        } else if (registerData.password !== registerData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            try {
                // Подготавливаем данные для API
                const registrationData = {
                    name: registerData.name,
                    email: registerData.email,
                    phone: registerData.phone,
                    address: registerData.address,
                    password: registerData.password,
                    confirmPassword: registerData.confirmPassword
                };

                const result = await register(registrationData);
                
                if (result.success) {
                    navigate('/profile');
                } else {
                    setErrors({ general: result.error });
                }
            } catch (error) {
                setErrors({ general: 'Ошибка регистрации. Попробуйте снова.' });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setErrors({});
        setLoginData({ email: '', password: '' });
        setRegisterData({
            name: '',
            email: '',
            phone: '',
            address: '',
            password: '',
            confirmPassword: ''
        });
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
                <div className='maincontent'>
                    <h1>{isLogin ? 'Вход в личный кабинет' : 'Регистрация'}</h1>
                    
                    <div className="login-page">
                        <div className="auth-container">
                            <div className="auth-tabs">
                                <button 
                                    className={`tab-button ${isLogin ? 'active' : ''}`}
                                    onClick={() => setIsLogin(true)}
                                >
                                    Вход
                                </button>
                                <button 
                                    className={`tab-button ${!isLogin ? 'active' : ''}`}
                                    onClick={() => setIsLogin(false)}
                                >
                                    Регистрация
                                </button>
                            </div>

                            {errors.general && (
                                <div className="error-message general-error">
                                    {errors.general}
                                </div>
                            )}

                            {isLogin ? (
                                // Форма входа
                                <form onSubmit={handleLogin} className="auth-form">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <div className="input-wrapper">
                                            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                                            <input
                                                type="email"
                                                value={loginData.email}
                                                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                                                placeholder="Введите ваш email"
                                                className={errors.email ? 'error' : ''}
                                            />
                                        </div>
                                        {errors.email && <span className="error-text">{errors.email}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Пароль</label>
                                        <div className="input-wrapper">
                                            <FontAwesomeIcon icon={faLock} className="input-icon" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={loginData.password}
                                                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                                placeholder="Введите пароль"
                                                className={errors.password ? 'error' : ''}
                                            />
                                            <FontAwesomeIcon 
                                                icon={showPassword ? faEyeSlash : faEye} 
                                                className="password-toggle"
                                                onClick={() => setShowPassword(!showPassword)}
                                            />
                                        </div>
                                        {errors.password && <span className="error-text">{errors.password}</span>}
                                    </div>

                                    <button type="submit" className="submit-button" disabled={isLoading}>
                                        {isLoading ? 'Вход...' : 'Войти'}
                                    </button>

                                    <div className="form-footer">
                                        <p>
                                            Нет аккаунта? 
                                            <button type="button" className="link-button" onClick={toggleForm}>
                                                Зарегистрироваться
                                            </button>
                                        </p>
                                    </div>
                                </form>
                            ) : (
                                // Форма регистрации
                                <form onSubmit={handleRegister} className="auth-form">
                                    <div className="form-group">
                                        <label>Имя</label>
                                        <div className="input-wrapper">
                                            <FontAwesomeIcon icon={faUser} className="input-icon" />
                                            <input
                                                type="text"
                                                value={registerData.name}
                                                onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                                                placeholder="Введите ваше имя"
                                                className={errors.name ? 'error' : ''}
                                            />
                                        </div>
                                        {errors.name && <span className="error-text">{errors.name}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Email</label>
                                        <div className="input-wrapper">
                                            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                                            <input
                                                type="email"
                                                value={registerData.email}
                                                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                                                placeholder="Введите ваш email"
                                                className={errors.email ? 'error' : ''}
                                            />
                                        </div>
                                        {errors.email && <span className="error-text">{errors.email}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Телефон</label>
                                        <div className="input-wrapper">
                                            <FontAwesomeIcon icon={faPhone} className="input-icon" />
                                            <input
                                                type="tel"
                                                value={registerData.phone}
                                                onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                                                placeholder="+7 (999) 123-45-67"
                                                className={errors.phone ? 'error' : ''}
                                            />
                                        </div>
                                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Адрес</label>
                                        <div className="input-wrapper">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="input-icon" />
                                            <input
                                                type="text"
                                                value={registerData.address}
                                                onChange={(e) => setRegisterData({...registerData, address: e.target.value})}
                                                placeholder="Введите ваш адрес"
                                                className={errors.address ? 'error' : ''}
                                            />
                                        </div>
                                        {errors.address && <span className="error-text">{errors.address}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Пароль</label>
                                        <div className="input-wrapper">
                                            <FontAwesomeIcon icon={faLock} className="input-icon" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={registerData.password}
                                                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                                                placeholder="Придумайте пароль"
                                                className={errors.password ? 'error' : ''}
                                            />
                                            <FontAwesomeIcon 
                                                icon={showPassword ? faEyeSlash : faEye} 
                                                className="password-toggle"
                                                onClick={() => setShowPassword(!showPassword)}
                                            />
                                        </div>
                                        {errors.password && <span className="error-text">{errors.password}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Подтвердите пароль</label>
                                        <div className="input-wrapper">
                                            <FontAwesomeIcon icon={faLock} className="input-icon" />
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={registerData.confirmPassword}
                                                onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                                                placeholder="Повторите пароль"
                                                className={errors.confirmPassword ? 'error' : ''}
                                            />
                                            <FontAwesomeIcon 
                                                icon={showConfirmPassword ? faEyeSlash : faEye} 
                                                className="password-toggle"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            />
                                        </div>
                                        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                                    </div>

                                    <button type="submit" className="submit-button" disabled={isLoading}>
                                        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                                    </button>

                                    <div className="form-footer">
                                        <p>
                                            Уже есть аккаунт? 
                                            <button type="button" className="link-button" onClick={toggleForm}>
                                                Войти
                                            </button>
                                        </p>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login; 