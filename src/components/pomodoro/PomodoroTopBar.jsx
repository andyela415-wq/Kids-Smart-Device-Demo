function IconButton({ label, children, onClick }) {
  return (
    <button type="button" className="pomo-work__icon-btn" aria-label={label} onClick={onClick}>
      {children}
    </button>
  )
}

function SettingsGearIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  )
}

export default function PomodoroTopBar({ title, onBack, onSettings, settingsActive = false }) {
  return (
    <header className="pomo-work__topbar">
      <IconButton label={settingsActive ? '返回' : '返回'} onClick={onBack}>
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path
            d="M14.5 6.5 9 12l5.5 5.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </IconButton>
      <h1 className="pomo-work__topbar-title">{title}</h1>
      {onSettings ? (
        <IconButton
          label={settingsActive ? '关闭设置' : '设置'}
          onClick={onSettings}
        >
          <SettingsGearIcon />
        </IconButton>
      ) : (
        <span className="pomo-work__topbar-spacer" aria-hidden="true" />
      )}
    </header>
  )
}
