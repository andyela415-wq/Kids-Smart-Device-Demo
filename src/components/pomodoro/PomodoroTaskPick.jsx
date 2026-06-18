import { useCallback, useState } from 'react'
import { POMODORO_TASK_PRESETS } from '../../config/pomodoroWork'

const TASK_TONE_BY_TITLE = [
  { test: (title) => title.includes('语文'), tone: 'blue' },
  { test: (title) => title.includes('背单词'), tone: 'green' },
  { test: (title) => title.includes('读课文'), tone: 'yellow' },
  { test: (title) => title.includes('写作'), tone: 'pink' },
  { test: (title) => title.includes('数学'), tone: 'purple' },
  { test: (title) => title.includes('英语') || title.includes('听力'), tone: 'cyan' },
]

const CUSTOM_TASK_TONES = ['blue', 'green', 'yellow', 'pink', 'purple', 'cyan']

function resolveTaskTone(title, fallback = 'blue') {
  const match = TASK_TONE_BY_TITLE.find((rule) => rule.test(title))
  return match?.tone || fallback
}

function TaskCard({ item, onSelect }) {
  const tone = item.tone || resolveTaskTone(item.title)

  return (
    <button
      type="button"
      className={`pomo-pick__card pomo-pick__card--${tone}`}
      onClick={() => onSelect(item)}
    >
      <span className="pomo-pick__icon" aria-hidden="true">
        {item.icon}
      </span>
      <span className="pomo-pick__name">{item.title}</span>
      {item.source === 'plan' && <span className="pomo-pick__badge">计划</span>}
    </button>
  )
}

export default function PomodoroTaskPick({ planTasks = [], onSelect, onBack }) {
  const [customTasks, setCustomTasks] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [draftName, setDraftName] = useState('')

  const pendingPlan = planTasks.filter(
    (task) =>
      task.status === 'pending' &&
      task.type !== 'rest' &&
      task.title !== '起床' &&
      task.title !== '睡觉',
  )

  const planItems = pendingPlan.map((task) => ({
    id: task.id,
    title: task.title,
    icon: task.icon,
    durationMinutes: task.durationMinutes,
    source: 'plan',
    tone: resolveTaskTone(task.title),
  }))

  const presetItems = POMODORO_TASK_PRESETS.map((task) => ({
    ...task,
    source: 'preset',
    tone: resolveTaskTone(task.title),
  }))

  const gridItems = [...customTasks, ...planItems, ...presetItems]

  const openCustomModal = useCallback(() => {
    setDraftName('')
    setModalOpen(true)
  }, [])

  const closeCustomModal = useCallback(() => {
    setModalOpen(false)
    setDraftName('')
  }, [])

  const confirmCustomTask = useCallback(() => {
    const title = draftName.trim()
    if (!title) return

    const tone = CUSTOM_TASK_TONES[customTasks.length % CUSTOM_TASK_TONES.length]
    const newTask = {
      id: `custom-${Date.now()}`,
      title,
      icon: '🌟',
      source: 'custom',
      tone,
    }

    setCustomTasks((prev) => [newTask, ...prev])
    closeCustomModal()
  }, [closeCustomModal, customTasks.length, draftName])

  const simulateVoiceInput = useCallback(() => {
    const samples = ['练钢琴', '做手工', '复习科学', '整理书包']
    const sample = samples[Math.floor(Math.random() * samples.length)]
    setDraftName(sample)
  }, [])

  return (
    <div className="pomo-pick">
      <header className="pomo-pick__header">
        <button type="button" className="pomo-pick__back" aria-label="返回" onClick={onBack}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              d="M14.5 6.5 9 12l5.5 5.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="pomo-pick__title">番茄闹钟</h1>
      </header>

      <main className="pomo-pick__main">
        <p className="pomo-pick__subtitle">选择学习任务</p>

        <div className="pomo-pick__grid-container grid-container">
          <div className="pomo-pick__grid">
            {gridItems.map((item) => (
              <TaskCard key={item.id} item={item} onSelect={onSelect} />
            ))}

            <button
              type="button"
              className="pomo-pick__card pomo-pick__card--add"
              onClick={openCustomModal}
            >
              <span className="pomo-pick__icon" aria-hidden="true">
                ➕
              </span>
              <span className="pomo-pick__name">自定义</span>
            </button>
          </div>
        </div>
      </main>

      {modalOpen && (
        <div className="pomo-pick__modal" role="dialog" aria-modal="true" aria-label="自定义任务">
          <button
            type="button"
            className="pomo-pick__modal-backdrop"
            aria-label="关闭"
            onClick={closeCustomModal}
          />
          <div className="pomo-pick__modal-panel">
            <h2 className="pomo-pick__modal-title">自定义任务</h2>
            <p className="pomo-pick__modal-hint">给新任务起个名字吧</p>
            <div className="pomo-pick__modal-field">
              <input
                type="text"
                className="pomo-pick__modal-input"
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                placeholder="例如：练钢琴"
                maxLength={8}
                autoFocus
                onKeyDown={(event) => {
                  if (event.key === 'Enter') confirmCustomTask()
                }}
              />
              <button
                type="button"
                className="pomo-pick__modal-voice"
                aria-label="模拟语音录入"
                onClick={simulateVoiceInput}
              >
                🎤
              </button>
            </div>
            <div className="pomo-pick__modal-actions">
              <button type="button" className="pomo-pick__modal-btn" onClick={closeCustomModal}>
                取消
              </button>
              <button
                type="button"
                className="pomo-pick__modal-btn pomo-pick__modal-btn--primary"
                disabled={!draftName.trim()}
                onClick={confirmCustomTask}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
