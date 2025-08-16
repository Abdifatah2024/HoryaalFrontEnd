import './api/axiosInstance.ts'; // 👈 Important: Setup interceptors before anything
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App'; // ✅ this uses the RouterProvider
import { Provider } from 'react-redux';
import { store } from './Redux/store.ts';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeProvider as TailwindThemeProvider } from './Components/theme-provider.tsx';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const theme = createTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MuiThemeProvider theme={theme}>
      <TailwindThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Provider store={store}>
            <App /> {/* 👈 App includes RouterProvider and checkAuth */}
            <Toaster position="top-right" />
          </Provider>
        </LocalizationProvider>
      </TailwindThemeProvider>
    </MuiThemeProvider>
  </StrictMode>
);
