import axios from 'axios';

// Базовый URL твоего бэкенда с /api
const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Интерцептор для добавления токена к запросам (если есть)
api.interceptors.request.use(
  (config) => {
    // Используем заглушечный токен для разработки
    const token = localStorage.getItem('token') || 'mock-jwt-token-for-testing';
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Добавляю токен к запросу:', config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ЕДИНСТВЕННЫЙ интерцептор для ответов
api.interceptors.response.use(
  (response) => {
    // Если сервер возвращает успешный ответ
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response || error.message);
    
    // Обработка ошибок
    if (error.response) {
      // Сервер ответил с кодом ошибки
      switch (error.response.status) {
        case 401:
          // Не авторизован
          //localStorage.removeItem('token');
          //localStorage.removeItem('user');
          //window.location.href = '/login';
          //break;
          console.error('🔴 Ошибка 401 при запросе:', {
            url: error.config?.url,
            method: error.config?.method,
            data: error.response?.data
          });
          
          // Пробрасываем ошибку дальше, чтобы её можно было обработать в компоненте
          return Promise.reject(error);
          break;
        case 403:
          // Нет доступа
          alert('У вас нет прав для этого действия');
          break;
        case 404:
          // Не найдено
          console.warn('Ресурс не найден:', error.config.url);
          break;
        case 500:
          // Ошибка сервера
          alert('Ошибка сервера. Попробуйте позже');
          break;
        default:
          console.warn(`Необработанный статус ошибки: ${error.response.status}`);
          break;
      }
      
      // Возвращаем ошибку в понятном формате
      return Promise.reject({
        success: false,
        status: error.response.status,
        message: error.response.data?.message || error.response.statusText,
        data: error.response.data
      });
    } else if (error.request) {
      // Запрос был сделан, но ответа нет
      console.error('Нет ответа от сервера');
      return Promise.reject({
        success: false,
        message: 'Сервер не отвечает. Проверьте подключение'
      });
    } else {
      // Ошибка при настройке запроса
      console.error('Ошибка запроса:', error.message);
      return Promise.reject({
        success: false,
        message: error.message
      });
    }
  }
);

export default api;