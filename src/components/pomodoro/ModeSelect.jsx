import { MODE_LIST, MODES } from '../../config/pomodoroModes'
import TomatoCharacter from './TomatoCharacter'

export default function ModeSelect({ onSelect }) {
  return (
    <main className="pomo-select">
      <div className="pomo-select__hero">
        <TomatoCharacter size="sm" active />
        <p className="pomo-select__subtitle">今天想做什么？</p>
      </div>

      <div className="pomo-select__grid">
        {MODE_LIST.map((id) => {
          const mode = MODES[id]
          return (
            <button
              key={id}
              type="button"
              className={`pomo-select__item pomo-select__item--${id}`}
              onClick={() => onSelect(id)}
            >
              <span className="pomo-select__icon">{mode.icon}</span>
              <span className="pomo-select__label">{mode.label}</span>
            </button>
          )
        })}
      </div>
    </main>
  )
}
