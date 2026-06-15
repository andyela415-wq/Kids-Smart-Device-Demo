import { useEffect, useRef } from 'react'

const ITEM_HEIGHT = 36

function pad2(value) {
  return String(value).padStart(2, '0')
}

export default function TimeRoller({ min = 0, max = 59, value, onChange, label }) {
  const viewportRef = useRef(null)
  const values = Array.from({ length: max - min + 1 }, (_, index) => min + index)

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const index = values.indexOf(value)
    if (index >= 0) {
      el.scrollTop = index * ITEM_HEIGHT
    }
  }, [value, values])

  const handleScroll = () => {
    const el = viewportRef.current
    if (!el) return
    const index = Math.round(el.scrollTop / ITEM_HEIGHT)
    const clamped = Math.max(0, Math.min(values.length - 1, index))
    if (values[clamped] !== value) {
      onChange(values[clamped])
    }
  }

  return (
    <div className="os-time-roller">
      {label && <span className="os-time-roller__label">{label}</span>}
      <div className="os-time-roller__frame">
        <div
          ref={viewportRef}
          className="os-time-roller__viewport"
          onScroll={handleScroll}
        >
          <div className="os-time-roller__pad" aria-hidden="true" />
          {values.map((item) => (
            <div
              key={item}
              className={`os-time-roller__item${item === value ? ' os-time-roller__item--on' : ''}`}
            >
              {pad2(item)}
            </div>
          ))}
          <div className="os-time-roller__pad" aria-hidden="true" />
        </div>
        <div className="os-time-roller__highlight" aria-hidden="true" />
      </div>
    </div>
  )
}
