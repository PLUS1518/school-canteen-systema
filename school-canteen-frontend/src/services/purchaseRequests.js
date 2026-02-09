import api from './api';

export const purchaseRequestsService = {
  // Создать заявку на закупку (повар)
  async createRequest(requestData) {
    try {
      return await api.post('/api/purchase-requests', requestData);
    } catch (error) {
      console.error('Error creating purchase request:', error);
      throw error;
    }
  },

  // Получить мои заявки (повар)
  async getMyRequests() {
    try {
      return await api.get('/api/purchase-requests/my');
    } catch (error) {
      console.error('Error fetching my purchase requests:', error);
      throw error;
    }
  },

  // Получить все заявки (админ)
  async getAllRequests() {
    try {
      return await api.get('/api/purchase-requests');
    } catch (error) {
      console.error('Error fetching all purchase requests:', error);
      throw error;
    }
  },

  // Изменить статус заявки (админ)
  async updateRequestStatus(requestId, status, comment = '') {
    try {
      return await api.patch(`/api/purchase-requests/${requestId}/status`, {
        status,
        comment,
      });
    } catch (error) {
      console.error('Error updating request status:', error);
      throw error;
    }
  },
};