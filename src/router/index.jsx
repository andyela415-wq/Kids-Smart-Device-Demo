import { createBrowserRouter, Navigate } from 'react-router-dom'
import DeviceLayout from '../layouts/DeviceLayout'
import AiLearning from '../pages/AiLearning'
import DailyPlan from '../pages/DailyPlan'
import DeviceRouteFallback from '../pages/DeviceRouteFallback'
import Home from '../pages/Home'
import LoopFeedback from '../pages/LoopFeedback'
import Pomodoro from '../pages/Pomodoro'
import Standby from '../pages/Standby'

const legacyRedirects = [
  { path: '/tutoring', to: '/ai' },
  { path: '/learning', to: '/' },
  { path: '/dictionary', to: '/' },
  { path: '/practice', to: '/' },
  { path: '/settings', to: '/' },
  { path: '/companion', to: '/pomodoro' },
  { path: '/home', to: '/' },
]

const router = createBrowserRouter([
  ...legacyRedirects.map(({ path, to }) => ({
    path,
    element: <Navigate to={to} replace />,
  })),
  {
    path: '/',
    element: <DeviceLayout />,
    errorElement: <DeviceRouteFallback />,
    children: [
      { index: true, element: <Home /> },
      { path: 'standby', element: <Standby /> },
      { path: 'ai', element: <AiLearning /> },
      { path: 'plan', element: <DailyPlan /> },
      { path: 'pomodoro', element: <Pomodoro /> },
      { path: 'focus', element: <Navigate to="/pomodoro" replace /> },
      { path: 'feedback', element: <LoopFeedback /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

export default router
