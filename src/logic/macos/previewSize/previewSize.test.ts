import { describe, expect, it } from 'vitest'
import type { PdfDocument } from '@/data/macos'
import { previewSize, type PreviewNode } from '@/logic/macos/previewSize/previewSize'

const base = { id: 'file', name: 'file', date: '2026' }

describe('previewSize', () => {
  it("donne la taille de fenêtre propre au type de fichier", () => {
    const textFile: PreviewNode = { ...base, kind: 'text', content: '' }
    const cvFile: PreviewNode = { ...base, kind: 'pdf', document: { type: 'cv' } as PdfDocument }

    const sizes = [textFile, cvFile].map(previewSize)

    expect(sizes).toEqual([
      { width: 600, height: 500 },
      { width: 700, height: 800 },
    ])
  })

  it('agrandit la fenêtre pour montrer un certificat en entier', () => {
    const certificate: PreviewNode = { ...base, kind: 'pdf', document: { type: 'certificate' } as PdfDocument }

    expect(previewSize(certificate)).toEqual({ width: 760, height: 660 })
  })
})
