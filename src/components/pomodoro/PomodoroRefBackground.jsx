/** 番茄闹钟背景：纯 CSS 渐变 + SVG 装饰（无参考图 UI，避免重影） */
export default function PomodoroRefBackground() {
  return (
    <div className="pomo-ref__bg" aria-hidden="true">
      <svg className="pomo-ref__bg-svg" viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="pomo-hill-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e2a3c" stopOpacity="0" />
            <stop offset="100%" stopColor="#1e2a3c" stopOpacity="0.92" />
          </linearGradient>
          <linearGradient id="pomo-hill-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#141c2a" stopOpacity="0" />
            <stop offset="100%" stopColor="#141c2a" stopOpacity="0.95" />
          </linearGradient>
          <radialGradient id="pomo-star-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 远山丘 */}
        <path
          d="M0 178 C 52 162, 98 170, 148 166 C 198 162, 252 168, 320 174 L 320 240 L 0 240 Z"
          fill="url(#pomo-hill-far)"
        />
        {/* 近山丘 */}
        <path
          d="M0 192 C 68 180, 118 188, 168 184 C 218 180, 268 186, 320 190 L 320 240 L 0 240 Z"
          fill="url(#pomo-hill-near)"
        />

        {/* 星点 */}
        {[
          [38, 26, 1.1, 0.5],
          [72, 18, 0.8, 0.35],
          [248, 22, 0.9, 0.4],
          [286, 34, 1.2, 0.55],
          [160, 14, 0.7, 0.3],
          [198, 30, 0.6, 0.28],
        ].map(([cx, cy, r, o], i) => (
          <circle key={i} cx={cx} cy={cy} r={r * 3} fill="url(#pomo-star-glow)" opacity={o} />
        ))}
      </svg>
    </div>
  )
}
