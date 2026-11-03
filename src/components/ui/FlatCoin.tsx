import type { CSSProperties } from 'react'
import coinFlat from '@/assets/coin-flat.svg'
import coinFlatAccent from '@/assets/coin-flat-accent.svg'

export default function FlatCoin({
  letter,
  isAccent,
  style,
}: {
  letter: string
  isAccent: boolean
  style?: CSSProperties
}) {
  return (
    <span className="absolute inset-0 grid place-items-center" style={style}>
      <img src={isAccent ? coinFlatAccent : coinFlat} alt="" className="absolute inset-0 size-full" />
      <span className="relative font-sans text-[calc(var(--coin)*0.48)] leading-none font-extrabold text-black">
        {letter}
      </span>
    </span>
  )
}
