import { describe, expect, it } from 'vitest'
import type { AboutSegment } from '@/data/about'
import { segmentText } from '@/logic/macos/aboutSegment/aboutSegment'

describe('segmentText', () => {
  it('rend le texte de chaque sorte de morceau', () => {
    const segments: AboutSegment[] = ['plain', { highlight: 'bold' }, { link: 'Efrei', href: 'https://efrei.fr' }, { quote: 'cited' }]

    const texts = segments.map(segmentText)

    expect(texts).toEqual(['plain', 'bold', 'Efrei', 'cited'])
  })
})
