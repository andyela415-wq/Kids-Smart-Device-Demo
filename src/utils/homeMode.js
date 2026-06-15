const HOME_MODE_KEY = 'device_home_mode'
const MODE_IDS = ['ai', 'plan', 'pomo']

export function readHomeModeIndex() {
  try {
    const id = sessionStorage.getItem(HOME_MODE_KEY) || 'ai'
    const index = MODE_IDS.indexOf(id)
    return index >= 0 ? index : 0
  } catch {
    return 0
  }
}

export function writeHomeModeId(id) {
  if (!MODE_IDS.includes(id)) return
  try {
    sessionStorage.setItem(HOME_MODE_KEY, id)
  } catch {
    /* ignore */
  }
}

export function writeHomeModeForPath(pathname) {
  if (pathname.startsWith('/plan')) writeHomeModeId('plan')
  else if (pathname.startsWith('/pomodoro')) writeHomeModeId('pomo')
  else if (pathname.startsWith('/ai')) writeHomeModeId('ai')
}
