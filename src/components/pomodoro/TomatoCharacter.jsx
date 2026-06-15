import { TomatoHeroSvg, TomatoMascotSvg } from './TomatoSvg'

export default function TomatoCharacter({
  active = false,
  size = 'md',
  mood = 'focus',
}) {
  const Svg = size === 'lg' ? TomatoHeroSvg : TomatoMascotSvg

  return (
    <div
      className={`pomo-tomato pomo-tomato--${size}${active ? ' pomo-tomato--active' : ''}${mood === 'cheer' ? ' pomo-tomato--cheer' : ''}`}
      aria-hidden="true"
    >
      <Svg className="pomo-tomato__svg" mood={mood} />
    </div>
  )
}
