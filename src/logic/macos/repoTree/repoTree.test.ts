import { describe, expect, it } from 'vitest'
import { ancestorPaths, buildRepoTree, findRepoNode } from '@/logic/macos/repoTree/repoTree'
import type { RepoEntry } from '@/types/repo'

const entries: RepoEntry[] = [
  { path: 'README.md', type: 'file', size: 12, content: '# Kommit' },
  { path: 'src', type: 'dir' },
  { path: 'src/index.ts', type: 'file', size: 20, content: 'export {}' },
  { path: 'src/App.tsx', type: 'file', size: 30, content: 'App' },
  { path: 'src/components', type: 'dir' },
  { path: 'public/logo.png', type: 'file', size: 4000, omitted: 'binary' },
  { path: '.gitignore', type: 'file', size: 5, content: 'node_modules' },
]

describe('buildRepoTree', () => {
  it('range les dossiers avant les fichiers, chacun de A à Z sans tenir compte de la casse', () => {
    const tree = buildRepoTree(entries)

    expect(tree.children.map((node) => node.name)).toEqual(['public', 'src', '.gitignore', 'README.md'])
  })

  it('trie aussi l’intérieur des sous-dossiers', () => {
    const tree = buildRepoTree(entries)

    const src = findRepoNode(tree, 'src')

    expect(src?.kind === 'dir' && src.children.map((node) => node.name)).toEqual(['components', 'App.tsx', 'index.ts'])
  })

  it('crée un dossier absent de la liste à partir du chemin de son fichier', () => {
    const tree = buildRepoTree(entries)

    const publicDir = findRepoNode(tree, 'public')

    expect(publicDir?.kind === 'dir' && publicDir.path).toBe('public')
  })

  it('garde le contenu d’un fichier de code et le motif d’un fichier publié sans contenu', () => {
    const tree = buildRepoTree(entries)

    expect([findRepoNode(tree, 'src/index.ts'), findRepoNode(tree, 'public/logo.png')]).toEqual([
      { kind: 'file', name: 'index.ts', path: 'src/index.ts', size: 20, content: 'export {}' },
      { kind: 'file', name: 'logo.png', path: 'public/logo.png', size: 4000, omitted: 'binary' },
    ])
  })

  it('rend un arbre vide pour un repo sans fichier', () => {
    const emptyEntries: RepoEntry[] = []

    expect(buildRepoTree(emptyEntries)).toEqual({ kind: 'dir', name: '', path: '', children: [] })
  })
})

describe('findRepoNode', () => {
  it('rend null pour un chemin qui n’existe pas ou qui traverse un fichier', () => {
    const tree = buildRepoTree(entries)

    expect([findRepoNode(tree, 'src/missing.ts'), findRepoNode(tree, 'README.md/child')]).toEqual([null, null])
  })

  it('rend la racine pour un chemin vide', () => {
    const tree = buildRepoTree(entries)

    expect(findRepoNode(tree, '')).toBe(tree)
  })
})

describe('ancestorPaths', () => {
  it('liste les dossiers parents d’un fichier, du plus haut au plus proche', () => {
    const filePath = 'src/components/ui/Button.tsx'

    expect(ancestorPaths(filePath)).toEqual(['src', 'src/components', 'src/components/ui'])
  })

  it('ne rend rien pour un fichier à la racine', () => {
    const rootFile = 'README.md'

    expect(ancestorPaths(rootFile)).toEqual([])
  })
})
