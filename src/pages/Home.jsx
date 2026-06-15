import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import HomeFace from '../components/home/HomeFace'

const IDLE_MS = 45000

export default function Home() {
  const navigate = useNavigate()
  const idleRef = useRef(null)

  useEffect(() => {
    const resetIdle = () => {
      if (idleRef.current) clearTimeout(idleRef.current)
      idleRef.current = window.setTimeout(() => navigate('/standby'), IDLE_MS)
    }

    resetIdle()
    window.addEventListener('pointerdown', resetIdle)
    window.addEventListener('keydown', resetIdle)

    return () => {
      if (idleRef.current) clearTimeout(idleRef.current)
      window.removeEventListener('pointerdown', resetIdle)
      window.removeEventListener('keydown', resetIdle)
    }
  }, [navigate])

  return (
    <div className="os-home">
      <HomeFace />
    </div>
  )
}
