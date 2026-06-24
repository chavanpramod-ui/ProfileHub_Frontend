import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

const isProd = import.meta.env.PROD;
axios.defaults.baseURL = isProd ? 'https://profilehub-backend-5qqp.onrender.com' : (import.meta.env.VITE_API_URL || 'http://localhost:5000');
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)