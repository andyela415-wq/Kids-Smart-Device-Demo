const RETURN_KEY = 'pomodoro_return_to'

export function setPomodoroReturnTo(path) {
  if (path) sessionStorage.setItem(RETURN_KEY, path)
  else sessionStorage.removeItem(RETURN_KEY)
}

export function getPomodoroReturnTo() {
  return sessionStorage.getItem(RETURN_KEY) || null
}

export function clearPomodoroReturnTo() {
  sessionStorage.removeItem(RETURN_KEY)
}
