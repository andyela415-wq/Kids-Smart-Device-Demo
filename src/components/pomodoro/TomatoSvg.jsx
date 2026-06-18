import { useId } from 'react'

const MOODS = {
  focus: {
    leftEye: { cx: 24, cy: 36, r: 2.6 },
    rightEye: { cx: 40, cy: 36, r: 2.6 },
    mouth: 'M26 42 C28.5 45 35.5 45 38 42',
    mouthStroke: 1.8,
  },
  cheer: {
    leftEye: { cx: 24, cy: 35.5, r: 3 },
    rightEye: { cx: 40, cy: 35.5, r: 3 },
    mouth: 'M24 41 C28 46 36 46 40 41',
    mouthStroke: 2,
  },
  pause: {
    leftEye: 'M20 35 H28',
    rightEye: 'M36 35 H44',
    mouth: 'M28 43 H36',
    mouthStroke: 1.6,
  },
  rest: {
    leftEye: 'M20 36 Q24 33 28 36',
    rightEye: 'M36 36 Q40 33 44 36',
    mouth: 'M27 43 C30 45 34 45 37 43',
    mouthStroke: 1.6,
  },
  rush: {
    leftEye: { cx: 24, cy: 35, r: 3.2 },
    rightEye: { cx: 40, cy: 35, r: 3.2 },
    mouth: 'M30 43 C31.5 45 32.5 45 34 43',
    mouthStroke: 1.8,
  },
}

function TomatoFace({ mood }) {
  const face = MOODS[mood] || MOODS.focus

  const renderEye = (side) => {
    const data = side === 'left' ? face.leftEye : face.rightEye
    if (typeof data === 'string') {
      return (
        <path
          d={data}
          stroke="#3E1A12"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      )
    }
    const highlightX = side === 'left' ? data.cx + 1 : data.cx + 1
    return (
      <>
        <circle cx={data.cx} cy={data.cy} r={data.r} fill="#3E1A12" />
        <circle cx={highlightX} cy={data.cy - 1} r={0.9} fill="#FFFFFF" opacity="0.9" />
      </>
    )
  }

  return (
    <>
      <ellipse cx="20" cy="40" rx="4.5" ry="3" fill="#FF9EB5" opacity="0.75" />
      <ellipse cx="44" cy="40" rx="4.5" ry="3" fill="#FF9EB5" opacity="0.75" />
      {renderEye('left')}
      {renderEye('right')}
      <path
        d={face.mouth}
        stroke="#3E1A12"
        strokeWidth={face.mouthStroke}
        strokeLinecap="round"
        fill="none"
      />
    </>
  )
}

export function TomatoMascotSvg({ className, mood = 'focus' }) {
  const uid = useId().replace(/:/g, '')
  const bodyId = `tomato-body-${uid}`
  const leafId = `tomato-leaf-${uid}`

  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={bodyId} cx="38%" cy="32%" r="58%">
          <stop offset="0%" stopColor="#FF8A72" />
          <stop offset="55%" stopColor="#F04A3A" />
          <stop offset="100%" stopColor="#D93025" />
        </radialGradient>
        <linearGradient id={leafId} x1="32" y1="8" x2="32" y2="20">
          <stop offset="0%" stopColor="#8AE878" />
          <stop offset="100%" stopColor="#45B84A" />
        </linearGradient>
      </defs>

      <path
        d="M32 6 C34 4 36 8 35 12 L33 16"
        stroke="#45B84A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse cx="26" cy="14" rx="7" ry="4" fill={`url(#${leafId})`} transform="rotate(-25 26 14)" />
      <ellipse cx="38" cy="14" rx="7" ry="4" fill={`url(#${leafId})`} transform="rotate(25 38 14)" />
      <ellipse cx="32" cy="38" rx="24" ry="22" fill={`url(#${bodyId})`} />
      <ellipse cx="24" cy="30" rx="7" ry="5" fill="#FFFFFF" opacity="0.38" />
      <TomatoFace mood={mood} />
    </svg>
  )
}

export function TomatoHeroSvg({ className, mood = 'cheer' }) {
  const uid = useId().replace(/:/g, '')
  const bodyId = `tomato-hero-body-${uid}`
  const shineId = `tomato-hero-shine-${uid}`
  const leafId = `tomato-hero-leaf-${uid}`
  const shadowId = `tomato-soft-shadow-${uid}`

  const face = MOODS[mood] || MOODS.cheer

  return (
    <svg
      className={className}
      viewBox="0 -4 80 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={bodyId} cx="42%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#FF9580" />
          <stop offset="45%" stopColor="#F04A3A" />
          <stop offset="100%" stopColor="#C62820" />
        </radialGradient>
        <radialGradient id={shineId} cx="30%" cy="28%" r="40%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={leafId} x1="40" y1="6" x2="40" y2="22">
          <stop offset="0%" stopColor="#9AF088" />
          <stop offset="100%" stopColor="#3FA842" />
        </linearGradient>
        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#A02010" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter={`url(#${shadowId})`}>
        <path
          d="M40 8 C42 5 44 9 43 14 L41 18"
          stroke="#3FA842"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <ellipse cx="32" cy="16" rx="9" ry="5" fill={`url(#${leafId})`} transform="rotate(-22 32 16)" />
        <ellipse cx="48" cy="16" rx="9" ry="5" fill={`url(#${leafId})`} transform="rotate(22 48 16)" />
        <ellipse cx="40" cy="13" rx="6" ry="3.5" fill={`url(#${leafId})`} />
        <circle cx="40" cy="46" r="28" fill={`url(#${bodyId})`} />
        <circle cx="40" cy="46" r="28" fill={`url(#${shineId})`} />
        <g transform="translate(8 8) scale(1.05)">
          <TomatoFace mood={mood} />
        </g>
      </g>
    </svg>
  )
}

export function resolveTomatoMood({ isRest, isRunning, roundRemaining, roundTotal, progress }) {
  if (isRest) return 'rest'
  if (!isRunning) return 'pause'
  if (roundRemaining > 0 && roundRemaining <= 60) return 'rush'
  if (progress >= 0.5) return 'cheer'
  return 'focus'
}

export function resolveCompanionText({ isRest, isRunning, mood, taskName }) {
  if (isRest) return '休息一下吧～'
  if (!isRunning) return '等你一起继续'
  if (mood === 'rush') return '快完成啦！'
  if (mood === 'cheer') return '做得很棒！'
  return `${taskName}加油`
}
