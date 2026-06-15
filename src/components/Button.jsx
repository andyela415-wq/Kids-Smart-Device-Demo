const VARIANT_CLASS = {
  primary: 'btn--primary',
  secondary: 'btn--secondary',
  accent: 'btn--accent',
  ghost: 'btn--ghost',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  icon = false,
  onClick,
  disabled,
  type = 'button',
}) {
  const classes = [
    'btn',
    VARIANT_CLASS[variant],
    size === 'lg' ? 'btn--lg' : '',
    block ? 'btn--block' : '',
    icon ? 'btn--icon' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
