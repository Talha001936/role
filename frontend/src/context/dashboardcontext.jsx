<<<<<<< HEAD
import { createContext, useContext, useState, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import { useToast } from './toastcontext';
import { useAuth } from './authcontext';
=======

import { createContext, useContext, useState, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import { useToast } from './toastcontext';
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870

const DashboardContext = createContext(null);

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
};

export const DashboardProvider = ({ children }) => {
  const toast = useToast();
<<<<<<< HEAD
  const { isAdmin } = useAuth();

  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [paymentChartData, setPaymentChartData] = useState(null);
=======
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await dashboardService.getStats();
      setStats(res.data.stats);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load stats');
    }
  }, [toast]);

  const fetchChartData = useCallback(async () => {
    try {
      const res = await dashboardService.getChart();
      setChartData(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load chart');
    }
  }, [toast]);

<<<<<<< HEAD
  const fetchPaymentChart = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const res = await dashboardService.getPaymentChart();
      setPaymentChartData(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load payment chart');
    }
  }, [toast, isAdmin]);

  const refreshDashboard = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchChartData(), fetchPaymentChart()]);
    setLoading(false);
  }, [fetchStats, fetchChartData, fetchPaymentChart]);

  return (
    <DashboardContext.Provider value={{
      stats,
      chartData,
      paymentChartData,
      loading,
      fetchStats,
      fetchChartData,
      fetchPaymentChart,
      refreshDashboard
=======
  const refreshDashboard = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchChartData()]);
    setLoading(false);
  }, [fetchStats, fetchChartData]);

  return (
    <DashboardContext.Provider value={{
      stats, chartData, loading, fetchStats, fetchChartData, refreshDashboard
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    }}>
      {children}
    </DashboardContext.Provider>
  );
};