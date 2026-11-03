export interface CoinRainTiming {
  cycle: number
  stagger: number
  rowPause: number
  fall: number
  bounce: number
  fadeIn: number
  swapFrom: number
  swapTo: number
  wipeFrom: number
  wipeTo: number
}

export interface RainCoin {
  letter: string
  level: number
  cx: number
  z: number
  spin: number
  tilt: number
  start: number
  isAccent: boolean
}

export function rowsForCycle(fixedRows: readonly string[], rotatingWords: readonly string[], cycleIndex: number) {
  return [...fixedRows, rotatingWords[cycleIndex % rotatingWords.length]]
}

export function isRevealCycle(cycleIndex: number, minDrops: number) {
  return cycleIndex >= minDrops - 1
}

const DEPTHS = [3, -2, 4, -3, 1]
const TILTS = [-5, 0, 5, -1, 4]

// Rangées données de haut en bas : la rangée du bas tombe en premier, de gauche à droite.
export function buildRain(rows: readonly string[], timing: CoinRainTiming): RainCoin[] {
  const coins: RainCoin[] = []
  let start = 0
  for (let level = 0; level < rows.length; level++) {
    const word = rows[rows.length - 1 - level]
    if (level > 0) start += timing.rowPause
    for (let col = 0; col < word.length; col++) {
      const index = coins.length
      coins.push({
        letter: word[col],
        level,
        cx: col - (word.length - 1) / 2,
        z: DEPTHS[index % DEPTHS.length],
        spin: ((index * 71 + 200) % 360) - 180,
        tilt: TILTS[index % TILTS.length],
        start: Number(start.toFixed(3)),
        isAccent: level === rows.length - 1 && col === 0,
      })
      start += timing.stagger
    }
  }
  return coins
}

export function pileSettledAt(coins: readonly RainCoin[], timing: CoinRainTiming) {
  const last = coins[coins.length - 1]
  return last ? last.start + timing.fall + timing.bounce : 0
}

// Les rangées du haut partent en premier à la sortie.
export function exitDelayMs(coin: RainCoin, rowCount: number) {
  return (rowCount - 1 - coin.level) * 90 + (coin.cx + 4) * 25
}

const percent = (time: number, cycle: number) => `${Number(((time / cycle) * 100).toFixed(3))}%`

const placed = (lift: string, z: string, rotation: string) =>
  `translate3d(var(--x), ${lift}, ${z}) rotate(${rotation})`

export function rainKeyframes(coins: readonly RainCoin[], timing: CoinRainTiming) {
  const { cycle } = timing
  const top = placed('calc(var(--lift) - 200px)', '90px', 'var(--spin)')
  const landed = placed('var(--lift)', 'var(--z)', 'var(--tilt)')
  const bounced = placed('calc(var(--lift) - 8px)', 'var(--z)', 'var(--tilt)')
  const falling = 'animation-timing-function: cubic-bezier(0.4, 0, 0.9, 0.42);'

  const drops = coins.map((coin, index) => {
    const land = coin.start + timing.fall
    const head =
      coin.start === 0
        ? `0% { transform: ${top}; opacity: 0; ${falling} }`
        : `0% { transform: ${top}; opacity: 0; } ${percent(coin.start, cycle)} { transform: ${top}; opacity: 0; ${falling} }`
    return `@keyframes rain-${index} { ${head} ${percent(coin.start + timing.fadeIn, cycle)} { opacity: 1; } ${percent(land, cycle)} { transform: ${landed}; animation-timing-function: ease-out; } ${percent(land + timing.bounce / 2, cycle)} { transform: ${bounced}; } ${percent(land + timing.bounce, cycle)}, 100% { transform: ${landed}; opacity: 1; } }`
  })

  return [
    ...drops,
    `@keyframes rain-face { 0%, ${percent(timing.swapFrom, cycle)} { opacity: 1; } ${percent(timing.swapTo, cycle)}, 100% { opacity: 0; } }`,
    `@keyframes rain-solid { 0%, ${percent(timing.swapFrom, cycle)} { opacity: 0; } ${percent(timing.swapTo, cycle)}, 100% { opacity: 1; } }`,
    `@keyframes rain-wipe { 0%, ${timing.wipeFrom * 100}% { opacity: 1; } ${timing.wipeTo * 100}%, 100% { opacity: 0; } }`,
    `@keyframes rain-exit { to { transform: translateY(-110vh) rotate(var(--exit-spin)); } }`,
    `@keyframes rain-dots { 0% { content: ''; } 25% { content: '.'; } 50% { content: '..'; } 75% { content: '...'; } }`,
  ].join('\n')
}
