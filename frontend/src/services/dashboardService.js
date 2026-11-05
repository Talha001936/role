import api from './api';

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getChart: () => api.get('/dashboard/chart')
};