import { useEffect } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
<<<<<<< HEAD
import { useDashboard } from '../context/dashboardcontext';
import { useAuth } from '../context/authcontext';
import TaskBarChart from '../components/dashboard/TaskBarChart';
import Loading from '../components/common/Loading';

const formatMoney = (cents, currency = 'usd') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0
  }).format((cents || 0) / 100);

const StatCard = ({ title, value, accent }) => (
  <Paper
    sx={{
      p: 2.5,
      borderRadius: 2,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      borderLeft: accent ? '4px solid' : 'none',
      borderLeftColor: accent || 'transparent'
    }}
  >
    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
      {title}
    </Typography>
    <Typography variant="h5" fontWeight={700}>
      {value}
    </Typography>
=======
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
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  </Paper>
);

const Dashboard = () => {
<<<<<<< HEAD
  const { stats, chartData, paymentChartData, loading, refreshDashboard } = useDashboard();
  const { isAdmin } = useAuth();
=======
  const { isAdmin } = useAuth();
  const { stats, chartData, loading, refreshDashboard } = useDashboard();
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

<<<<<<< HEAD
  if (loading && !stats) {
    return <Loading message="Loading dashboard..." minHeight="60vh" />;
  }

  const showUsers = typeof stats?.totalUsers === 'number';

  const taskCards = [
    ...(showUsers
      ? [
          { title: 'Total Users', value: stats?.totalUsers || 0 },
          { title: 'Active Users', value: stats?.activeUsers || 0 }
        ]
      : []),
    { title: 'Total Tasks', value: stats?.totalTasks || 0 },
    { title: 'Pending', value: stats?.pendingTasks || 0 },
    { title: 'In Progress', value: stats?.inProgressTasks || 0 },
    { title: 'Completed', value: stats?.completedTasks || 0 },
    ...(typeof stats?.overdueTasks === 'number'
      ? [{ title: 'Overdue', value: stats.overdueTasks }]
      : [])
  ];

  const paymentStats = stats?.paymentStats;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {taskCards.map((c) => (
          <Grid item xs={12} sm={6} md={3} key={c.title}>
            <StatCard title={c.title} value={c.value} />
          </Grid>
        ))}
      </Grid>

      {isAdmin && paymentStats && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Payments
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Total Payments" value={paymentStats.totalPayments} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Succeeded"
                value={paymentStats.succeeded}
                accent="#22c55e"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Failed"
                value={paymentStats.failed}
                accent="#ef4444"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Revenue"
                value={formatMoney(paymentStats.revenueCents, paymentStats.currency)}
              />
            </Grid>
          </Grid>
        </>
      )}

      <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <TaskBarChart data={chartData} />
      </Paper>

      {isAdmin && paymentChartData && (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Payments — last 7 days
          </Typography>
          <TaskBarChart data={paymentChartData} />
        </Paper>
      )}
=======
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
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
    </Box>
  );
};

export default Dashboard;