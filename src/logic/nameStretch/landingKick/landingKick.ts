// Rebond d'arrivée : poussée alternée d'une lettre à l'autre, un peu irrégulière ; les espaces ne bougent pas.
export function landingKick(chars: string[], amount: number) {
  return chars.map((char, index) => (char === ' ' ? 0 : (index % 2 === 0 ? 1 : -1) * amount * (0.7 + 0.3 * Math.cos(index))))
}
