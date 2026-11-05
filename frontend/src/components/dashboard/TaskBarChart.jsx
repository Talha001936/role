
import { Bar } from 'react-chartjs-2';
import { useTheme } from '@mui/material';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TaskBarChart = ({ data }) => {
  const theme = useTheme();
  if (!data || !Array.isArray(data.datasets) || data.datasets.length === 0) {
    return null;
  }

  const textColor = theme.palette.text.primary;
  const gridColor = 'rgba(255,255,255,0.06)';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
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
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6
      }
    },
    scales: {
      x: { ticks: { color: textColor }, grid: { color: gridColor } },
      y: { beginAtZero: true, ticks: { color: textColor, stepSize: 1 }, grid: { color: gridColor } }
    }
  };

  return (
    <div style={{ height: 320 }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default TaskBarChart;