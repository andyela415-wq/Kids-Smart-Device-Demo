/** 学习小助手 — 简笔画小鸟，计时中轻微呼吸动画 */
export default function PomodoroBuddyIcon({ active = true, variant = 'focus' }) {
  return (
    <div
      className={`pomo-buddy pomo-buddy--${variant}${active ? ' pomo-buddy--active' : ''}`}
      aria-hidden="true"
    >
      <svg className="pomo-buddy__svg" viewBox="0 0 52 44" fill="none">
        <ellipse cx="26" cy="28" rx="16" ry="13" fill="#fff8ee" stroke="#ffd4a8" strokeWidth="1.5" />
        <circle cx="32" cy="24" r="11" fill="#7ec8ff" stroke="#5aadef" strokeWidth="1.5" />
        <circle cx="35" cy="22" r="2.2" fill="#2d3748" />
        <circle cx="36" cy="21" r="0.7" fill="#fff" />
        <path
          d="M38 24 L44 22 L38 27 Z"
          fill="#ffb347"
          stroke="#e89530"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
        <path
          d="M18 30 Q14 34 18 38"
          stroke="#ffb347"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M12 18 Q8 12 14 10 Q18 8 20 14"
          fill="#98e4a8"
          stroke="#6fcf7a"
          strokeWidth="1"
        />
      </svg>
    </div>
  )
}
