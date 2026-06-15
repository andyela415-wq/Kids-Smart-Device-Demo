const listeners = new Set()

/** 各模块注册的「回到模块主页」回调，返回 true 表示已处理 */
export const hardwareHomeActions = {
  pomodoroHome: null,
}

export function onHardwareHome(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function pressHardwareHome() {
  listeners.forEach((listener) => listener())
}
