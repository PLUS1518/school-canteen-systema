import api from './api';

export const mealsService = {
  // Получить все блюда
  async getAllMeals() {
    try {
      return await api.get('/api/meals');
    } catch (error) {
      console.error('Error fetching meals:', error);
      // Возвращаем заглушку если API недоступен
      return {
        success: true,
        data: [
          {
            id: 1,
            name: 'Куриный суп с лапшой',
            description: 'Ароматный куриный суп с домашней лапшой и овощами',
            price: 120,
            type: 'lunch',
            available: true,
            category: 'первое',
            calories: 250,
            ingredients: ['курица', 'лапша', 'морковь', 'лук']
          },
          {
            id: 2,
            name: 'Гречневая каша с котлетой',
            description: 'Гречневая каша с говяжьей котлетой и овощным салатом',
            price: 150,
            type: 'lunch',
            available: true,
            category: 'второе',
            calories: 350,
            ingredients: ['гречка', 'говядина', 'салат']
          },
          {
            id: 3,
            name: 'Омлет с сыром',
            description: 'Пышный омлет с сыром и зеленью',
            price: 80,
            type: 'breakfast',
            available: true,
            category: 'завтрак',
            calories: 200,
            ingredients: ['яйца', 'сыр', 'зелень']
          },
          {
            id: 4,
            name: 'Творожная запеканка',
            description: 'Нежная творожная запеканка с изюмом и сметаной',
            price: 90,
            type: 'breakfast',
            available: false,
            category: 'завтрак',
            calories: 180,
            ingredients: ['творог', 'изюм', 'сметана']
          },
          {
            id: 5,
            name: 'Салат "Витаминный"',
            description: 'Свежие овощи с зеленью и оливковым маслом',
            price: 70,
            type: 'lunch',
            available: true,
            category: 'салат',
            calories: 120,
            ingredients: ['помидоры', 'огурцы', 'лук', 'масло']
          }
        ]
      };
    }
  },

  async getTodayMenu() {
    try {
      console.log('🍽️ Запрашиваю меню...');
      
      // Делаем запрос напрямую, минуя axios interceptors
      const response = await fetch('http://localhost:3000/api/meals/today');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📡 Данные от бэкенда:', data);
      
      // Проверяем структуру данных бэкенда
      if (data && data.menu) {
        // Преобразуем структуру бэкенда в плоский массив для фронтенда
        const allMeals = [];
        
        // Проходим по всем категориям: breakfast, lunch и т.д.
        Object.entries(data.menu).forEach(([category, meals]) => {
          if (Array.isArray(meals)) {
            meals.forEach(meal => {
              allMeals.push({
                id: meal.id,
                name: meal.name || 'Без названия',
                description: meal.description || '',
                price: meal.price || 0,
                type: category, // 'breakfast', 'lunch'
                available: true,
                category: meal.category || category,
                calories: meal.calories || 0,
                allergens: meal.allergens || ''
              });
            });
          }
        });
        
        console.log(`✅ Преобразовано ${allMeals.length} блюд`);
        
        // Возвращаем в формате, который ожидает MenuPage.jsx
        return {
          success: true,
          data: allMeals
        };
        
      } else {
        console.error('❌ Неверный формат данных:', data);
        return {
          success: false,
          error: 'Неверный формат данных от сервера',
          data: []
        };
      }
      
    } catch (error) {
      console.error('❌ Ошибка загрузки меню:', error);
      
      // Тестовые данные на случай ошибки
      return {
        success: true,
        data: [
          {
            id: 1,
            name: 'Тестовый завтрак',
            description: 'Для отладки',
            price: 100,
            type: 'breakfast',
            available: true
          },
          {
            id: 2,
            name: 'Тестовый обед',
            description: 'Для отладки',
            price: 150,
            type: 'lunch',
            available: true
          }
        ]
      };
    }
  },

  // Получить блюдо по ID
  async getMealById(id) {
    try {
      return await api.get(`/api/meals/${id}`);
    } catch (error) {
      console.error(`Error fetching meal ${id}:`, error);
      throw error;
    }
  },

  // Оставить отзыв на блюдо
  // В meals.js исправьте функцию addFeedback:
    async addFeedback(mealId, rating, comment) {
        try {
            const response = await api.post('/api/feedback', { 
            mealId, 
            rating, 
            comment 
            });
            
            // Проверяем разные форматы ответа
            console.log('Feedback response:', response); // для отладки
            
            if (response && response.success !== undefined) {
            return response;
            } else if (response && response.data) {
            return {
                success: true,
                data: response.data
            };
            } else {
            // Если сервер вернул просто подтверждение
            return {
                success: true,
                data: response
            };
            }
        } catch (error) {
            console.error('Error adding feedback:', error);
            // Вместо throw возвращаем объект с ошибкой
            return {
            success: false,
            error: error.message || 'Ошибка при отправке отзыва'
            };
        }
    },

  // Получить отзывы на блюдо
  async getMealFeedback(mealId) {
    try {
      return await api.get(`/api/feedback/meal/${mealId}`);
    } catch (error) {
      console.error(`Error fetching feedback for meal ${mealId}:`, error);
      // Возвращаем заглушку
      return {
        success: true,
        data: [
          {
            id: 1,
            studentName: 'Иван Учеников',
            rating: 5,
            comment: 'Очень вкусно!',
            date: '2024-01-20'
          },
          {
            id: 2,
            studentName: 'Мария Сидорова',
            rating: 4,
            comment: 'Немного пересолено, но в целом хорошо',
            date: '2024-01-19'
          }
        ]
      };
    }
  }
};