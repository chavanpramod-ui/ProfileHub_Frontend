import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

// --- CRITICAL: SET YOUR RENDER BACKEND URL HERE ---
// Replace this placeholder with your actual Render URL
// Make sure there is NO slash (/) at the very end of the URL!
axios.defaults.baseURL = 'https://YOUR-BACKEND-NAME.onrender.com';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)