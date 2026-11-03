import type { CSSProperties } from 'react'
import FlatCoin from '@/components/ui/FlatCoin'
import SolidCoin from '@/components/ui/SolidCoin'
import { exitDelayMs, type RainCoin } from '@/logic/coinRain/coinRain'

const EXIT_MS = 750

export default function CoinPile({
  coins,
  keyframes,
  cycleSeconds,
  rowCount,
  isStatic,
  isExiting,
  keyframesName = 'rain',
  isSingleDrop = false,
}: {
  coins: RainCoin[]
  keyframes: string
  cycleSeconds: number
  rowCount: number
  isStatic: boolean
  isExiting: boolean
  keyframesName?: string
  // Une seule chute qui reste posée, sans effacement : la pluie de fin de page.
  isSingleDrop?: boolean
}) {
  const cycle = `${cycleSeconds}s`
  const iteration = isSingleDrop ? '1 forwards' : 'infinite'

  return (
    <div
      className="relative h-[calc(var(--row)*3+46px)] w-[calc(var(--pitch)*9)] [--coin:46px] [--pitch:50px] [--row:48px] [perspective-origin:50%_60%] [perspective:700px] max-[520px]:[--coin:36px] max-[520px]:[--pitch:39px] max-[520px]:[--row:38px]"
      style={
        isStatic || isSingleDrop
          ? undefined
          : {
              animation: `${keyframesName}-wipe ${cycle} linear infinite`,
              animationPlayState: isExiting ? 'paused' : undefined,
            }
      }
    >
      <style>{keyframes}</style>
      {coins.map((coin, index) => {
        const exitStyle = {
          '--exit-spin': `${coin.spin}deg`,
          animation: isExiting
            ? `${keyframesName}-exit ${EXIT_MS}ms cubic-bezier(0.5, 0, 0.75, 0) ${exitDelayMs(coin, rowCount)}ms forwards`
            : undefined,
        } as Record<string, string | undefined> as CSSProperties
        const coinStyle = {
          '--x': `calc(${coin.cx} * var(--pitch))`,
          '--lift': `calc(${coin.level} * var(--row) * -1)`,
          '--z': `${coin.z}px`,
          '--spin': `${coin.spin}deg`,
          '--tilt': `${coin.tilt}deg`,
          ...(isStatic
            ? { opacity: 1, transform: 'translate3d(var(--x), var(--lift), var(--z))' }
            : { opacity: 0, animation: `${keyframesName}-${index} ${cycle} linear ${iteration}` }),
          animationPlayState: isExiting ? 'paused' : undefined,
        } as Record<string, string | number | undefined> as CSSProperties
        const faceStyle = { animation: `${keyframesName}-face ${cycle} linear ${iteration} ${coin.start}s` }
        const solidStyle = {
          opacity: 0,
          animation: `${keyframesName}-solid ${cycle} linear ${iteration} ${coin.start}s`,
        }

        return (
          <span key={index} className="absolute inset-0" style={exitStyle}>
            <span
              className="absolute bottom-[34px] left-1/2 ml-[calc(var(--coin)/-2)] size-[var(--coin)]"
              style={coinStyle}
            >
              {!isStatic && (
                <FlatCoin
                  letter={coin.letter}
                  style={{ ...faceStyle, animationPlayState: isExiting ? 'paused' : undefined }}
                />
              )}
              <SolidCoin
                letter={coin.letter}
                style={isStatic ? undefined : { ...solidStyle, animationPlayState: isExiting ? 'paused' : undefined }}
              />
            </span>
          </span>
        )
      })}
    </div>
  )
}
