import { useState } from 'react'
import { pressHardwareHome } from '../../utils/hardwareHome'

function HomeIcon() {
  return (
    <svg className="hardware-home__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 5.2 6.5 9.8V18h4.6v-4.2h1.8V18H17.5V9.8L12 5.2Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function HardwareHomeKey() {
  const [pressed, setPressed] = useState(false)
  const release = () => setPressed(false)

  return (
    <button
      type="button"
      className={`hardware-home${pressed ? ' hardware-home--pressed' : ''}`}
      aria-label="Home 键"
      onMouseDown={() => setPressed(true)}
      onMouseUp={release}
      onMouseLeave={release}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={release}
      onTouchCancel={release}
      onClick={pressHardwareHome}
    >
      <HomeIcon />
    </button>
  )
}
