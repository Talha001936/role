
import { createContext, useContext, useState, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import { useToast } from './toastcontext';

const DashboardContext = createContext(null);

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
};

export const DashboardProvider = ({ children }) => {
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
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

  const refreshDashboard = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchChartData()]);
    setLoading(false);
  }, [fetchStats, fetchChartData]);

  return (
    <DashboardContext.Provider value={{
      stats, chartData, loading, fetchStats, fetchChartData, refreshDashboard
    }}>
      {children}
    </DashboardContext.Provider>
  );
};