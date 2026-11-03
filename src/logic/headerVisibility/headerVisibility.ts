type ScrollStep = {
  previousScrollY: number
  scrollY: number
  isHidden: boolean
}

export function shouldHideHeader({ previousScrollY, scrollY, isHidden }: ScrollStep) {
  if (scrollY <= 0) return false
  if (scrollY > previousScrollY) return true
  if (scrollY < previousScrollY) return false
  return isHidden
}
