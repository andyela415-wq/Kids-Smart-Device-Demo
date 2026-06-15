/** 《秋天的雨》课文卡片 — 卡通秋雨插画 */
export default function AutumnRainCover({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 280 120"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="autumn-sky" x1="140" y1="0" x2="140" y2="120">
          <stop offset="0%" stopColor="#8ecae6" />
          <stop offset="55%" stopColor="#cdb4db" />
          <stop offset="100%" stopColor="#ffb4a2" />
        </linearGradient>
        <linearGradient id="autumn-hill" x1="140" y1="70" x2="140" y2="120">
          <stop offset="0%" stopColor="#95d5b2" />
          <stop offset="100%" stopColor="#52b788" />
        </linearGradient>
      </defs>

      <rect width="280" height="120" fill="url(#autumn-sky)" />

      <ellipse cx="60" cy="92" rx="70" ry="28" fill="url(#autumn-hill)" opacity="0.85" />
      <ellipse cx="220" cy="98" rx="80" ry="32" fill="url(#autumn-hill)" opacity="0.75" />

      <path
        d="M200 78 C210 55 235 48 252 62 C260 70 255 82 240 86 C225 90 205 88 200 78Z"
        fill="#f4a261"
        opacity="0.9"
      />
      <rect x="228" y="62" width="8" height="26" rx="3" fill="#8d5524" />
      <circle cx="232" cy="52" r="22" fill="#e76f51" opacity="0.95" />
      <circle cx="218" cy="48" r="16" fill="#f4a261" opacity="0.9" />
      <circle cx="246" cy="50" r="14" fill="#e9c46a" opacity="0.85" />

      <path d="M40 70 Q48 45 58 70" stroke="#2d6a4f" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="58" cy="42" r="18" fill="#ffb703" opacity="0.95" />
      <circle cx="44" cy="48" r="14" fill="#fb8500" opacity="0.9" />

      {[12, 28, 44, 60, 76, 92, 108, 124, 140, 156, 172, 188, 204, 220, 236, 252, 268].map(
        (x, i) => (
          <line
            key={`rain-${x}`}
            x1={x}
            y1={8 + (i % 3) * 4}
            x2={x - 2}
            y2={22 + (i % 3) * 4}
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        ),
      )}

      {[
        { cx: 30, cy: 28, fill: '#ffb703', r: 4 },
        { cx: 95, cy: 18, fill: '#e76f51', r: 3.5 },
        { cx: 150, cy: 32, fill: '#ffd166', r: 4 },
        { cx: 185, cy: 14, fill: '#06d6a0', r: 3 },
        { cx: 250, cy: 24, fill: '#fb8500', r: 3.5 },
        { cx: 120, cy: 12, fill: '#ef476f', r: 3 },
      ].map((leaf, i) => (
        <ellipse
          key={`leaf-${i}`}
          cx={leaf.cx}
          cy={leaf.cy}
          rx={leaf.r}
          ry={leaf.r * 1.4}
          fill={leaf.fill}
          opacity="0.9"
          transform={`rotate(${i * 24} ${leaf.cx} ${leaf.cy})`}
        />
      ))}

      <circle cx="248" cy="18" r="14" fill="rgba(255,255,255,0.25)" />
    </svg>
  )
}
