import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { store } from './store/index.js'
import './index.css'
import App from './App.jsx'
import BackToTop from './components/common/BackToTop.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <BackToTop />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        style={{ fontFamily: "inherit", fontSize: "0.875rem" }}
      />
    </Provider>
  </StrictMode>,
)
