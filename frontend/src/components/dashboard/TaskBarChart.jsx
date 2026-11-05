<<<<<<< HEAD
=======

>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
import { Bar } from 'react-chartjs-2';
import { useTheme } from '@mui/material';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TaskBarChart = ({ data }) => {
  const theme = useTheme();
<<<<<<< HEAD
  if (!data || !Array.isArray(data.datasets) || data.datasets.length === 0) return null;

  const textColor = theme.palette.text.secondary;
  const gridColor = 'rgba(255,255,255,0.05)';
=======
  if (!data || !Array.isArray(data.datasets) || data.datasets.length === 0) {
    return null;
  }

  const textColor = theme.palette.text.primary;
  const gridColor = 'rgba(255,255,255,0.06)';
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
<<<<<<< HEAD
      legend: {
        position: 'top',
        labels: { color: textColor, font: { size: 12 }, boxWidth: 10, boxHeight: 10 }
      },
      title: { display: false },
      tooltip: {
        backgroundColor: '#161920',
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: 'rgba(255,255,255,0.08)',
=======
      legend: { position: 'top', labels: { color: textColor, font: { size: 13 } } },
      title: {
        display: true,
        text: 'Activity (Last 7 Days)',
        color: textColor,
        font: { size: 15, weight: '600' }
      },
      tooltip: {
        backgroundColor: '#171a21',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: 'rgba(255,255,255,0.12)',
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6
      }
    },
    scales: {
<<<<<<< HEAD
      x: { ticks: { color: textColor }, grid: { display: false } },
=======
      x: { ticks: { color: textColor }, grid: { color: gridColor } },
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
      y: { beginAtZero: true, ticks: { color: textColor, stepSize: 1 }, grid: { color: gridColor } }
    }
  };

  return (
<<<<<<< HEAD
    <div style={{ height: 300 }}>
=======
    <div style={{ height: 320 }}>
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
      <Bar data={data} options={options} />
    </div>
  );
};

export default TaskBarChart;