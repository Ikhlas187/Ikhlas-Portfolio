import type { RepoEntry } from '@/types/repo'

// 1er paragraphe de texte d'un README Markdown, sans titres, badges, images, HTML ni mise en forme ; null s'il n'y en a pas.
const MAX_LENGTH = 420

function cleanLine(line: string) {
  return line
    .replace(/<[^>]+>/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .replace(/\p{Extended_Pictographic}️?/gu, '')
    .trim()
}

export function readmeSummary(markdown: string) {
  const paragraphs = markdown.replace(/```[\s\S]*?```/g, '').split(/\n\s*\n/)
  for (const paragraph of paragraphs) {
    const lines = paragraph
      .split('\n')
      .filter((line) => !/^\s*(#|>|\||-{3,}|={3,}|[-*+]\s|\d+\.\s)/.test(line))
      .map(cleanLine)
      .filter(Boolean)
    const text = lines.join(' ').replace(/\s+/g, ' ').trim()
    if (text.length >= 40) return text.length > MAX_LENGTH ? `${text.slice(0, MAX_LENGTH).replace(/\s+\S*$/, '')}…` : text
  }
  return null
}

// Résumé du README.md à la racine d'un repo, d'après les entrées de son instantané.
export function repoReadmeSummary(entries: RepoEntry[]) {
  const readme = entries.find((entry) => entry.type === 'file' && /^readme\.md$/i.test(entry.path))
  return readme?.type === 'file' && readme.content ? readmeSummary(readme.content) : null
}
