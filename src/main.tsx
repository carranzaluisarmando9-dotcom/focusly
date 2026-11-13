import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Offline reloads are supported by the production build on HTTPS or localhost.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
 window.addEventListener('load',()=>{navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(()=>{/* The app remains usable if browser policy blocks offline caching. */})})
}
