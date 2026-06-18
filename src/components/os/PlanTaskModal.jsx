import { useEffect, useState } from 'react'
import { OTHER_PLAN_PRESET, QUICK_PLAN_PRESETS } from '../../config/planPresets'
import {
  iconForUiType,
  PLAN_TYPE_OPTIONS,
  storageTypeFromUi,
  uiTypeFromTask,
} from '../../config/planTaskTypes'
import TimeRoller from './TimeRoller'

const DEFAULT_TIME = { hour: 20, minute: 0 }

function padTime(hour, minute) {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

function parseTime(time = '20:00') {
  const [h, m] = time.split(':').map(Number)
  return { hour: Number.isFinite(h) ? h : 20, minute: Number.isFinite(m) ? m : 0 }
}

function buildForm(task) {
  if (!task) {
    return {
      title: '',
      uiType: 'study',
      hour: DEFAULT_TIME.hour,
      minute: DEFAULT_TIME.minute,
    }
  }
  const { hour, minute } = parseTime(task.startTime)
  return {
    title: task.title || '',
    uiType: uiTypeFromTask(task),
    hour,
    minute,
  }
}

/** 添加 / 编辑学习任务 — 320×240 弹窗 */
export default function PlanTaskModal({
  open,
  mode = 'add',
  task = null,
  canMoveUp = false,
  canMoveDown = false,
  onClose,
  onSave,
  onDelete,
  onMoveUp,
  onMoveDown,
  initialConfirmDelete = false,
}) {
  const [step, setStep] = useState('pick')
  const [form, setForm] = useState(() => buildForm(task))
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (!open) return
    setStep(mode === 'add' ? 'pick' : 'form')
    setForm(buildForm(task))
    setConfirmDelete(Boolean(initialConfirmDelete))
  }, [open, mode, task, initialConfirmDelete])

  if (!open) return null

  const isEdit = mode === 'edit'

  const handlePickPreset = (preset) => {
    const uiType = preset.type === 'rest' ? 'break' : preset.type === 'routine' ? 'life' : 'study'
    setForm({
      title: preset.title,
      uiType,
      hour: DEFAULT_TIME.hour,
      minute: DEFAULT_TIME.minute,
    })
    setStep('form')
  }

  const handleSave = () => {
    const title = form.title.trim()
    if (!title) return

    onSave?.({
      title,
      startTime: padTime(form.hour, form.minute),
      type: storageTypeFromUi(form.uiType),
      icon: iconForUiType(form.uiType),
    })
  }

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    onDelete?.()
  }

  return (
    <div className="os-plan-modal" role="dialog" aria-modal="true" aria-label={isEdit ? '编辑任务' : '添加任务'}>
      <button type="button" className="os-plan-modal__backdrop" aria-label="关闭" onClick={onClose} />

      {step === 'pick' && !isEdit ? (
        <div className="os-plan-modal__panel">
          <h2 className="os-plan-modal__title">添加任务</h2>
          <div className="os-plan-modal__preset-grid">
            {QUICK_PLAN_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="os-plan-modal__preset"
                onClick={() => handlePickPreset(preset)}
              >
                <span aria-hidden="true">{preset.icon}</span>
                <span>{preset.title}</span>
              </button>
            ))}
            <button
              type="button"
              className="os-plan-modal__preset os-plan-modal__preset--other"
              onClick={() => handlePickPreset(OTHER_PLAN_PRESET)}
            >
              <span aria-hidden="true">🌟</span>
              <span>自定义</span>
            </button>
          </div>
          <button type="button" className="os-plan-modal__link" onClick={() => setStep('form')}>
            空白任务
          </button>
        </div>
      ) : (
        <div className="os-plan-modal__panel os-plan-modal__panel--form">
          <h2 className="os-plan-modal__title">{isEdit ? '编辑任务' : '新建任务'}</h2>

          <div className="os-plan-modal__form-body">
            <label className="os-plan-modal__field">
              <span className="os-plan-modal__label">名称</span>
              <input
                className="os-plan-modal__input"
                value={form.title}
                maxLength={12}
                placeholder="任务名称"
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </label>

            <div className="os-plan-modal__field">
              <span className="os-plan-modal__label">类型</span>
              <div className="os-plan-modal__types">
                {PLAN_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`os-plan-modal__type${form.uiType === opt.id ? ' os-plan-modal__type--on' : ''}`}
                    onClick={() => setForm((prev) => ({ ...prev, uiType: opt.id }))}
                  >
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="os-plan-modal__field os-plan-modal__field--time">
              <span className="os-plan-modal__label">时间</span>
              <div className="os-plan-modal__time-row">
                <TimeRoller min={0} max={23} value={form.hour} onChange={(hour) => setForm((p) => ({ ...p, hour }))} label="时" />
                <span className="os-plan-modal__colon">:</span>
                <TimeRoller min={0} max={59} value={form.minute} onChange={(minute) => setForm((p) => ({ ...p, minute }))} label="分" />
              </div>
            </div>

            {isEdit && (
              <div className="os-plan-modal__reorder">
                <button type="button" className="os-plan-modal__reorder-btn" disabled={!canMoveUp} onClick={onMoveUp}>
                  ↑ 上移
                </button>
                <button type="button" className="os-plan-modal__reorder-btn" disabled={!canMoveDown} onClick={onMoveDown}>
                  ↓ 下移
                </button>
              </div>
            )}
          </div>

          <div className={`os-plan-modal__actions${isEdit ? ' os-plan-modal__actions--edit' : ''}`}>
            {!isEdit && (
              <button type="button" className="os-plan-modal__btn os-plan-modal__btn--ghost" onClick={() => setStep('pick')}>
                返回
              </button>
            )}
            {isEdit && (
              <button
                type="button"
                className={`os-plan-modal__btn os-plan-modal__btn--danger${confirmDelete ? ' os-plan-modal__btn--danger-on' : ''}`}
                onClick={handleDelete}
              >
                {confirmDelete ? '确认删除' : '删除'}
              </button>
            )}
            <button type="button" className="os-plan-modal__btn os-plan-modal__btn--ghost" onClick={onClose}>
              取消
            </button>
            <button type="button" className="os-plan-modal__btn os-plan-modal__btn--primary" onClick={handleSave}>
              保存
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
