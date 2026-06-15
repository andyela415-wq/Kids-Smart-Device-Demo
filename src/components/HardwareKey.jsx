import { useState } from 'react'

export default function HardwareKey({ icon, label, variant, onClick }) {
  const [pressed, setPressed] = useState(false)

  const release = () => setPressed(false)

  return (
    <button
      type="button"
      className={`hw-key hw-key--${variant}${pressed ? ' hw-key--pressed' : ''}`}
      onMouseDown={() => setPressed(true)}
      onMouseUp={release}
      onMouseLeave={release}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={release}
      onTouchCancel={release}
      onClick={onClick}
    >
      <span className="hw-key__bezel">
        <span className="hw-key__surface">
          <span className="hw-key__icon" aria-hidden="true">
            {icon}
          </span>
          <span className="hw-key__label">{label}</span>
        </span>
      </span>
      <span className="hw-key__shine" aria-hidden="true" />
    </button>
  )
}
