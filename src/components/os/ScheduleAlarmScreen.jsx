import { useEffect, useState } from 'react'
import { formatClockTime, formatScheduleDate } from '../../utils/scheduleAlarm'

export default function ScheduleAlarmScreen({ task, onReady, onSnooze }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!task) return null

  return (
    <div className="os-alarm" role="dialog" aria-modal="true" aria-label="日程提醒">
      <div className="os-alarm__panel">
        <p className="os-alarm__date">{formatScheduleDate(now)}</p>

        <div className="os-alarm__clock-wrap">
          <span className="os-alarm__clock-icon" aria-hidden="true">
            ⏰
          </span>
          <p className="os-alarm__time">{formatClockTime(now)}</p>
        </div>

        <div className="os-alarm__task">
          <span className="os-alarm__task-icon" aria-hidden="true">
            {task.icon}
          </span>
          <p className="os-alarm__task-title">{task.title}</p>
        </div>

        <div className="os-alarm__actions">
          <button type="button" className="os-alarm__btn os-alarm__btn--primary" onClick={onReady}>
            准备好了
          </button>
          <button type="button" className="os-alarm__btn os-alarm__btn--ghost" onClick={onSnooze}>
            稍后提醒 · 5分钟后
          </button>
        </div>
      </div>
    </div>
  )
}
