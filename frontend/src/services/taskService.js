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
<<<<<<< HEAD
  updateStatus: (id, status, comment = '') =>
    api.patch(`/tasks/${id}/status`, { status, comment }),
  addComment: (id, text) => api.post(`/tasks/${id}/comments`, { text }),
=======
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  remove: (id) => api.delete(`/tasks/${id}`)
};