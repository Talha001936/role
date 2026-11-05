import { Box, CircularProgress, Typography } from '@mui/material';

const Loading = ({
  message = 'Loading...',
  fullScreen = false,
  minHeight = '200px',
  size = 40
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      width: '100%',
      minHeight: fullScreen ? '100vh' : minHeight
    }}
  >
    <CircularProgress size={size} thickness={4} />
    {message && (
      <Typography variant="body2" color="text.secondary">{message}</Typography>
    )}
  </Box>
);

export default Loading;