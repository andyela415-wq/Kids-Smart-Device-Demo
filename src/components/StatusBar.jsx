export default function StatusBar({ title }) {
  const now = new Date()
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  return (
    <header className="status-bar">
      <span className="status-bar__title">{title}</span>
      <div className="status-bar__right">
        <span className="status-bar__time">{time}</span>
        <div className="status-bar__battery">
          <div className="status-bar__battery-icon">
            <div className="status-bar__battery-fill" />
          </div>
        </div>
      </div>
    </header>
  )
}
