import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
<<<<<<< HEAD
    primary: { main: '#8b95f6' },
    secondary: { main: '#8b95f6' },
    background: { default: '#0f1115', paper: '#161920' },
    text: { primary: '#e6e8ef', secondary: '#8a90a2' },
    divider: 'rgba(255,255,255,0.06)',
    success: { main: '#6ee7a8' },
    warning: { main: '#f0c674' },
    error: { main: '#f08a8a' },
    info: { main: '#8ab4f8' }
=======
    primary: { main: '#7c8cf8' },
    secondary: { main: '#b388ff' },
    background: { default: '#0f1115', paper: '#171a21' },
    text: { primary: '#e6e8ef', secondary: '#8a90a2' },
    divider: 'rgba(255,255,255,0.08)',
    success: { main: '#4ade80' },
    warning: { main: '#fbbf24' },
    error: { main: '#f87171' },
    info: { main: '#38bdf8' }
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  },
  typography: {
    fontFamily: '"Inter","Roboto","Helvetica","Arial",sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0f1115',
<<<<<<< HEAD
=======
          backgroundImage:
            'radial-gradient(circle at 20% -10%, rgba(124,140,248,0.12), transparent 45%), radial-gradient(circle at 90% 10%, rgba(179,136,255,0.10), transparent 40%)',
          backgroundAttachment: 'fixed',
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
          minHeight: '100vh'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255,255,255,0.06)'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
<<<<<<< HEAD
          backgroundColor: '#161920',
=======
          backgroundColor: 'rgba(23,26,33,0.85)',
          backdropFilter: 'blur(10px)',
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
          backgroundImage: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          boxShadow: 'none'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#12151b',
          backgroundImage: 'none',
          borderRight: '1px solid rgba(255,255,255,0.06)'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
<<<<<<< HEAD
          backgroundColor: 'transparent',
          fontWeight: 600,
          color: '#8a90a2',
=======
          backgroundColor: 'rgba(124,140,248,0.06)',
          fontWeight: 600,
          color: '#a5b0ff',
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        },
        body: { borderBottom: '1px solid rgba(255,255,255,0.04)' }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
<<<<<<< HEAD
          backgroundColor: 'transparent',
          '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
          '&:hover fieldset': { borderColor: 'rgba(139,149,246,0.5)' }
=======
          backgroundColor: 'rgba(255,255,255,0.02)',
          '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
          '&:hover fieldset': { borderColor: 'rgba(124,140,248,0.5)' }
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
        }
      }
    },
    MuiButton: {
      styleOverrides: {
<<<<<<< HEAD
        root: { borderRadius: 8, paddingInline: 18, boxShadow: 'none' },
        containedPrimary: {
          background: '#8b95f6',
          '&:hover': { background: '#7c86ec' }
=======
        root: { borderRadius: 8, paddingInline: 18 },
        containedPrimary: {
          background: 'linear-gradient(135deg, #7c8cf8, #b388ff)',
          '&:hover': { background: 'linear-gradient(135deg, #6b7af0, #a273f7)' }
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
        }
      }
    }
  }
});

export default theme;