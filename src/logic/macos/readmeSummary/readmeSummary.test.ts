import { describe, expect, it } from 'vitest'
import { readmeSummary } from '@/logic/macos/readmeSummary/readmeSummary'

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
