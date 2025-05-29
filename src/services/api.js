const API_BASE_URL = 'http://localhost:5008/api';

// URL сервера с изображениями (для локальной разработки используем localhost)
const IMAGE_SERVER_URL = 'http://localhost:5173';

// Функция для преобразования пути изображения в полный URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Если путь уже содержит http/https, возвращаем как есть
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Для локальной разработки: изображения в папке public/uploads
  if (imagePath.startsWith('/uploads/')) {
    return `${IMAGE_SERVER_URL}${imagePath}`;
  }
  
  // Если путь не начинается с /, добавляем /
  if (!imagePath.startsWith('/')) {
    return `${IMAGE_SERVER_URL}/uploads/${imagePath}`;
  }
  
  return `${IMAGE_SERVER_URL}${imagePath}`;
};

// Альтернативная функция для получения изображения через наш API proxy
export const getProxyImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Удаляем ведущий слеш если есть
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  
  return `${API_BASE_URL}/images/${cleanPath}`;
};

// Функция для получения fallback изображения
export const getImageWithFallback = (imagePath) => {
  const directUrl = getImageUrl(imagePath);
  const proxyUrl = getProxyImageUrl(imagePath);
  
  return {
    primary: directUrl,
    fallback: proxyUrl,
    placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZVUk5JVFVSRSBTSEFT0U8L3RleHQ+PC9zdmc+'
  };
};

// Функция для получения токена из localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Базовая функция для выполнения запросов
const apiRequest = async (endpoint, options = {}) => {
  try {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Добавляем токен авторизации если он есть
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// API для аутентификации
export const authAPI = {
  // Вход пользователя
  login: async (loginData) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
    
    // Сохраняем токен в localStorage
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    
    return response;
  },

  // Регистрация пользователя
  register: async (registerData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });
    
    // Сохраняем токен в localStorage
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    
    return response;
  },

  // Получение профиля пользователя
  getProfile: () => apiRequest('/users/profile'),

  // Обновление профиля пользователя
  updateProfile: (profileData) => apiRequest('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),

  // Выход пользователя
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  },

  // Получение заказов пользователя
  getUserOrders: () => apiRequest('/users/orders'),
};

// API для категорий
export const categoriesAPI = {
  // Получить все категории
  getAll: () => apiRequest('/categories'),
  
  // Получить категорию по ID
  getById: (id) => apiRequest(`/categories/${id}`),
  
  // Получить категорию по slug
  getBySlug: (slug) => apiRequest(`/categories/slug/${slug}`),
};

// API для продуктов
export const productsAPI = {
  // Получить все продукты
  getAll: () => apiRequest('/products'),
  
  // Получить продукт по ID
  getById: (id) => apiRequest(`/products/${id}`),
  
  // Получить продукты по категории
  getByCategory: (categoryId) => apiRequest(`/products/category/${categoryId}`),
  
  // Получить рекомендуемые продукты
  getFeatured: () => apiRequest('/products/featured'),
  
  // Получить новые продукты
  getNew: () => apiRequest('/products/new'),
  
  // Получить продукты в наличии
  getInStock: () => apiRequest('/products/in-stock'),
  
  // Поиск продуктов
  search: (searchTerm) => apiRequest(`/products/search?searchTerm=${encodeURIComponent(searchTerm)}`),
  
  // Получить продукты по диапазону цен
  getByPriceRange: (minPrice, maxPrice) => apiRequest(`/products/price-range?min=${minPrice}&max=${maxPrice}`),
};

// API для заказов
export const ordersAPI = {
  // Создать заказ
  create: (orderData) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),

  // Получить заказ по ID
  getById: (id) => apiRequest(`/orders/${id}`),

  // Обновить статус заказа
  updateStatus: (id, status) => apiRequest(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),

  // Отменить заказ
  cancel: (id) => apiRequest(`/orders/${id}`, {
    method: 'DELETE',
  }),
};

export default { authAPI, categoriesAPI, productsAPI, ordersAPI }; 