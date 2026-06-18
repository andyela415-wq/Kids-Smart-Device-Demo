export default function PomodoroDone({ task, completedPomodoros, onHome }) {
  return (
    <main className="pomo-work pomo-work--done">
      <span className="pomo-work__state-pill pomo-work__state-pill--done">完成</span>
      <p className="pomo-work__done-title">做得好！</p>
      <p className="pomo-work__task-line">
        {task?.icon} {task?.title}
      </p>
      <p className="pomo-work__done-meta">本轮完成 {completedPomodoros} 个番茄</p>
      <button type="button" className="pomo-work__start-btn" onClick={onHome}>
        返回首页
      </button>
    </main>
  )
}
