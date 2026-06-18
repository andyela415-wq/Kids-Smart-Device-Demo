/** 日程任务类型 — UI 三分类映射到存储 type */
export const PLAN_TYPE_OPTIONS = [
  { id: 'study', label: '学习', icon: '📚', storageType: 'study' },
  { id: 'break', label: '休息', icon: '☕', storageType: 'rest' },
  { id: 'life', label: '生活', icon: '🏡', storageType: 'routine' },
]

const STORAGE_TO_UI = {
  study: 'study',
  review: 'study',
  rest: 'break',
  routine: 'life',
}

export function uiTypeFromTask(task) {
  return STORAGE_TO_UI[task?.type] || 'study'
}

export function storageTypeFromUi(uiType) {
  return PLAN_TYPE_OPTIONS.find((opt) => opt.id === uiType)?.storageType || 'study'
}

export function iconForUiType(uiType) {
  return PLAN_TYPE_OPTIONS.find((opt) => opt.id === uiType)?.icon || '📚'
}

export function iconForStorageType(storageType) {
  const ui = STORAGE_TO_UI[storageType] || 'study'
  return iconForUiType(ui)
}
