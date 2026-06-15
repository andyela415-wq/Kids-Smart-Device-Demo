const COLOR_HIGHLIGHTS = [
  { word: '五彩缤纷', color: '#9c27b0' },
  { word: '黄黄的', color: '#f9a825' },
  { word: '香香的', color: '#66bb6a' },
  { word: '黄色', color: '#f9a825' },
  { word: '红色', color: '#e53935' },
  { word: '紫色', color: '#8e24aa' },
  { word: '绿色', color: '#43a047' },
  { word: '蓝色', color: '#1e88e5' },
]

const WORD_PATTERN = COLOR_HIGHLIGHTS.map(({ word }) =>
  word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
)
  .sort((a, b) => b.length - a.length)
  .join('|')

const SPLIT_REGEX = WORD_PATTERN ? new RegExp(`(${WORD_PATTERN})`, 'g') : null

const COLOR_MAP = Object.fromEntries(COLOR_HIGHLIGHTS.map(({ word, color }) => [word, color]))

export function renderHighlightedText(text) {
  if (!SPLIT_REGEX) return text

  return text.split('\n').map((line, lineIndex, lines) => {
    const parts = line.split(SPLIT_REGEX).filter(Boolean)

    return (
      <span key={`line-${lineIndex}`}>
        {parts.map((part, partIndex) => {
          const color = COLOR_MAP[part]
          if (color) {
            return (
              <span
                key={`${lineIndex}-${partIndex}`}
                className="tutor-chat__hl"
                style={{ color }}
              >
                {part}
              </span>
            )
          }
          return <span key={`${lineIndex}-${partIndex}`}>{part}</span>
        })}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    )
  })
}
