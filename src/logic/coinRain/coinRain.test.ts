import { describe, expect, it } from 'vitest'
import {
  buildRain,
  exitDelayMs,
  isRevealCycle,
  pileSettledAt,
  rainKeyframes,
  rowsForCycle,
  type CoinRainTiming,
} from '@/logic/coinRain/coinRain'

const timing: CoinRainTiming = {
  cycle: 8,
  stagger: 0.16,
  rowPause: 0.35,
  fall: 0.97,
  bounce: 0.2,
  fadeIn: 0.08,
  swapFrom: 0.95,
  swapTo: 1.15,
  wipeFrom: 0.85,
  wipeTo: 0.93,
}
const rows = ['IKHLAS', 'AGBETI', 'DEVELOPER']

describe('buildRain', () => {
  it('donne 1 pièce par lettre', () => {
    const coins = buildRain(rows, timing)

    expect(coins).toHaveLength(21)
  })

  it('fait tomber la rangée du bas en premier, de gauche à droite', () => {
    const coins = buildRain(rows, timing)

    const lettersInFallOrder = coins.map((coin) => coin.letter).join('')

    expect(lettersInFallOrder).toBe('DEVELOPERAGBETIIKHLAS')
  })

  it('écrit les rangées de haut en bas dans l’ordre donné', () => {
    const coins = buildRain(rows, timing)

    const rowsTopToBottom = [2, 1, 0].map((level) =>
      coins
        .filter((coin) => coin.level === level)
        .sort((a, b) => a.cx - b.cx)
        .map((coin) => coin.letter)
        .join(''),
    )

    expect(rowsTopToBottom).toEqual(rows)
  })

  it('centre chaque rangée', () => {
    const bottomRow = buildRain(rows, timing).filter((coin) => coin.level === 0)

    const edges = [bottomRow[0].cx, bottomRow[8].cx]

    expect(edges).toEqual([-4, 4])
  })

  it('ajoute une pause entre 2 rangées', () => {
    const coins = buildRain(rows, timing)

    const gapBetweenRows = coins[9].start - coins[8].start

    expect(gapBetweenRows).toBeCloseTo(timing.stagger + timing.rowPause)
  })
})

describe('rowsForCycle', () => {
  const roles = ['DEVELOPER', 'DESIGNER', 'CREATIVE']

  it('change la dernière rangée à chaque chute', () => {
    const fixedRows = ['IKHLAS', 'AGBETI']

    const lastRows = [0, 1, 2].map((cycleIndex) => rowsForCycle(fixedRows, roles, cycleIndex)[2])

    expect(lastRows).toEqual(roles)
  })

  it('reprend au 1er mot après le dernier', () => {
    const fixedRows = ['IKHLAS', 'AGBETI']

    expect(rowsForCycle(fixedRows, roles, 3)).toEqual(['IKHLAS', 'AGBETI', 'DEVELOPER'])
  })
})

describe('isRevealCycle', () => {
  it('attend la dernière chute imposée', () => {
    const minDrops = 3

    const revealCycles = [0, 1, 2, 3].map((cycleIndex) => isRevealCycle(cycleIndex, minDrops))

    expect(revealCycles).toEqual([false, false, true, true])
  })

  it('révèle dès la 1re chute pour une visite déjà faite', () => {
    const minDrops = 1

    expect(isRevealCycle(0, minDrops)).toBe(true)
  })
})

describe('pileSettledAt', () => {
  it('pose la dernière pièce avant l’effacement de la pile', () => {
    const coins = buildRain(rows, timing)

    expect(pileSettledAt(coins, timing)).toBeLessThan(timing.wipeFrom * timing.cycle)
  })
})

describe('exitDelayMs', () => {
  it('fait partir la rangée du haut avant celle du bas', () => {
    const coins = buildRain(rows, timing)
    const topLeft = coins.find((coin) => coin.level === 2)!
    const bottomLeft = coins.find((coin) => coin.level === 0)!

    const delays = [exitDelayMs(topLeft, rows.length), exitDelayMs(bottomLeft, rows.length)]

    expect(delays[0]).toBeLessThan(delays[1])
  })
})

describe('rainKeyframes', () => {
  it('génère une animation par pièce', () => {
    const coins = buildRain(rows, timing)

    const css = rainKeyframes(coins, timing)

    expect(css.match(/@keyframes rain-\d+/g)).toHaveLength(21)
  })

  it('préfixe toutes les animations du nom donné', () => {
    const coins = buildRain(['IKHLAS'], timing)

    const css = rainKeyframes(coins, timing, 'final-rain')

    expect(css.match(/@keyframes rain-/g)).toBeNull()
  })
})
