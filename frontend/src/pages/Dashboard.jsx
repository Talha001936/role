import { useEffect } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as TaskIcon,
  Pending as PendingIcon,
  PlayCircle as ProgressIcon,
  CheckCircle as CompletedIcon
} from '@mui/icons-material';
import { useAuth } from '../context/authcontext';
import { useDashboard } from '../context/dashboardcontext';
import TaskBarChart from '../components/dashboard/TaskBarChart';
import Loading from '../components/common/Loading';

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    sx={{
      p: 2.5, display: 'flex', alignItems: 'center', gap: 2,
      borderLeft: `3px solid ${color}`, borderRadius: 2,
      transition: 'transform .2s, box-shadow .2s',
      '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 24px ${color}22` }
    }}
  >
    <Box sx={{ color, display: 'flex', p: 1.5, borderRadius: 2, backgroundColor: `${color}1a` }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="h5" fontWeight={700}>{value}</Typography>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
    </Box>
  </Paper>
);

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const { stats, chartData, loading, refreshDashboard } = useDashboard();

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  if (loading && !stats) return <Loading message="Loading dashboard..." minHeight="60vh" />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {isAdmin && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Total Users" value={stats?.totalUsers || 0}
                icon={<PeopleIcon />} color="#7c8cf8" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Active Users" value={stats?.activeUsers || 0}
                icon={<PeopleIcon />} color="#4ade80" />
            </Grid>
          </>
        )}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Tasks" value={stats?.totalTasks || 0}
            icon={<TaskIcon />} color="#38bdf8" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending" value={stats?.pendingTasks || 0}
            icon={<PendingIcon />} color="#fbbf24" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="In Progress" value={stats?.inProgressTasks || 0}
            icon={<ProgressIcon />} color="#38bdf8" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Completed" value={stats?.completedTasks || 0}
            icon={<CompletedIcon />} color="#4ade80" />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <TaskBarChart data={chartData} />
      </Paper>
    </Box>
  );
};

export default Dashboard;