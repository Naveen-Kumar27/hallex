import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DateFilterProvider } from './context/DateFilterContext'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <DateFilterProvider>
            <Toaster position="top-right" toastOptions={{
               style: { background: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--border-light)' },
               success: { style: { borderColor: 'var(--primary)' } }
            }} />
            <App />
          </DateFilterProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
