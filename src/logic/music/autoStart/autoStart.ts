export type AutoStartState = {
  isLoaderRevealed: boolean
  isMutedForSession: boolean
  // Le visiteur a déjà lancé ou coupé la musique lui-même, ou une tentative est en cours.
  hasStartedOrChosen: boolean
}

// Les navigateurs bloquent la lecture automatique : la musique de fond part au 1er geste, une fois le loader fini.
export function shouldStartOnGesture({ isLoaderRevealed, isMutedForSession, hasStartedOrChosen }: AutoStartState) {
  return isLoaderRevealed && !isMutedForSession && !hasStartedOrChosen
}
