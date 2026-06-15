export default function PlanTimeline({ tasks, onStart, showStart }) {
  return (
    <div className="os-plan__body">
      {tasks.length === 0 ? (
        <div className="os-plan__empty">
          <p>这一天还没有安排</p>
          <p className="os-plan__empty-hint">从 AI 学习生成计划</p>
        </div>
      ) : (
        <>
          <ul className="os-plan__list">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`os-plan__item os-plan__item--${task.status || 'pending'}`}
              >
                <span className="os-plan__time">{task.startTime}</span>
                <span className="os-plan__icon" aria-hidden="true">
                  {task.icon}
                </span>
                <span className="os-plan__name">
                  {task.title}
                  {task.durationMinutes ? `（${task.durationMinutes}min）` : ''}
                </span>
                {task.status === 'done' && <span className="os-plan__done">✓</span>}
                {task.status === 'active' && <span className="os-plan__live">●</span>}
              </li>
            ))}
          </ul>

          {showStart && (
            <button type="button" className="os-plan__start" onClick={onStart}>
              开始执行
            </button>
          )}
        </>
      )}
    </div>
  )
}
