const SIZES = { md: 38, sm: 34, xs: 28 }

/** 对话区小鸡伙伴 — 与设备外壳气质一致 */
export default function ChickChatAvatar({ className = '', size = 'sm', active = true }) {
  const px = SIZES[size] ?? SIZES.sm

  return (
    <div
      className={`chick-chat-avatar chick-chat-avatar--${size}${active ? ' chick-chat-avatar--live' : ''} ${className}`.trim()}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" width={px} height={px} fill="none">
        <ellipse cx="32" cy="40" rx="22" ry="18" fill="#ffd54f" />
        <circle cx="32" cy="30" r="20" fill="#ffeb3b" />
        <circle cx="32" cy="30" r="20" fill="url(#chick-shine)" />
        <ellipse cx="22" cy="34" rx="4" ry="2.5" fill="#ffab91" opacity="0.55" />
        <ellipse cx="42" cy="34" rx="4" ry="2.5" fill="#ffab91" opacity="0.55" />
        <circle cx="25" cy="28" r="3.2" fill="#4e342e" />
        <circle cx="39" cy="28" r="3.2" fill="#4e342e" />
        <circle cx="26" cy="27" r="1" fill="#fff" opacity="0.9" />
        <circle cx="40" cy="27" r="1" fill="#fff" opacity="0.9" />
        <path
          d="M32 33 L28 37 Q32 40 36 37 Z"
          fill="#ff8f00"
        />
        <path d="M18 22 Q14 14 20 10 Q24 8 26 14" fill="#ffc107" />
        <path d="M46 22 Q50 14 44 10 Q40 8 38 14" fill="#ffc107" />
        <defs>
          <radialGradient id="chick-shine" cx="0.35" cy="0.3" r="0.65">
            <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}
