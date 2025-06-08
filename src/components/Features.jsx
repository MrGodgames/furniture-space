import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faShield, faHeadset, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: faTruck,
      title: 'Быстрая доставка',
      description: 'Доставляем по всей России в течение 1-3 дней'
    },
    {
      icon: faShield,
      title: 'Гарантия качества',
      description: 'Официальная гарантия от производителя до 5 лет'
    },
    {
      icon: faHeadset,
      title: 'Поддержка 24/7',
      description: 'Наши консультанты всегда готовы помочь'
    },
    {
      icon: faCreditCard,
      title: 'Удобная оплата',
      description: 'Рассрочка 0% и различные способы оплаты'
    }
  ];

  return (
    <section className="features">
      <div className="features-container">
        <h2 className="features-title">Почему выбирают нас</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <div className="feature-icon">
                <FontAwesomeIcon icon={feature.icon} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 