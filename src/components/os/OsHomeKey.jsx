import { useState } from 'react'

export default function OsHomeKey({ icon, label, variant, onClick }) {
  const [pressed, setPressed] = useState(false)
  const release = () => setPressed(false)

  return (
    <button
      type="button"
      className={`os-key os-key--${variant}${pressed ? ' os-key--pressed' : ''}`}
      onMouseDown={() => setPressed(true)}
      onMouseUp={release}
      onMouseLeave={release}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={release}
      onTouchCancel={release}
      onClick={onClick}
    >
      <span className="os-key__bezel">
        <span className="os-key__surface">
          <span className="os-key__icon" aria-hidden="true">
            {icon}
          </span>
          <span className="os-key__text">
            <span className="os-key__label">{label}</span>
          </span>
        </span>
      </span>
    </button>
  )
}
