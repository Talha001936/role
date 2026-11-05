import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { AppRoutes } from './App/AppRoutes';
import { BrowserRouter } from 'react-router-dom';

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </ThemeProvider>
);

export default App;