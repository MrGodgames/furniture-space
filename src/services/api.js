const API_BASE_URL = 'http://localhost:5000/api';

// Базовая функция для выполнения запросов
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
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

export default { categoriesAPI, productsAPI }; 