// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'
// import { Provider } from 'react-redux'
// import { store } from './Redux/store.ts'
// import {Toaster} from 'react-hot-toast'
// import { ThemeProvider } from "../src/Components/theme-provider.tsx"



// createRoot(document.getElementById('root')!).render(
//   <StrictMode>

// <ThemeProvider
//             attribute="class"
//             defaultTheme="system"
//             enableSystem
//             disableTransitionOnChange
//           >


//     <Provider store={store}>
//         <App />
//         <Toaster/>
//       </Provider>
//       </ThemeProvider>
    
//         </StrictMode>,
// )
// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import './index.css';
// import App from './App.tsx';
// import { Provider } from 'react-redux';
// import { store } from './Redux/store.ts';
// import { Toaster } from 'react-hot-toast';
// import { ThemeProvider } from '../src/Components/theme-provider.tsx';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <ThemeProvider
//       attribute="class"
//       defaultTheme="system"
//       enableSystem
//       disableTransitionOnChange
//     >
//       <LocalizationProvider dateAdapter={AdapterDayjs}>
//         <Provider store={store}>
//           <App />
//           <Toaster />
//         </Provider>
//       </LocalizationProvider>
//     </ThemeProvider>
//   </StrictMode>
// );
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './Redux/store.ts';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles'; // ✅ use MUI theme provider
import { ThemeProvider as TailwindThemeProvider } from '../src/Components/theme-provider.tsx'; // ✅ your custom one
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const theme = createTheme(); // or customize it as needed

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
            <App />
            <Toaster />
          </Provider>
        </LocalizationProvider>
      </TailwindThemeProvider>
    </MuiThemeProvider>
  </StrictMode>
);
