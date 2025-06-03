import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Логотип и описание */}
          <div className="footer-info">
            <div className="footer-logo">
              <span className="footer-logo-text">Furniture Space</span>
              <span className="footer-logo-accent">Мебель</span>
            </div>
            <p className="footer-description">
              Качественная мебель для вашего дома и офиса.
            </p>
          </div>

       
          <div>
            <h3 className="footer-heading">Навигация</h3>
            <ul className="footer-links">
              <li className="footer-link-item"><Link to="/" className="footer-link">Главная</Link></li>
              <li className="footer-link-item"><Link to="/catalog" className="footer-link">Каталог</Link></li>
              <li className="footer-link-item"><Link to="/about" className="footer-link">О нас</Link></li>
              <li className="footer-link-item"><Link to="/contact" className="footer-link">Контакты</Link></li>
            </ul>
          </div>

          {/* Категории */}
          <div>
            <h3 className="footer-heading">Категории</h3>
            <ul className="footer-links">
              <li className="footer-link-item"><Link to="/catalog/living-room" className="footer-link">Гостиная</Link></li>
              <li className="footer-link-item"><Link to="/catalog/bedroom" className="footer-link">Спальня</Link></li>
              <li className="footer-link-item"><Link to="/catalog/kitchen" className="footer-link">Кухня</Link></li>
              <li className="footer-link-item"><Link to="/catalog/office" className="footer-link">Офис</Link></li>
              <li className="footer-link-item"><Link to="/catalog/kids" className="footer-link">Детская</Link></li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="footer-heading">Контакты</h3>
            <ul className="footer-links">
              <li className="footer-contact-item">
                <svg className="footer-contact-icon" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="footer-contact-text">г. Москва, Ореховый бульвар, д. 24, корп. 3</span>
              </li>
              <li className="footer-contact-item">
                <svg className="footer-contact-icon" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="footer-contact-text">+7 (964) 015-57-88</span>
              </li>
              <li className="footer-contact-item">
                <svg className="footer-contact-icon" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="footer-contact-text">ruminatop@yandex.ru</span>
              </li>
              <li className="footer-contact-item">
                <svg className="footer-contact-icon" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="footer-contact-text">Пн–Вс: 10:00–19:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Копирайт */}
        <div className="footer-copyright">
          <p> {new Date().getFullYear()} RUMINA Мебель.</p>
        </div>
      </div>
    </footer>
  );
} 