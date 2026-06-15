import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AddPlanModal from '../components/os/AddPlanModal'
import PlanDayCard from '../components/os/PlanDayCard'
import OsTopBar from '../components/os/OsTopBar'
import WeekTabs from '../components/os/WeekTabs'
import { useOS } from '../context/LearningOSContext'
import { getTodayDayIndex } from '../utils/learningPlanStorage'
import { writeHomeModeId } from '../utils/homeMode'
import { buildDayHint, isSelectedDayToday } from '../utils/weeklyPlan'

export default function DailyPlan() {
  const navigate = useNavigate()
  const os = useOS()
  const [addOpen, setAddOpen] = useState(false)
  const today = getTodayDayIndex()
  const isToday = isSelectedDayToday(os.planDay, today)
  const hasPending = os.planTasks.some((t) => t.status === 'pending')

  const dayHint = useMemo(
    () => buildDayHint(os.planDay, os.planTasks, today),
    [os.planDay, os.planTasks, today],
  )

  useEffect(() => {
    os.refreshPlan(os.planDay)
  }, [])

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
          onOpenAdd={() => setAddOpen(true)}
          onToggleTaskDone={os.togglePlanTaskDone}
        />
      </div>

      <AddPlanModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSelect={(preset) => {
          os.addPlanTask(preset)
          setAddOpen(false)
        }}
      />
    </div>
  )
}
