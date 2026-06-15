import AiEncourageBar from './AiEncourageBar'
import GrowthStrip from './GrowthStrip'

export default function DeviceGrowthHeader({ showEncourage = false, variant = 'default' }) {
  return (
    <header className={`device-growth-header${variant === 'asset' ? ' device-growth-header--asset' : ''}`}>
      <GrowthStrip variant={variant === 'asset' ? 'asset' : 'compact'} />
      {showEncourage && <AiEncourageBar compact />}
    </header>
  )
}
