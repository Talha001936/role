import api from './api';

export const paymentService = {
  getCatalog: () => api.get('/payments/catalog'),
  getSummary: () => api.get('/payments/summary'),

  createSignupCheckout: () => api.post('/payments/signup-checkout'),
  createSubscriptionCheckout: (plan) => api.post('/payments/subscribe', { plan }),
  openBillingPortal: () => api.post('/payments/portal'),

  getPaymentStatus: () =>
    api.get('/payments/status', { skipAuthHandler: true }),

  syncMyPayment: () =>
    api.post('/payments/sync', {}, { skipAuthHandler: true }),

  verifySession: (sessionId) =>
    api.post('/payments/verify', { sessionId }, { skipAuthHandler: true }),

  listAllPayments: () => api.get('/payments/all'),
  getPaymentById: (id) => api.get(`/payments/all/${id}`),
  downloadInvoice: (id) =>
    api.get(`/payments/all/${id}/invoice`, { responseType: 'blob' }),

  reconcileAll: () => api.post('/payments/reconcile/all'),
  reconcileUser: (userId) => api.post(`/payments/reconcile/${userId}`)
};