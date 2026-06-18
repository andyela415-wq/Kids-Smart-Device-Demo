import { useEffect, useState } from 'react'

const CONFETTI_PIECES = [
  { id: 0, left: '10%', delay: 0, kind: 'paper', color: '#ff823a', rotate: 14 },
  { id: 1, left: '24%', delay: 0.12, kind: 'star', color: '#f2c94c', rotate: -10 },
  { id: 2, left: '38%', delay: 0.06, kind: 'tomato', color: '#ff6347', rotate: 8 },
  { id: 3, left: '52%', delay: 0.18, kind: 'paper', color: '#6fcf7a', rotate: -16 },
  { id: 4, left: '66%', delay: 0.08, kind: 'star', color: '#7ec8ff', rotate: 12 },
  { id: 5, left: '80%', delay: 0.22, kind: 'paper', color: '#ffb347', rotate: -8 },
  { id: 6, left: '18%', delay: 0.28, kind: 'star', color: '#ff823a', rotate: 20 },
  { id: 7, left: '72%', delay: 0.14, kind: 'tomato', color: '#e86a24', rotate: -12 },
]

function ConfettiStar({ color }) {
  return (
    <svg viewBox="0 0 12 12" width="14" height="14" aria-hidden="true">
      <path
        d="M6 1.2 7.1 4.5 10.5 4.5 7.7 6.6 8.8 10 6 7.9 3.2 10 4.3 6.6 1.5 4.5 4.9 4.5Z"
        fill={color}
      />
    </svg>
  )
}

function ConfettiTomato() {
  return (
    <svg viewBox="0 0 12 12" width="14" height="14" aria-hidden="true">
      <circle cx="6" cy="7" r="4.2" fill="#ff6347" />
      <ellipse cx="4.8" cy="3.2" rx="1.6" ry="1" fill="#6fcf7a" transform="rotate(-20 4.8 3.2)" />
      <ellipse cx="7.2" cy="3.2" rx="1.6" ry="1" fill="#6fcf7a" transform="rotate(20 7.2 3.2)" />
    </svg>
  )
}

function ConfettiPiece({ piece }) {
  if (piece.kind === 'star') {
    return (
      <span
        className="pomo-confetti__piece pomo-confetti__piece--star"
        style={{
          left: piece.left,
          animationDelay: `${piece.delay}s`,
          '--piece-rotate': `${piece.rotate}deg`,
        }}
      >
        <ConfettiStar color={piece.color} />
      </span>
    )
  }

  if (piece.kind === 'tomato') {
    return (
      <span
        className="pomo-confetti__piece pomo-confetti__piece--tomato"
        style={{
          left: piece.left,
          animationDelay: `${piece.delay}s`,
          '--piece-rotate': `${piece.rotate}deg`,
        }}
      >
        <ConfettiTomato />
      </span>
    )
  }

  return (
    <span
      className="pomo-confetti__piece pomo-confetti__piece--paper"
      style={{
        left: piece.left,
        animationDelay: `${piece.delay}s`,
        backgroundColor: piece.color,
        '--piece-rotate': `${piece.rotate}deg`,
      }}
    />
  )
}

/** 轻量庆祝彩纸 — 2 秒后自动消失 */
export default function PomodoroConfetti() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 2500)
    return () => window.clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="pomo-confetti" aria-hidden="true">
      {CONFETTI_PIECES.map((piece) => (
        <ConfettiPiece key={piece.id} piece={piece} />
      ))}
    </div>
  )
}
