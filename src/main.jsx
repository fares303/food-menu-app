import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './AppRouter.jsx'
import { MenuProvider } from './context/MenuContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MenuProvider>
      <AppRouter />
    </MenuProvider>
  </StrictMode>,
)
