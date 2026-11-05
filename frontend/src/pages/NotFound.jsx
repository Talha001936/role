import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Home as HomeIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper sx={{ p: 5, maxWidth: 480, width: '100%', textAlign: 'center', borderRadius: 3 }}>
        <Typography
          variant="h1"
          sx={{
<<<<<<< HEAD
            fontSize: { xs: '5rem', sm: '7rem' },
            fontWeight: 800,
            lineHeight: 1,
            mb: 2,
            color: 'text.secondary'
=======
            fontSize: { xs: '5rem', sm: '7rem' }, fontWeight: 800, lineHeight: 1,
            background: 'linear-gradient(90deg, #7c8cf8, #b388ff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 2
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
          }}
        >
          404
        </Typography>
        <Typography variant="h5" fontWeight={700} gutterBottom>Page not found</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button variant="contained" startIcon={<HomeIcon />} onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NotFound;