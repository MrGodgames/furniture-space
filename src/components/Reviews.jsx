import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faStarHalfAlt, 
  faUser, 
  faCamera, 
  faTimes, 
  faThumbsUp, 
  faThumbsDown,
  faFlag,
  faExpand
} from '@fortawesome/free-solid-svg-icons';
import { getImageUrl } from '../services/api';
import './Reviews.css';

const Reviews = ({ productId, productName }) => {
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    name: '',
    email: '',
    images: []
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [expandedImage, setExpandedImage] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');

  // Загрузка отзывов
  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy, filterRating]);

  const fetchReviews = async () => {
    try {
      // Здесь будет API вызов для загрузки отзывов
      // Пока используем мок данные
      const mockReviews = [
        {
          id: 1,
          rating: 5,
          title: 'Отличное качество!',
          comment: 'Очень довольна покупкой. Мебель качественная, доставка быстрая.',
          name: 'Анна К.',
          date: '2024-01-15',
          images: [],
          likes: 12,
          dislikes: 1,
          helpful: true
        },
        {
          id: 2,
          rating: 4,
          title: 'Хорошо, но есть нюансы',
          comment: 'В целом товар хороший, но упаковка была немного повреждена.',
          name: 'Михаил С.',
          date: '2024-01-10',
          images: [],
          likes: 8,
          dislikes: 2,
          helpful: false
        }
      ];
      setReviews(mockReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= rating;
      const isHalf = !isFilled && i - 0.5 <= rating;
      
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={isHalf ? faStarHalfAlt : faStar}
          className={`star ${isFilled ? 'filled' : 'empty'} ${interactive ? 'interactive' : ''}`}
          onClick={interactive ? () => onStarClick(i) : undefined}
        />
      );
    }
    
    return stars;
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 5) {
      alert('Можно загрузить максимум 5 изображений');
      return;
    }

    const newImages = files.map(file => ({
      file,
      id: Date.now() + Math.random(),
      preview: URL.createObjectURL(file)
    }));

    setSelectedImages(prev => [...prev, ...newImages]);
    setPreviewImages(prev => [...prev, ...newImages.map(img => img.preview)]);
  };

  const removeImage = (imageId) => {
    setSelectedImages(prev => prev.filter(img => img.id !== imageId));
    setPreviewImages(prev => {
      const imageToRemove = selectedImages.find(img => img.id === imageId);
      return prev.filter(preview => preview !== imageToRemove?.preview);
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!newReview.comment.trim() || !newReview.name.trim()) {
      alert('Пожалуйста, заполните обязательные поля');
      return;
    }

    try {
      // Здесь будет API вызов для отправки отзыва
      const reviewData = {
        ...newReview,
        productId,
        date: new Date().toISOString().split('T')[0],
        images: selectedImages.map(img => img.file),
        likes: 0,
        dislikes: 0,
        helpful: false
      };

      console.log('Submitting review:', reviewData);
      
      // Очищаем форму
      setNewReview({
        rating: 5,
        title: '',
        comment: '',
        name: '',
        email: '',
        images: []
      });
      setSelectedImages([]);
      setPreviewImages([]);
      setShowReviewForm(false);
      
      // Обновляем список отзывов
      fetchReviews();
      
      alert('Отзыв успешно отправлен!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Ошибка при отправке отзыва');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const filteredReviews = reviews.filter(review => {
    if (filterRating === 'all') return true;
    return review.rating === parseInt(filterRating);
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  const averageRating = getAverageRating();
  const ratingDistribution = getRatingDistribution();

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h3>Отзывы о товаре</h3>
        <button 
          className="add-review-btn"
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          {showReviewForm ? 'Отменить' : 'Написать отзыв'}
        </button>
      </div>

      {/* Статистика отзывов */}
      <div className="reviews-stats">
        <div className="rating-summary">
          <div className="average-rating">
            <span className="rating-number">{averageRating}</span>
            <div className="rating-stars">
              {renderStars(parseFloat(averageRating))}
            </div>
            <span className="reviews-count">({reviews.length} отзывов)</span>
          </div>
        </div>

        <div className="rating-distribution">
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="rating-bar">
              <span className="rating-label">{rating}</span>
              <FontAwesomeIcon icon={faStar} className="star filled small" />
              <div className="bar-container">
                <div 
                  className="bar-fill"
                  style={{ 
                    width: reviews.length > 0 ? `${(ratingDistribution[rating] / reviews.length) * 100}%` : '0%' 
                  }}
                />
              </div>
              <span className="rating-count">({ratingDistribution[rating]})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Фильтры и сортировка */}
      <div className="reviews-filters">
        <div className="filter-group">
          <label>Сортировать:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
            <option value="highest">Высокий рейтинг</option>
            <option value="lowest">Низкий рейтинг</option>
            <option value="helpful">Самые полезные</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Фильтр по рейтингу:</label>
          <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
            <option value="all">Все отзывы</option>
            <option value="5">5 звезд</option>
            <option value="4">4 звезды</option>
            <option value="3">3 звезды</option>
            <option value="2">2 звезды</option>
            <option value="1">1 звезда</option>
          </select>
        </div>
      </div>

      {/* Форма добавления отзыва */}
      {showReviewForm && (
        <form className="review-form" onSubmit={handleSubmitReview}>
          <h4>Добавить отзыв</h4>
          
          <div className="form-group">
            <label>Ваша оценка *</label>
            <div className="rating-input">
              {renderStars(newReview.rating, true, (rating) => 
                setNewReview(prev => ({ ...prev, rating }))
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ваше имя *</label>
              <input
                type="text"
                value={newReview.name}
                onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label>Email (не публикуется)</label>
              <input
                type="email"
                value={newReview.email}
                onChange={(e) => setNewReview(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Заголовок отзыва</label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Краткое резюме вашего отзыва"
            />
          </div>

          <div className="form-group">
            <label>Ваш отзыв *</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Поделитесь своим мнением о товаре..."
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Фотографии (максимум 5)</label>
            <div className="image-upload">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                id="review-images"
                style={{ display: 'none' }}
              />
              <label htmlFor="review-images" className="upload-btn">
                <FontAwesomeIcon icon={faCamera} />
                Добавить фото
              </label>
            </div>

            {previewImages.length > 0 && (
              <div className="image-previews">
                {selectedImages.map((image) => (
                  <div key={image.id} className="image-preview">
                    <img src={image.preview} alt="Preview" />
                    <button 
                      type="button"
                      className="remove-image"
                      onClick={() => removeImage(image.id)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setShowReviewForm(false)}>
              Отменить
            </button>
            <button type="submit" className="submit-btn">
              Отправить отзыв
            </button>
          </div>
        </form>
      )}

      {/* Список отзывов */}
      <div className="reviews-list">
        {sortedReviews.length === 0 ? (
          <div className="no-reviews">
            <p>Пока нет отзывов о этом товаре.</p>
            <p>Будьте первым, кто оставит отзыв!</p>
          </div>
        ) : (
          sortedReviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <div className="reviewer-details">
                    <span className="reviewer-name">{review.name}</span>
                    <span className="review-date">{formatDate(review.date)}</span>
                  </div>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
              </div>

              {review.title && (
                <h5 className="review-title">{review.title}</h5>
              )}

              <p className="review-comment">{review.comment}</p>

              {review.images && review.images.length > 0 && (
                <div className="review-images">
                  {review.images.map((image, index) => (
                    <div key={index} className="review-image">
                      <img 
                        src={getImageUrl(image)} 
                        alt={`Отзыв ${index + 1}`}
                        onClick={() => setExpandedImage(getImageUrl(image))}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="review-actions">
                <button className="helpful-btn">
                  <FontAwesomeIcon icon={faThumbsUp} />
                  Полезно ({review.likes})
                </button>
                <button className="not-helpful-btn">
                  <FontAwesomeIcon icon={faThumbsDown} />
                  ({review.dislikes})
                </button>
                <button className="report-btn">
                  <FontAwesomeIcon icon={faFlag} />
                  Пожаловаться
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Модальное окно для увеличенного изображения */}
      {expandedImage && (
        <div className="image-modal-overlay" onClick={() => setExpandedImage(null)}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-modal"
              onClick={() => setExpandedImage(null)}
            >
              ×
            </button>
            <img 
              src={expandedImage} 
              alt="Увеличенное изображение"
              className="modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews; 