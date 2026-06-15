import { useCallback, useState } from 'react'
import { getLesson, LESSONS } from '../config/tutoringLessons'
import { recordTutoringStudy } from '../utils/learningGrowth'

export function useTutoringSession() {
  const [page, setPage] = useState('select')
  const [lessonId, setLessonId] = useState(LESSONS[0]?.id ?? '')

  const lesson = getLesson(lessonId)

  const selectLesson = useCallback((id) => {
    setLessonId(id)
  }, [])

  const startTutoring = useCallback(() => {
    if (!lessonId) return
    setPage('analyzing')
  }, [lessonId])

  const finishAnalysis = useCallback(() => {
    recordTutoringStudy(8)
    setPage('report')
  }, [])

  const startChat = useCallback(() => {
    setPage('chat')
  }, [])

  const goToReport = useCallback(() => {
    setPage('report')
  }, [])

  const exitToSelect = useCallback(() => {
    setPage('select')
  }, [])

  return {
    page,
    setPage,
    lessonId,
    lesson,
    selectLesson,
    startTutoring,
    finishAnalysis,
    startChat,
    goToReport,
    exitToSelect,
  }
}
