import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { store } from './store/index.js'
import './index.css'
import App from './App.jsx'
import BackToTop from './components/common/BackToTop.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <BackToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { fontFamily: "'Rubik', sans-serif", fontSize: "0.875rem", borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" },
          success: { iconTheme: { primary: "#FF4F00", secondary: "#fff" } },
        }}
      />
    </Provider>
  </StrictMode>,
)
