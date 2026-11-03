export type NoteTextSize = 'large' | 'medium' | 'small'

// Plus le texte est long, plus il rapetisse pour tenir sur une note carrée sans être coupé.
export function noteTextSize(text: string): NoteTextSize {
  const length = Array.from(text).length
  if (length <= 40) return 'large'
  if (length <= 70) return 'medium'
  return 'small'
}
