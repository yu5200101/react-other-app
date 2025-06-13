import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/global.scss'
import '@/styles/variables.scss'
import App from './App'
import '@ant-design/v5-patch-for-react-19';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
