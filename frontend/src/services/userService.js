import api from './api';

export const userService = {
  getAll: () => api.get('/users'),
  getBlockingTasks: (id) => api.get(`/users/${id}/blocking-tasks`),
  search: (query, status, role) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (status) params.append('status', status);
    if (role) params.append('role', role);
    return api.get(`/users/search?${params.toString()}`);
  },
  create: (data) => api.post('/users', data),
  updateStatus: (id, status) => api.patch(`/users/${id}/status`, { status }),
  remove: (id) => api.delete(`/users/${id}`)
};