import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PlanDayCard from '../components/os/PlanDayCard'
import PlanTaskModal from '../components/os/PlanTaskModal'
import OsTopBar from '../components/os/OsTopBar'
import WeekTabs from '../components/os/WeekTabs'
import { useOS } from '../context/LearningOSContext'
import { getTodayDayIndex } from '../utils/learningPlanStorage'
import { sortPlanTasks } from '../utils/schedulePlan'
import { writeHomeModeId } from '../utils/homeMode'
import { buildDayHint, isSelectedDayToday } from '../utils/weeklyPlan'

export default function DailyPlan() {
  const navigate = useNavigate()
  const os = useOS()
  const [taskModal, setTaskModal] = useState(null)
  const today = getTodayDayIndex()
  const isToday = isSelectedDayToday(os.planDay, today)
  const hasPending = os.planTasks.some((t) => t.status === 'pending')

  const dayHint = useMemo(
    () => buildDayHint(os.planDay, os.planTasks, today),
    [os.planDay, os.planTasks, today],
  )

  const sortedTasks = useMemo(() => sortPlanTasks(os.planTasks), [os.planTasks])

  const moveBounds = useMemo(() => {
    if (!taskModal || taskModal.mode !== 'edit' || !taskModal.task) {
      return { canMoveUp: false, canMoveDown: false }
    }
    const index = sortedTasks.findIndex((task) => task.id === taskModal.task.id)
    return {
      canMoveUp: index > 0,
      canMoveDown: index >= 0 && index < sortedTasks.length - 1,
    }
  }, [sortedTasks, taskModal])

  useEffect(() => {
    os.refreshPlan(os.planDay)
  }, [])

  const closeModal = () => setTaskModal(null)

  const openAddModal = () => setTaskModal({ mode: 'add' })

  const openEditModal = (task, options = {}) =>
    setTaskModal({ mode: 'edit', task, confirmDelete: Boolean(options.confirmDelete) })

  return (
    <div className="os-page os-page--plan">
      <OsTopBar
        title="今日计划"
        onBack={() => {
          writeHomeModeId('plan')
          navigate('/')
        }}
      />

      <WeekTabs selected={os.planDay} onSelect={os.switchPlanDay} />

      <div className="os-plan-view" key={os.planDay}>
        <PlanDayCard
          tasks={os.planTasks}
          isToday={isToday}
          dayHint={dayHint}
          showActions={isToday && hasPending}
          highlightIndex={os.highlightIndex}
          onStartPomodoro={os.startPomodoroFromPlan}
          onPreviewAlarm={isToday ? os.previewAlarm : undefined}
          onOpenAdd={openAddModal}
          onEditTask={(task) => openEditModal(task)}
          onLongPressTask={(task) => openEditModal(task, { confirmDelete: true })}
          onToggleTaskDone={os.togglePlanTaskDone}
        />
      </div>

      <PlanTaskModal
        open={Boolean(taskModal)}
        mode={taskModal?.mode || 'add'}
        task={taskModal?.task}
        initialConfirmDelete={Boolean(taskModal?.confirmDelete)}
        canMoveUp={moveBounds.canMoveUp}
        canMoveDown={moveBounds.canMoveDown}
        onClose={closeModal}
        onSave={(patch) => {
          if (taskModal?.mode === 'edit' && taskModal.task) {
            os.updatePlanTask(taskModal.task.id, patch)
          } else {
            os.addPlanTask(patch)
          }
          closeModal()
        }}
        onDelete={() => {
          if (taskModal?.mode === 'edit' && taskModal.task) {
            os.deletePlanTask(taskModal.task.id)
          }
          closeModal()
        }}
        onMoveUp={() => {
          if (taskModal?.task) os.movePlanTask(taskModal.task.id, 'up')
        }}
        onMoveDown={() => {
          if (taskModal?.task) os.movePlanTask(taskModal.task.id, 'down')
        }}
        key={taskModal?.task?.id || taskModal?.mode || 'add'}
      />
    </div>
  )
}
