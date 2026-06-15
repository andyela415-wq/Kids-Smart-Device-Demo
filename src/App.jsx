import { useEffect } from 'react'
import DeviceFrame from './components/DeviceFrame'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import { initVoiceReminder } from './utils/voiceReminder'
import { seedDemoGrowthIfEmpty } from './utils/learningGrowth'

export default function App() {
  useEffect(() => {
    seedDemoGrowthIfEmpty()
    return initVoiceReminder()
  }, [])

  return (
    <DeviceFrame>
      <RouterProvider router={router} />
    </DeviceFrame>
  )
}
