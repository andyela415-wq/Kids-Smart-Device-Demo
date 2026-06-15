/** 首页统一风格图标 — 24×24 viewBox，圆角童趣线面结合 */

export function BookIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 5.5c2.2-1.2 4.8-1.2 7 0v13c-2.2-1.1-4.8-1.1-7 0V5.5Z"
        fill="#6eb8f0"
      />
      <path
        d="M12 5.5c2.2-1.2 4.8-1.2 7 0v13c-2.2-1.1-4.8-1.1-7 0V5.5Z"
        fill="#8ecdf8"
      />
      <path
        d="M12 5.5v13"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="0.8"
      />
      <path
        d="M7.5 9h3M7.5 11.5h3M14.5 9h3M14.5 11.5h3"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function CalendarIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="6" width="16" height="14" rx="2.5" fill="#f5f0e8" />
      <path d="M4 10h16" stroke="#c4b59a" strokeWidth="1.2" />
      <path
        d="M8 4.5v3.5M16 4.5v3.5"
        stroke="#e8967a"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect x="7.5" y="12.5" width="3" height="2.5" rx="0.6" fill="#ffb74d" />
      <rect x="12" y="12.5" width="3" height="2.5" rx="0.6" fill="#dce775" />
      <rect x="7.5" y="16" width="3" height="2.5" rx="0.6" fill="#90caf9" />
    </svg>
  )
}

export function TomatoIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 4.5c-1.2 0-2 .8-2.2 1.8-.3 1.4.6 2.2 2.2 2.2s2.5-.8 2.2-2.2C14 5.3 13.2 4.5 12 4.5Z"
        fill="#7cb342"
      />
      <circle cx="12" cy="14" r="7.5" fill="#ff6b5a" />
      <ellipse cx="9.5" cy="12" rx="1.8" ry="1.2" fill="rgba(255,255,255,0.28)" />
    </svg>
  )
}

export function StarIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3.5l2.35 4.76 5.25.76-3.8 3.71.9 5.23L12 15.9l-4.7 2.47.9-5.23-3.8-3.71 5.25-.76L12 3.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function MoonIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M16.2 4.5a8.5 8.5 0 1 0 3.3 14.2 7 7 0 0 1-3.3-14.2Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function ChevronIcon({ direction = 'right', className = '' }) {
  const rotate = direction === 'left' ? 180 : 0
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path
        d="M10 6.5l5.5 5.5L10 17.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
