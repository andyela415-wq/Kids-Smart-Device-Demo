import { DEMO_ALARM_TASK } from '../../utils/scheduleAlarm'

export default function PlanDayCard({
  tasks,
  isToday,
  dayHint,
  showActions,
  highlightIndex = -1,
  onStartPomodoro,
  onPreviewAlarm,
  onOpenAdd,
  onToggleTaskDone,
}) {
  return (
    <div className="os-plan-card">
      <div className="os-plan-card__header">
        <div className="os-plan-card__title-row">
          <span className="os-plan-card__dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="os-plan-card__title">日程安排</span>
        </div>
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
            <p className="os-plan__empty-hint">点右下角 + 添加计划吧</p>
          </li>
        ) : (
          tasks.map((task, index) => {
            const isHighlight = isToday && index === highlightIndex && task.status !== 'done'

            return (
              <li
                key={task.id}
                className={[
                  'os-plan-card__item',
                  `os-plan-card__item--${task.status || 'pending'}`,
                  `os-plan-card__item--${task.type || 'study'}`,
                  isHighlight ? 'os-plan-card__item--next' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="os-plan-card__rail" aria-hidden="true" />
                <span className="os-plan-card__icon" aria-hidden="true">
                  {task.icon || '⏰'}
                </span>
                <span className="os-plan-card__name">{task.title}</span>
                <span className="os-plan-card__time">{task.startTime}</span>

                {task.status === 'done' && (
                  <span className="os-plan-card__mark os-plan-card__mark--done">✓</span>
                )}

                {task.status === 'active' && (
                  <span className="os-plan-card__mark os-plan-card__mark--live">●</span>
                )}

                {task.status === 'pending' && (
                  <button
                    type="button"
                    className="os-plan-card__check"
                    aria-label={`完成${task.title}`}
                    disabled={!onToggleTaskDone}
                    onClick={() => onToggleTaskDone?.(task.id)}
                  >
                    ◯
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
          })
        )}
      </ul>

      {showActions && (
        <div className="os-plan-card__actions">
          <button type="button" className="os-plan-card__btn" onClick={onStartPomodoro}>
            🍅 开始番茄执行
          </button>
        </div>
      )}

      {onOpenAdd && (
        <button type="button" className="os-plan-fab" aria-label="添加计划" onClick={onOpenAdd}>
          +
        </button>
      )}
    </div>
  )
}
