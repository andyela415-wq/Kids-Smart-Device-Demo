import { useRef } from 'react'
import { DEMO_ALARM_TASK } from '../../utils/scheduleAlarm'

function useTaskPress(onTap, onLongPress, delay = 480) {
  const timerRef = useRef(null)
  const longPressedRef = useRef(false)

  const clear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  return {
    onPointerDown: (event) => {
      if (event.button !== 0) return
      longPressedRef.current = false
      clear()
      timerRef.current = window.setTimeout(() => {
        longPressedRef.current = true
        onLongPress?.()
      }, delay)
    },
    onPointerUp: () => {
      clear()
      if (!longPressedRef.current) onTap?.()
    },
    onPointerLeave: clear,
    onPointerCancel: clear,
  }
}

function PlanTaskRow({
  task,
  isHighlight,
  isToday,
  onEditTask,
  onLongPressTask,
  onToggleTaskDone,
  onPreviewAlarm,
}) {
  const press = useTaskPress(
    () => onEditTask?.(task),
    () => onLongPressTask?.(task),
  )

  return (
    <li
      className={[
        'os-plan-card__item',
        `os-plan-card__item--${task.status || 'pending'}`,
        `os-plan-card__item--${task.type || 'study'}`,
        isHighlight ? 'os-plan-card__item--next' : '',
        'os-plan-card__item--editable',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button type="button" className="os-plan-card__row-btn" aria-label={`编辑 ${task.title}`} {...press}>
        <span className="os-plan-card__rail" aria-hidden="true" />
        <span className="os-plan-card__icon" aria-hidden="true">
          {task.icon || '⏰'}
        </span>
        <span className="os-plan-card__name">{task.title}</span>
        <span className="os-plan-card__time">{task.startTime}</span>
      </button>

      {task.status === 'active' && (
        <span className="os-plan-card__mark os-plan-card__mark--live">●</span>
      )}

      {(task.status === 'pending' || task.status === 'done') && (
        <button
          type="button"
          className={`os-plan-card__check${task.status === 'done' ? ' os-plan-card__check--done' : ''}`}
          aria-label={task.status === 'done' ? `取消完成${task.title}` : `完成${task.title}`}
          disabled={!onToggleTaskDone}
          onClick={() => onToggleTaskDone?.(task.id)}
        >
          {task.status === 'done' ? '✓' : '◯'}
        </button>
      )}

      {isToday && isHighlight && task.status === 'pending' && onPreviewAlarm && (
        <button
          type="button"
          className="os-plan-card__preview"
          aria-label={`试听${task.title}提醒`}
          onClick={() => onPreviewAlarm(task)}
        >
          🔔
        </button>
      )}
    </li>
  )
}

export default function PlanDayCard({
  tasks,
  isToday,
  dayHint,
  showActions,
  highlightIndex = -1,
  onStartPomodoro,
  onPreviewAlarm,
  onOpenAdd,
  onEditTask,
  onLongPressTask,
  onToggleTaskDone,
}) {
  return (
    <div className="os-plan-card">
      <div className="os-plan-card__scroll">
        <div className="os-plan-card__header list-header">
          <div className="os-plan-card__title-row">
            <span className="os-plan-card__dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="os-plan-card__title">日程安排</span>
          </div>
          {onOpenAdd && (
            <button type="button" className="os-plan-card__add-btn" onClick={onOpenAdd}>
              + 添加任务
            </button>
          )}
        </div>

        <ul className="os-plan-card__list">
        {isToday && onPreviewAlarm ? (
          <li className="os-plan-card__item os-plan-card__item--demo">
            <span className="os-plan-card__rail" aria-hidden="true" />
            <span className="os-plan-card__icon" aria-hidden="true">
              {DEMO_ALARM_TASK.icon}
            </span>
            <span className="os-plan-card__name">{DEMO_ALARM_TASK.title}</span>
            <span className="os-plan-card__time os-plan-card__time--demo">即点即响</span>
            <button
              type="button"
              className="os-plan-card__demo-btn"
              onClick={() => onPreviewAlarm(DEMO_ALARM_TASK)}
            >
              演示
            </button>
          </li>
        ) : (
          <li className="os-plan-card__item os-plan-card__item--hint">
            <span className="os-plan-card__hint-icon" aria-hidden="true">
              ✨
            </span>
            <p className="os-plan-card__hint-text">{dayHint}</p>
          </li>
        )}

        {tasks.length === 0 ? (
          <li className="os-plan__empty os-plan__empty--inline">
            <p>这一天还没有安排</p>
            <p className="os-plan__empty-hint">点「+ 添加任务」开始吧</p>
          </li>
        ) : (
          tasks.map((task, index) => (
            <PlanTaskRow
              key={task.id}
              task={task}
              isHighlight={isToday && index === highlightIndex && task.status !== 'done'}
              isToday={isToday}
              onEditTask={onEditTask}
              onLongPressTask={onLongPressTask}
              onToggleTaskDone={onToggleTaskDone}
              onPreviewAlarm={onPreviewAlarm}
            />
          ))
        )}
        </ul>
      </div>

      {showActions && (
        <div className="os-plan-card__actions">
          <button type="button" className="os-plan-card__btn" onClick={onStartPomodoro}>
            🍅 开始番茄执行
          </button>
        </div>
      )}
    </div>
  )
}
