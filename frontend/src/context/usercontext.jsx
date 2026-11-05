import { createContext, useContext, useState, useCallback } from 'react';
import { userService } from '../services/userService';
import { useToast } from './toastcontext';

const UserContext = createContext(null);

export const useUsers = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUsers must be used within UserProvider');
  return ctx;
};

export const UserProvider = ({ children }) => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userService.getAll();
      setUsers(res.data.users);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const searchUsers = useCallback(async (query, status, role) => {
    try {
      setLoading(true);
      const res = await userService.search(query, status, role);
      setUsers(res.data.users);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getBlockingTasks = useCallback(async (userId) => {
    try {
      const res = await userService.getBlockingTasks(userId);
      return { success: true, ...res.data };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load tasks');
      return { success: false, count: 0, tasks: [] };
    }
  }, [toast]);

<<<<<<< HEAD
=======
  const createUser = useCallback(async (data) => {
    try {
      const res = await userService.create(data);
      setUsers((prev) => [...prev, res.data.user]);
      toast.success('User created');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
      return { success: false };
    }
  }, [toast]);

>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  const updateUserStatus = useCallback(async (id, status) => {
    try {
      await userService.updateStatus(id, status);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
      toast.success(status === 'active' ? 'User activated' : 'User deactivated');
      return { success: true };
    } catch (err) {
      const data = err.response?.data;
      toast.error(data?.message || 'Failed to update status');
      return {
        success: false,
        blockingTasks: data?.blockingTasks || []
      };
    }
  }, [toast]);

  const deleteUser = useCallback(async (id) => {
    try {
      await userService.remove(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success('User deleted');
      return { success: true };
    } catch (err) {
      const data = err.response?.data;
      toast.error(data?.message || 'Failed to delete user');
      return {
        success: false,
        blockingTasks: data?.blockingTasks || []
      };
    }
  }, [toast]);

  return (
    <UserContext.Provider value={{
      users, loading,
      fetchUsers, searchUsers,
      getBlockingTasks,
<<<<<<< HEAD
      updateUserStatus, deleteUser
=======
      createUser, updateUserStatus, deleteUser
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    }}>
      {children}
    </UserContext.Provider>
  );
};