import api from './api';

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
<<<<<<< HEAD
  getChart: () => api.get('/dashboard/chart'),
  getPaymentChart: () => api.get('/dashboard/payment-chart')
=======
  getChart: () => api.get('/dashboard/chart')
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
};