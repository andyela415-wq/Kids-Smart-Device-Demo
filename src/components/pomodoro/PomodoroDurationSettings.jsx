import { FOCUS_DURATION_OPTIONS } from '../../config/pomodoroWork'

/** 准备页内嵌：专注时长设置（非浮层，避免与主界面叠在一起） */
export default function PomodoroDurationSettings({ value, onChange, onDone }) {
  return (
    <div className="pomo-ref__settings">
      <p className="pomo-ref__settings-title">专注时长</p>
      <p className="pomo-ref__settings-sub">可调整本次学习时长</p>
      <div className="pomo-ref__settings-grid">
        {FOCUS_DURATION_OPTIONS.map((minutes) => (
          <button
            key={minutes}
            type="button"
            className={`pomo-ref__settings-opt${value === minutes ? ' pomo-ref__settings-opt--active' : ''}`}
            onClick={() => onChange(minutes)}
          >
            {minutes} 分钟
          </button>
        ))}
      </div>
      <button type="button" className="pomo-ref__settings-done" onClick={onDone}>
        完成
      </button>
    </div>
  )
}
