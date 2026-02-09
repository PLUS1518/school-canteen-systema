import api from './api';

export const authService = {
  async login(login, password) {
    try {
      const response = await api.post('/auth/login', { login, password });
      return response;
    } catch (error) {
      throw error;
    }
  },

  async getProfile() {
    try {
      return await api.get('/api/auth/profile');
    } catch (error) {
      throw error;
    }
  },

  async updateProfile(data) {
    try {
      return await api.patch('/api/auth/profile', data);
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
};