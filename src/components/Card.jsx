export default function Card({ title, desc, icon, color = 'blue', onClick, children }) {
  const interactive = Boolean(onClick)
  const classes = ['card', interactive ? 'card--interactive' : ''].filter(Boolean).join(' ')

  const content = (
    <>
      {icon && <div className={`icon-block icon-block--${color}`}>{icon}</div>}
      {title && <div className="card__title">{title}</div>}
      {desc && <div className="card__desc">{desc}</div>}
      {children}
    </>
  )

  if (interactive) {
    return (
      <div className={classes} onClick={onClick} role="button" tabIndex={0}>
        {content}
      </div>
    )
  }

  return <div className={classes}>{content}</div>
}
