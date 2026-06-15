import { useLearningGrowth } from '../hooks/useLearningGrowth'

export default function GrowthStrip({ compact = false, pointsOnly = false, variant = 'default' }) {
  const { profile } = useLearningGrowth()
  const variantClass =
    variant === 'asset' ? ' growth-strip--asset' : compact ? ' growth-strip--compact' : ''

  if (pointsOnly) {
    return (
      <div className="growth-strip growth-strip--points-only" aria-label={`成长值 ${profile.points}`}>
        <span className="growth-strip__icon" aria-hidden="true">
          ⭐
        </span>
        <span className="growth-strip__value">{profile.points}</span>
      </div>
    )
  }

  return (
    <div
      className={`growth-strip${variantClass}`}
      aria-label="学习成长数据"
    >
      <span className="growth-strip__item growth-strip__item--points">
        <span className="growth-strip__icon growth-strip__icon--star" aria-hidden="true">
          ⭐
        </span>
        <span className="growth-strip__value">{profile.points}</span>
        {variant === 'asset' ? (
          <span className="growth-strip__label">积分</span>
        ) : (
          !compact && <span className="growth-strip__label">积分</span>
        )}
      </span>
      {variant !== 'asset' && (
        <span className="growth-strip__dot" aria-hidden="true">
          ·
        </span>
      )}
      <span className="growth-strip__item growth-strip__item--streak">
        <span className="growth-strip__icon" aria-hidden="true">
          🔥
        </span>
        <span className="growth-strip__value">{profile.streakDays}</span>
        {variant === 'asset' ? (
          <span className="growth-strip__label">连续</span>
        ) : (
          !compact && <span className="growth-strip__label">天</span>
        )}
      </span>
      {variant !== 'asset' && (
        <span className="growth-strip__dot" aria-hidden="true">
          ·
        </span>
      )}
      <span className="growth-strip__item growth-strip__item--time">
        <span className="growth-strip__icon" aria-hidden="true">
          ⏱
        </span>
        <span className="growth-strip__value">{profile.todayMinutes}</span>
        {variant === 'asset' ? (
          <span className="growth-strip__label">分钟</span>
        ) : (
          !compact && <span className="growth-strip__label">分钟</span>
        )}
      </span>
    </div>
  )
}
