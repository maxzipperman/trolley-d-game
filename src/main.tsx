import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootEl = document.documentElement

if (localStorage.getItem('trolleyd-high-contrast') === 'true') {
  rootEl.classList.add('high-contrast')
}

const rmStored = localStorage.getItem('trolleyd-reduced-motion')
if (
  rmStored === 'true' ||
  (rmStored === null && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
) {
  rootEl.classList.add('reduced-motion')
}

createRoot(document.getElementById("root")!).render(<App />);
