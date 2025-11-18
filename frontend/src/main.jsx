import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { SocketProvider } from './contexts/SocketContext.jsx'
import initParallax from './utils/parallax'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <div className="dark">
            <App />
            <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a2e',
                color: '#fff',
                border: '1px solid rgba(107, 159, 255, 0.2)',
              },
              success: {
                iconTheme: {
                  primary: '#6B9FFF',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          </div>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

// Initialize the tiny parallax enhancer (no-op on small screens / reduced-motion)
if (typeof window !== 'undefined') {
  try {
    initParallax();
  } catch (e) {
    // non-fatal: parallax is an enhancement
    console.debug('Parallax init skipped or failed:', e?.message || e);
  }
}
