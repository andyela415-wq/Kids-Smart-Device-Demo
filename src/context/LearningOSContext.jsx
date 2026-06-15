import { createContext, useContext } from 'react'
import { useLearningOS } from '../hooks/useLearningOS'

const LearningOSContext = createContext(null)

export function LearningOSProvider({ children }) {
  const value = useLearningOS()
  return (
    <LearningOSContext.Provider value={value}>{children}</LearningOSContext.Provider>
  )
}

export function useOS() {
  const ctx = useContext(LearningOSContext)
  if (!ctx) throw new Error('useOS must be used within LearningOSProvider')
  return ctx
}
