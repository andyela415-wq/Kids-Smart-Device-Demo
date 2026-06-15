export default function VoiceWaveform({ active = false, className = '' }) {
  return (
    <span
      className={`tutor-chat__wave${active ? ' tutor-chat__wave--active' : ''} ${className}`.trim()}
      aria-hidden="true"
    >
      <i />
      <i />
      <i />
      <i />
      <i />
    </span>
  )
}
