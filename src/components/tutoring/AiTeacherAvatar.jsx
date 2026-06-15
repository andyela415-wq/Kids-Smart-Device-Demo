const SIZES = {
  md: 38,
  sm: 30,
  xs: 22,
}

export default function AiTeacherAvatar({ active = true, size = 'md' }) {
  const px = SIZES[size] ?? SIZES.md

  return (
    <div
      className={`tutor-teacher tutor-teacher--${size}${active ? ' tutor-teacher--live' : ''}`}
      aria-hidden="true"
    >
      <svg
        className="tutor-teacher__svg"
        viewBox="0 0 64 64"
        fill="none"
        width={px}
        height={px}
      >
        <rect x="14" y="18" width="36" height="32" rx="10" fill="url(#teacher-body)" />
        <rect x="18" y="22" width="28" height="22" rx="6" fill="#e8f4ff" stroke="#88b8d8" strokeWidth="1.5" />
        <circle cx="26" cy="32" r="3" fill="#3a5870" />
        <circle cx="38" cy="32" r="3" fill="#3a5870" />
        <circle cx="27" cy="31" r="1" fill="#fff" opacity="0.85" />
        <circle cx="39" cy="31" r="1" fill="#fff" opacity="0.85" />
        <path d="M28 38 C30 41 34 41 36 38" stroke="#3a5870" strokeWidth="1.6" strokeLinecap="round" />
        <rect x="28" y="8" width="8" height="8" rx="3" fill="#90b8d8" />
        <circle className="tutor-teacher__led" cx="32" cy="6" r="3" fill="#7ee8a2" />
        <rect x="8" y="28" width="6" height="14" rx="3" fill="#a8c8e0" />
        <rect x="50" y="28" width="6" height="14" rx="3" fill="#a8c8e0" />
        <defs>
          <linearGradient id="teacher-body" x1="32" y1="18" x2="32" y2="50">
            <stop offset="0%" stopColor="#b8d8f0" />
            <stop offset="100%" stopColor="#88b0d0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
