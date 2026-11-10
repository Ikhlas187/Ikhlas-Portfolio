import { describe, expect, it } from 'vitest'
import { readmeSummary, repoReadmeSummary } from '@/logic/macos/readmeSummary/readmeSummary'
import type { RepoEntry } from '@/types/repo'

describe('readmeSummary', () => {
  it('saute titres, badges et listes pour garder le 1er vrai paragraphe, sans mise en forme', () => {
    const markdown = [
      '# 🚀 Digital Minds',
      '',
      '![badge](https://img.shields.io/x.svg)',
      '',
      '## 📌 Description',
      '',
      'Digital Minds est une **application** visant à faciliter l’accès des étudiants aux [documents](https://x.dev).',
      '',
      '- React',
    ].join('\n')

    const summary = readmeSummary(markdown)

    expect(summary).toBe('Digital Minds est une application visant à faciliter l’accès des étudiants aux documents.')
  })

  it('coupe un paragraphe trop long à la fin d’un mot', () => {
    const markdown = 'mot '.repeat(200)

    const summary = readmeSummary(markdown)

    expect(summary?.endsWith('mot…')).toBe(true)
  })

  it('rend null sans paragraphe de texte', () => {
    const markdown = '# Titre\n\n- un\n- deux'

    const summary = readmeSummary(markdown)

    expect(summary).toBeNull()
  })
})

describe('repoReadmeSummary', () => {
  it('lit le README.md de la racine, pas celui d’un sous-dossier', () => {
    const entries: RepoEntry[] = [
      { path: 'frontend/README.md', type: 'file', size: 10, content: 'Un README de sous-dossier qui ne doit pas servir.' },
      { path: 'README.md', type: 'file', size: 10, content: 'Gestionnaire de tâches en C++ avec Qt et SQLite.' },
    ]

    const summary = repoReadmeSummary(entries)

    expect(summary).toBe('Gestionnaire de tâches en C++ avec Qt et SQLite.')
  })

  it('rend null sans README', () => {
    const entries: RepoEntry[] = [{ path: 'src', type: 'dir' }]

    const summary = repoReadmeSummary(entries)

    expect(summary).toBeNull()
  })
})
