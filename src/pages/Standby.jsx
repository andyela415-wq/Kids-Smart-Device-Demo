import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BatteryIcon, WifiIcon } from '../components/DeviceFrame'
import { getDeviceStatus } from '../utils/deviceStatus'
import { formatClockTime, formatStandbyDate } from '../utils/scheduleAlarm'

function VolumeIcon() {
  return (
    <svg className="standby__volume" viewBox="0 0 14 12" width="12" height="10" aria-hidden="true">
      <path
        d="M1 4.5h2.2L6 1.5v9L3.2 7.5H1V4.5Z"
        fill="currentColor"
      />
      <path
        d="M8 3.5c1.2 1 1.8 2 1.8 2.5s-.6 1.5-1.8 2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function Standby() {
  const navigate = useNavigate()
  const [now, setNow] = useState(() => new Date())
  const [status, setStatus] = useState(() => getDeviceStatus())

  useEffect(() => {
    document.documentElement.classList.add('device-standby')
    return () => document.documentElement.classList.remove('device-standby')
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
      setStatus(getDeviceStatus())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const wake = () => navigate('/')

  return (
    <button type="button" className="standby" onClick={wake} aria-label="轻触唤醒">
      <header className="standby__top">
        <div className="standby__indicators">
          <VolumeIcon />
          <WifiIcon connected className="standby__wifi" />
          <BatteryIcon level={85} className="standby__battery" />
        </div>
      </header>

      <div className="standby__center">
        <time className="standby__clock" dateTime={now.toISOString()}>
          {formatClockTime(now)}
        </time>
        <p className="standby__date">{formatStandbyDate(now)}</p>
        {status.upcomingReminder && (
          <p className="standby__reminder">
            <span className="standby__reminder-icon" aria-hidden="true">
              {status.upcomingReminder.icon}
            </span>
            {status.upcomingReminder.text}
          </p>
        )}
      </div>
    </button>
  )
}
