type ScrollStep = {
  previousScrollY: number
  scrollY: number
  isHidden: boolean
  // Remontée cumulée depuis le dernier mouvement vers le bas, et remontée exigée avant de réafficher (0 = tout de suite).
  upwardTravel?: number
  revealDistance?: number
}

export function shouldHideHeader({ previousScrollY, scrollY, isHidden, upwardTravel = 0, revealDistance = 0 }: ScrollStep) {
  if (scrollY <= 0) return false
  if (scrollY > previousScrollY) return true
  if (scrollY < previousScrollY) return upwardTravel >= revealDistance ? false : isHidden
  return isHidden
}

// Remontée cumulée : grandit en remontant, repart de 0 dès qu'on redescend.
export function nextUpwardTravel(upwardTravel: number, previousScrollY: number, scrollY: number) {
  if (scrollY > previousScrollY) return 0
  return upwardTravel + (previousScrollY - scrollY)
}
