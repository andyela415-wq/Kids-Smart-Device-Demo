import { WEEK_LABELS } from '../../config/learningTasks'
import { getTodayDayIndex } from '../../utils/learningPlanStorage'

export default function WeekTabs({ selected, onSelect }) {
  const today = getTodayDayIndex()

  return (
    <div className="os-week" role="tablist" aria-label="周视图">
      {WEEK_LABELS.map((label, index) => (
        <button
          key={label}
          type="button"
          role="tab"
          aria-selected={selected === index}
          className={`os-week__tab${selected === index ? ' os-week__tab--on' : ''}${index === today ? ' os-week__tab--today' : ''}`}
          onClick={() => onSelect(index)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
