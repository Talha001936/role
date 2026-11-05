
import { createContext, useContext, useState, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { useToast } from './toastcontext';

const TaskContext = createContext(null);

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};

export const TaskProvider = ({ children }) => {
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [assignableEmployees, setAssignableEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await taskService.getAll();
      setTasks(res.data.tasks);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchAssignableEmployees = useCallback(async () => {
    try {
      const res = await taskService.getAssignable();
      setAssignableEmployees(res.data.employees);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load assignees');
    }
  }, [toast]);

  const searchTasks = useCallback(async (query, status, assignedTo) => {
    try {
      setLoading(true);
      const res = await taskService.search(query, status, assignedTo);
      setTasks(res.data.tasks);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getTask = useCallback(async (id) => {
    try {
      const res = await taskService.getById(id);
      return { success: true, task: res.data.task };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch task');
      return { success: false };
    }
  }, [toast]);

  const createTask = useCallback(async (data) => {
    try {
      const res = await taskService.create(data);
      setTasks((prev) => [...prev, res.data.task]);
      toast.success('Task created');
      await fetchAssignableEmployees();
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
      return { success: false };
    }
  }, [toast, fetchAssignableEmployees]);

  const updateTask = useCallback(async (id, data) => {
    try {
      const res = await taskService.update(id, data);
      const updated = res.data.task;
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.success('Task updated');
      await fetchAssignableEmployees();
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
      return { success: false };
    }
  }, [toast, fetchAssignableEmployees]);

  const updateTaskStatus = useCallback(async (id, status) => {
    try {
      const res = await taskService.updateStatus(id, status);
      const updated = res.data.task;
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.success('Status updated');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
      return { success: false };
    }
  }, [toast]);

  const deleteTask = useCallback(async (id) => {
    try {
      await taskService.remove(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success('Task deleted');
      await fetchAssignableEmployees();
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
      return { success: false };
    }
  }, [toast, fetchAssignableEmployees]);

  return (
    <TaskContext.Provider value={{
      tasks, assignableEmployees, loading,
      fetchTasks, fetchAssignableEmployees, searchTasks, getTask,
      createTask, updateTask, updateTaskStatus, deleteTask
    }}>
      {children}
    </TaskContext.Provider>
  );
};