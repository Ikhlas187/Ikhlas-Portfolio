import type { CSSProperties } from 'react'
import coinSolid from '@/assets/coin-solid.svg'
import coinSolidAccent from '@/assets/coin-solid-accent.svg'

export default function SolidCoin({
  letter,
  isAccent,
  style,
}: {
  letter: string
  isAccent: boolean
  style?: CSSProperties
}) {
  return (
    <span className="absolute inset-0" style={style}>
      <img src={isAccent ? coinSolidAccent : coinSolid} alt="" className="absolute inset-0 size-full" />
      <span className="absolute inset-x-0 top-[44%] -translate-y-1/2 scale-y-[0.66] text-center font-sans text-[calc(var(--coin)*0.44)] leading-none font-extrabold text-black">
        {letter}
      </span>
    </span>
  )
}
