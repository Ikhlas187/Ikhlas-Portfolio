// Contrôle d'une note avant de l'épingler pour tous les visiteurs : partagé par le formulaire et par api/notes.ts,
// donc sans import exécuté (la fonction Vercel ne résout pas l'alias @/ ; un import de type disparaît à la compilation).
import type { NoteRejection } from '@/types/note'

export const NOTE_TEXT_LIMIT = 100
export const NOTE_AUTHOR_LIMIT = 30

// Racines bloquées (FR et EN), comparées à la note normalisée : insultes, propos haineux, contenu sexuel.
const BLOCKED_ROOTS = [
  'connard', 'connasse', 'conasse', 'salope', 'salaud', 'pute', 'putain', 'encule', 'enculer', 'batard', 'batar',
  'nique', 'niquer', 'ntm', 'fdp', 'pd', 'pede', 'tapette', 'gouine', 'negre', 'negro', 'bougnoule', 'youpin',
  'bite', 'couille', 'chatte', 'branleur', 'branler', 'suceur', 'suce', 'merde', 'abruti', 'debile', 'mongol',
  'fuck', 'fucker', 'fucking', 'motherfucker', 'shit', 'bitch', 'asshole', 'bastard', 'cunt', 'dick', 'pussy',
  'whore', 'slut', 'nigger', 'nigga', 'faggot', 'fag', 'retard', 'porn', 'porno', 'sex', 'sexe', 'nazi', 'hitler',
]
// Racines assez longues pour être cherchées aussi à l'intérieur des mots collés (« sale_connard », « fuckyou »).
const EMBEDDED_ROOTS = BLOCKED_ROOTS.filter((root) => root.length >= 5)

const LEET: Record<string, string> = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', '$': 's', '!': 'i' }

// Minuscules, sans accents, chiffres et symboles ramenés aux lettres qu'ils imitent, lettres répétées réduites à 1.
export function normalizeForModeration(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[013457@$!]/g, (character) => LEET[character])
    .replace(/(\p{L})\1+/gu, '$1')
}

function hasBlockedWord(text: string) {
  const normalized = normalizeForModeration(text)
  const tokens = normalized.split(/[^\p{L}]+/u).filter(Boolean)
  // Lettres isolées recollées (« p.u.t.e », « f u c k ») : un mot épelé compte comme un mot.
  const spelled = normalized.match(/(?:^|[^\p{L}])(\p{L}(?:[^\p{L}]+\p{L}(?![\p{L}]))+)/gu) ?? []
  const words = [...tokens, ...spelled.map((run) => run.replace(/[^\p{L}]/gu, ''))]
  const roots = new Set(BLOCKED_ROOTS.map((root) => root.replace(/(\p{L})\1+/gu, '$1')))
  if (words.some((word) => roots.has(word) || roots.has(word.replace(/s$/, '')))) return true
  const glued = words.join('')
  return EMBEDDED_ROOTS.some((root) => glued.includes(root.replace(/(\p{L})\1+/gu, '$1')))
}

const LINK = /(https?:\/\/|www\.|\b[\w-]+\.(com|fr|net|org|io|xyz|ru|info|biz|me|ly)\b)/i

export function noteRejection(text: string, author: string): NoteRejection | null {
  const trimmed = text.trim()
  if (trimmed.length === 0) return 'empty'
  if (Array.from(trimmed).length > NOTE_TEXT_LIMIT || Array.from(author.trim()).length > NOTE_AUTHOR_LIMIT) return 'tooLong'
  if (LINK.test(trimmed) || LINK.test(author)) return 'link'
  if (hasBlockedWord(trimmed) || hasBlockedWord(author)) return 'blockedWord'
  return null
}
