import { useEffect, useState } from 'react'
import HardwareHomeKey from './device/HardwareHomeKey'
import shellRef from '../assets/chick-device-ref.png'

export const SCREEN_LOGICAL_W = 320
export const SCREEN_LOGICAL_H = 258

/*
 * 参考图 1024×985 — 像素校准后的 LCD 内腔（不超出黄边黑框）
 * 底层：完整外壳图  中层：黑色屏幕容器  顶层：Home 键 + 屏内 UI
 */
const SHELL_W = 1024
const SHELL_H = 985
const SCREEN_X = 196
const SCREEN_Y = 303
const SCREEN_W = 626
const SCREEN_H = 504
const SCREEN_R = 28
const HOME_CX = 512
const HOME_CY = 850
const HOME_D = 53

function pct(value, base) {
  return `${(value / base) * 100}%`
}

function VolumeIcon({ className = '', muted = false }) {
  return (
    <svg
      className={`screen-status__volume${muted ? ' screen-status__volume--muted' : ''} ${className}`.trim()}
      viewBox="0 0 16 14"
      aria-hidden="true"
    >
      <path d="M1.5 5.5h2.4L7 2v10L3.9 8.5H1.5V5.5Z" fill="currentColor" />
      {muted ? (
        <path
          d="M11.5 5.5l3 3M14.5 5.5l-3 3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      ) : (
        <>
          <path
            d="M9.5 4.5c1.1 1 1.7 2 1.7 2.5s-.6 1.5-1.7 2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M11.5 3c1.8 1.5 2.7 3 2.7 4s-.9 2.5-2.7 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.55"
          />
        </>
      )}
    </svg>
  )
}

function WifiIcon({ connected = true, className = '' }) {
  return (
    <svg
      className={`screen-status__wifi${connected ? '' : ' screen-status__wifi--off'} ${className}`.trim()}
      viewBox="0 0 18 14"
      aria-hidden="true"
    >
      <circle cx="9" cy="12.2" r="1.15" fill="currentColor" />
      <path
        d="M6.2 9.4Q9 6.8 11.8 9.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M3.8 6.6Q9 3.2 14.2 6.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M1.2 3.8Q9 0.8 16.8 3.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BatteryIcon({ level = 85, className = '' }) {
  const fillWidth = Math.max(0, Math.min(100, level))

  return (
    <div className={`screen-status__battery ${className}`.trim()} aria-label={`电量 ${level}%`}>
      <div className="screen-status__battery-body">
        <div className="screen-status__battery-fill" style={{ width: `${fillWidth}%` }} />
      </div>
      <div className="screen-status__battery-cap" />
    </div>
  )
}

function ScreenStatusBar({ batteryLevel = 85, wifiConnected = true, volumeMuted = false }) {
  const [time, setTime] = useState(() => formatTime(new Date()))

  useEffect(() => {
    const tick = setInterval(() => setTime(formatTime(new Date())), 1000)
    return () => clearInterval(tick)
  }, [])

  return (
    <header className="screen-status">
      <span className="screen-status__time">{time}</span>
      <div className="screen-status__indicators">
        <WifiIcon connected={wifiConnected} />
        <VolumeIcon muted={volumeMuted} />
        <BatteryIcon level={batteryLevel} />
      </div>
    </header>
  )
}

function formatTime(date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

export default function DeviceFrame({
  children,
  batteryLevel = 85,
  wifiConnected = true,
  showLabel = false,
}) {
  const geometry = {
    '--shell-bg': `url(${shellRef})`,
    '--screen-x': pct(SCREEN_X, SHELL_W),
    '--screen-y': pct(SCREEN_Y, SHELL_H),
    '--screen-w': pct(SCREEN_W, SHELL_W),
    '--screen-h': pct(SCREEN_H, SHELL_H),
    '--screen-rx': pct(SCREEN_R, SCREEN_W),
    '--screen-ry': pct(SCREEN_R, SCREEN_H),
    '--ui-logical-w': SCREEN_LOGICAL_W,
    '--ui-logical-h': SCREEN_LOGICAL_H,
    '--home-x': `calc(${pct(HOME_CX, SHELL_W)} - ${pct(HOME_D / 2, SHELL_W)})`,
    '--home-y': `calc(${pct(HOME_CY, SHELL_H)} - ${pct(HOME_D / 2, SHELL_H)})`,
    '--home-d': pct(HOME_D, SHELL_W),
  }

  return (
    <div className="device-preview">
      <div className="device-viewport" style={geometry}>
        {/* Layer 1 — 完整硬件外壳（不做任何裁剪或补丁） */}
        <div className="device-shell" inert="" aria-hidden="true" />

        {/* Layer 2 — 黑色屏幕容器，精确卡在外壳 LCD 内腔 */}
        <div className="device-screen">
          <ScreenStatusBar batteryLevel={batteryLevel} wifiConnected={wifiConnected} />
          <div className="device-screen__content">{children}</div>
        </div>

        {/* Layer 3 — 物理 Home 键（外壳上的唯一黄色控件） */}
        <HardwareHomeKey />
      </div>

      {showLabel && (
        <p className="device-preview__label">
          {SCREEN_LOGICAL_W} × {SCREEN_LOGICAL_H} · 嵌入式一体屏
        </p>
      )}
    </div>
  )
}

export { WifiIcon, BatteryIcon, VolumeIcon }
