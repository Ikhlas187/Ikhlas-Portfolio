// Écran d'un programme en console : lignes terminées, plus la ligne en cours (une invite comme « Choix: » sans retour).
export type TerminalScreen = { lines: string[]; partial: string }

export const EMPTY_SCREEN: TerminalScreen = { lines: [], partial: '' }

export function writeOutput(screen: TerminalScreen, text: string): TerminalScreen {
  const parts = (screen.partial + text).replace(/\r\n?/g, '\n').split('\n')
  const partial = parts.pop() ?? ''
  return { lines: [...screen.lines, ...parts], partial }
}

// La saisie du visiteur termine la ligne de l'invite, comme l'écho d'un vrai terminal.
export function commitInput(screen: TerminalScreen, input: string): TerminalScreen {
  return { lines: [...screen.lines, screen.partial + input], partial: '' }
}
