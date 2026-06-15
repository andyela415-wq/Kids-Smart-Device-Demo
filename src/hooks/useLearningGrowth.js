import { useEffect, useState } from 'react'
import {
  getAiEncouragement,
  getGrowthEventName,
  getGrowthProfile,
} from '../utils/learningGrowth'

export function useLearningGrowth() {
  const [profile, setProfile] = useState(getGrowthProfile)
  const [encourage, setEncourage] = useState(() => getAiEncouragement())

  useEffect(() => {
    const refresh = () => {
      const next = getGrowthProfile()
      setProfile(next)
      setEncourage(getAiEncouragement(next))
    }

    window.addEventListener(getGrowthEventName(), refresh)
    refresh()

    return () => window.removeEventListener(getGrowthEventName(), refresh)
  }, [])

  return { profile, encourage }
}
