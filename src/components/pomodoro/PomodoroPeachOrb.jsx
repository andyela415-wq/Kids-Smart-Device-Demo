import { useId } from 'react'

/** 参考图 1：柔和 3D 番茄/蜜桃球体 + 三片叶子 */
export default function PomodoroPeachOrb({ minutes }) {
  const uid = useId().replace(/:/g, '')
  const bodyId = `peach-body-${uid}`
  const shineId = `peach-shine-${uid}`
  const leafId = `peach-leaf-${uid}`
  const glowId = `peach-glow-${uid}`

  return (
    <div className="pomo-ref__peach-orb">
      <svg
        className="pomo-ref__peach-svg"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={bodyId} cx="38%" cy="32%" r="58%">
            <stop offset="0%" stopColor="#ffb89a" />
            <stop offset="42%" stopColor="#ff9470" />
            <stop offset="78%" stopColor="#f97352" />
            <stop offset="100%" stopColor="#e85a42" />
          </radialGradient>
          <radialGradient id={shineId} cx="32%" cy="26%" r="42%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#fff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={leafId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8fd896" />
            <stop offset="100%" stopColor="#4f9f55" />
          </linearGradient>
          <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="#ff7e5f" stopOpacity="0" />
            <stop offset="100%" stopColor="#ff7e5f" stopOpacity="0.28" />
          </radialGradient>
        </defs>

        <circle cx="60" cy="62" r="52" fill={`url(#${glowId})`} />

        <g transform="translate(60 62)">
          <circle r="44" fill={`url(#${bodyId})`} />
          <circle r="44" fill={`url(#${shineId})`} />
        </g>

        <path
          d="M60 20 C60 16 62 14 64 16"
          stroke="#4f9f55"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <ellipse
          cx="48"
          cy="22"
          rx="9"
          ry="5.5"
          fill={`url(#${leafId})`}
          transform="rotate(-32 48 22)"
        />
        <ellipse
          cx="72"
          cy="22"
          rx="9"
          ry="5.5"
          fill={`url(#${leafId})`}
          transform="rotate(32 72 22)"
        />
        <ellipse cx="60" cy="18" rx="7" ry="4.5" fill={`url(#${leafId})`} />
      </svg>

      <div className="pomo-ref__peach-label">
        <span className="pomo-ref__peach-num">{minutes}</span>
        <span className="pomo-ref__peach-unit">分钟</span>
      </div>
    </div>
  )
}
