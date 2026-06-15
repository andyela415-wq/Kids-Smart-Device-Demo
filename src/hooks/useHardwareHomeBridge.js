import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useOS } from '../context/LearningOSContext'
import { hardwareHomeActions, onHardwareHome } from '../utils/hardwareHome'
import { writeHomeModeForPath } from '../utils/homeMode'

export function useHardwareHomeBridge() {
  const navigate = useNavigate()
  const location = useLocation()
  const os = useOS()

  useEffect(() => {
    return onHardwareHome(() => {
      const path = location.pathname

      if (path === '/standby') {
        navigate('/')
        return
      }

      if (path.startsWith('/ai')) {
        if (os.aiPage !== 'select') {
          os.setAiPage('select')
          return
        }
        writeHomeModeForPath(path)
        navigate('/')
        return
      }

      if (path.startsWith('/pomodoro')) {
        if (hardwareHomeActions.pomodoroHome?.()) return
        writeHomeModeForPath(path)
        navigate('/')
        return
      }

      if (path.startsWith('/plan')) {
        writeHomeModeForPath(path)
        navigate('/')
        return
      }

      if (path !== '/') {
        navigate('/')
      }
    })
  }, [location.pathname, navigate, os, os.aiPage, os.setAiPage])
}
