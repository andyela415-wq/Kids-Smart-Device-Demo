import { useNavigate } from 'react-router-dom'

export default function OsTopBar({ title, onBack }) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) onBack()
    else navigate('/')
  }

  return (
    <header className="os-topbar">
      <button type="button" className="os-topbar__back" onClick={handleBack} aria-label="返回">
        ‹
      </button>
      <span className="os-topbar__title">{title}</span>
      <span className="os-topbar__spacer" aria-hidden="true" />
    </header>
  )
}
