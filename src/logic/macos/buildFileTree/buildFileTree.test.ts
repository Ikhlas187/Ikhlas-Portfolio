import { describe, expect, it } from 'vitest'
import type { MacFileTexts } from '@/data/macos'
import { buildFileTree, type FileTreeSources } from '@/logic/macos/buildFileTree/buildFileTree'
import { findNode } from '@/logic/macos/fileTree/fileTree'

const texts: MacFileTexts = {
  folders: {
    home: 'ikhlas',
    desktop: 'Desktop',
    documents: 'Documents',
    downloads: 'Downloads',
    projects: 'Projects',
    skills: 'Skills',
    trash: 'Trash',
  },
  about: { name: 'About.txt', lines: ['Ikhlas Agbeti', 'Software Engineer'] },
  readme: 'README.txt',
  photo: 'Photo',
  stack: { name: 'Stack.txt', heading: 'Tools' },
  downloadedPhoto: { name: 'code.jpg', alt: 'Code', photoId: 'code-id' },
  cv: { name: 'CV.pdf', title: 'Ikhlas Agbeti', subtitle: 'Software Engineer', sections: [] },
}

const sources: FileTreeSources = {
  texts,
  projects: [
    {
      name: 'NEVORA',
      eyebrow: 'Brand',
      description: 'A project',
      date: '2025',
      photos: [
        { id: 'a', alt: 'First' },
        { id: 'b', alt: 'Second' },
      ],
    },
  ],
  roles: [
    { id: 'front', name: 'Frontend', stack: ['React', 'TypeScript'] },
    { id: 'back', name: 'Backend', stack: ['Node', 'React'] },
  ],
  dateLabel: 'Date',
  year: '2026',
}

describe('buildFileTree', () => {
  it('range chaque projet dans Bureau/Projets avec son README et ses photos', () => {
    const tree = buildFileTree(sources)

    const nevora = findNode(tree, ['desktop', 'projects', 'nevora'])

    expect(nevora?.kind === 'folder' && nevora.children.map((node) => node.name)).toEqual([
      'README.txt',
      'Photo 1.jpg',
      'Photo 2.jpg',
    ])
  })

  it('écrit le README à partir du nom, de l’accroche, de la date et de la description', () => {
    const tree = buildFileTree(sources)

    const readme = findNode(tree, ['desktop', 'projects', 'nevora', 'readme'])

    expect(readme?.kind === 'text' && readme.content).toBe('NEVORA\nBrand\nDate 2025\n\nA project')
  })

  it('liste chaque outil une seule fois dans Stack.txt', () => {
    const tree = buildFileTree(sources)

    const stack = findNode(tree, ['documents', 'stack'])

    expect(stack?.kind === 'text' && stack.content).toBe('Tools\n\n· React\n· TypeScript\n· Node')
  })

  it('joint les lignes de la présentation dans About.txt', () => {
    const tree = buildFileTree(sources)

    const about = findNode(tree, ['desktop', 'about'])

    expect(about?.kind === 'text' && about.content).toBe('Ikhlas Agbeti\nSoftware Engineer')
  })

  it('ne modifie pas les sources reçues', () => {
    const snapshot = structuredClone(sources)

    buildFileTree(sources)

    expect(sources).toEqual(snapshot)
  })
})
