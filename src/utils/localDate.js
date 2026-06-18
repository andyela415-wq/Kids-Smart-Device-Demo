/** 本地日历日键（YYYY-MM-DD），用于每日 00:00 自然切换 */
export function getLocalDateKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getYesterdayLocalDateKey(date = new Date()) {
  const d = new Date(date)
  d.setDate(d.getDate() - 1)
  return getLocalDateKey(d)
}
