import { useNavigate } from 'react-router-dom'

export default function TopBar({ title, backTo = '/', onBack }) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) onBack()
    else navigate(backTo)
  }

  return (
    <header className="top-bar">
      <button
        type="button"
        className="top-bar__back"
        onClick={handleBack}
        aria-label="返回"
      >
        ‹
      </button>
      <span className="top-bar__title">{title}</span>
    </header>
  )
}
