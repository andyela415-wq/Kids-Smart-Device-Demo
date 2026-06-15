import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { seedDefaultPlansIfEmpty, syncAllPlans } from './utils/schedulePlan'
import './styles/global.css'
import './styles/device.css'
import './styles/components.css'
import './styles/layout.css'
import './styles/home.css'
import './styles/home-face.css'
import './styles/growth.css'
import './styles/tutoring.css'
import './styles/pomodoro.css'
import './styles/os.css'
import './styles/standby.css'
import './styles/hardware-home.css'

seedDefaultPlansIfEmpty()
syncAllPlans()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
