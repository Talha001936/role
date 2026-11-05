import api from './api';

export const taskService = {
  getAll: () => api.get('/tasks'),
  search: (query, status, assignedTo) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (status) params.append('status', status);
    if (assignedTo) params.append('assignedTo', assignedTo);
    return api.get(`/tasks/search?${params.toString()}`);
  },
  getAssignable: () => api.get('/tasks/assignable'),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  remove: (id) => api.delete(`/tasks/${id}`)
};