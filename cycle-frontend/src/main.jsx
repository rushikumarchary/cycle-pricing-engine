import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "sweetalert2/dist/sweetalert2.min.css";
import './utils/i18n'; // Import i18n configuration
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster/>
  </StrictMode>,
)
