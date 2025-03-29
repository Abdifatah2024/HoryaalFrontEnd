import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './Redux/store.ts'
import {Toaster} from 'react-hot-toast'
import { ThemeProvider } from "../src/Components/theme-provider.tsx"



createRoot(document.getElementById('root')!).render(
  <StrictMode>

<ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >


    <Provider store={store}>
        <App />
        <Toaster/>
      </Provider>
      </ThemeProvider>
    
        </StrictMode>,
)
