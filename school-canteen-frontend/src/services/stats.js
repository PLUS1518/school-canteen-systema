// services/stats.js
import api from './api';

export const statsService = {
  // Получить общую статистику
  async getOverview() {
    try {
      return await api.get('/admin/stats/overview');
    } catch (error) {
      // Заглушка для разработки
      console.warn('API не доступен, используем мок данные');
      return {
        data: {
          totalUsers: 154,
          activeOrders: 23,
          todayRevenue: 12560,
          availableMeals: 12,
          weeklyRevenue: 85640,
          totalOrders: 1248,
          activeStudents: 142,
          averageOrderValue: 420,
        }
      };
    }
  },

  // Получить статистику по дням (для графика)
  async getDailyStats(days = 7) {
    try {
      return await api.get(`/admin/stats/daily?days=${days}`);
    } catch (error) {
      // Мок данные для графика
      const mockData = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - i - 1));
        return {
          date: date.toISOString().split('T')[0],
          orders: Math.floor(Math.random() * 50) + 20,
          revenue: Math.floor(Math.random() * 20000) + 8000,
          users: Math.floor(Math.random() * 10) + 5,
        };
      });
      return { data: mockData };
    }
  },

  // Получить последние действия
  async getRecentActivity(limit = 10) {
    try {
      return await api.get(`/admin/stats/activity?limit=${limit}`);
    } catch (error) {
      // Мок данные
      const activities = [
        { id: 1, user: 'Иван Учеников', action: 'Сделал заказ', target: 'Обед №45', time: '10:25', date: '2024-01-15' },
        { id: 2, user: 'Петр Поваров', action: 'Добавил блюдо', target: 'Суп куриный', time: '09:45', date: '2024-01-15' },
        { id: 3, user: 'Мария Ученикова', action: 'Оставила отзыв', target: '4 звезды', time: 'Вчера 14:30' },
        { id: 4, user: 'Админ Системы', action: 'Добавил пользователя', target: 'Новый повар', time: 'Вчера 11:15' },
        { id: 5, user: 'Сергей Учеников', action: 'Пополнил баланс', target: '+500 руб', time: '13.01.2024' },
      ];
      return { data: activities };
    }
  },

  // Получить распределение по ролям
  async getUserDistribution() {
    try {
      return await api.get('/admin/stats/users/distribution');
    } catch (error) {
      return {
        data: {
          students: 142,
          cooks: 8,
          admins: 2,
          parents: 45,
        }
      };
    }
  },
};