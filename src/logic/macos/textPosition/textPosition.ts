export type TextPosition = { line: number; column: number }

// Ligne et colonne (à partir de 1) du caractère à l'indice offset, comme la barre d'état de VS Code.
export function textPositionAt(text: string, offset: number): TextPosition {
  const clamped = Math.max(0, Math.min(offset, text.length))
  const before = text.slice(0, clamped)
  const lastBreak = before.lastIndexOf('\n')
  return { line: before.split('\n').length, column: clamped - lastBreak }
}

export function lineCount(text: string): number {
  return text.split('\n').length
}
