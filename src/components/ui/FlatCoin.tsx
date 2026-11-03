import type { CSSProperties } from 'react'
import coinFlat from '@/assets/coin-flat.svg'

export default function FlatCoin({
  letter,
  style,
}: {
  letter: string
  style?: CSSProperties
}) {
  return (
    <span className="absolute inset-0 grid place-items-center" style={style}>
      <img src={coinFlat} alt="" className="absolute inset-0 size-full" />
      <span className="relative font-sans text-[calc(var(--coin)*0.48)] leading-none font-extrabold text-black">
        {letter}
      </span>
    </span>
  )
}
