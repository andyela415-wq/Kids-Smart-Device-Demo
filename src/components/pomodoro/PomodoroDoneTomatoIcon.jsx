/** 结算页用精巧小番茄矢量图标 */
export default function PomodoroDoneTomatoIcon({ className = '' }) {
  return (
    <svg
      className={`pomo-ref__done-tomato-icon ${className}`.trim()}
      viewBox="0 0 20 20"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <circle cx="10" cy="12" r="6.5" fill="#ff6347" />
      <circle cx="10" cy="12" r="6.5" fill="url(#pomo-done-tomato-shine)" />
      <ellipse cx="7.5" cy="6" rx="2.2" ry="1.4" fill="#7dd87d" transform="rotate(-22 7.5 6)" />
      <ellipse cx="12.5" cy="6" rx="2.2" ry="1.4" fill="#7dd87d" transform="rotate(22 12.5 6)" />
      <defs>
        <radialGradient id="pomo-done-tomato-shine" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}
