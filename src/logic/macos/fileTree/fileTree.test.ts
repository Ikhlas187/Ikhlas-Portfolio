import { describe, expect, it } from 'vitest'
import { collectImages, findNode } from '@/logic/macos/fileTree/fileTree'
import type { FsFolder } from '@/data/macos'

const photo = {
  kind: 'image' as const,
  id: 'photo-1',
  name: 'Photo 1.jpg',
  date: '2025',
  photoId: 'abc',
  alt: 'A photo',
}
const readme = { kind: 'text' as const, id: 'readme', name: 'README.txt', date: '2025', content: 'Hello' }
const nevora: FsFolder = { kind: 'folder', id: 'nevora', name: 'NEVORA', date: '2025', children: [readme, photo] }
const projects: FsFolder = { kind: 'folder', id: 'projects', name: 'Projects', date: '2025', children: [nevora] }
const home: FsFolder = { kind: 'folder', id: 'home', name: 'ikhlas', date: '2025', children: [projects] }

describe('findNode', () => {
  it('trouve un fichier par son chemin d’identifiants', () => {
    const readmePath = ['projects', 'nevora', 'readme']

    expect(findNode(home, readmePath)).toBe(readme)
  })

  it('renvoie la racine pour un chemin vide', () => {
    const rootPath: string[] = []

    expect(findNode(home, rootPath)).toBe(home)
  })

  it('renvoie null pour un chemin qui n’existe pas', () => {
    const missingPath = ['projects', 'drip']

    expect(findNode(home, missingPath)).toBeNull()
  })

  it('renvoie null quand le chemin traverse un fichier', () => {
    const throughFile = ['projects', 'nevora', 'readme', 'inside']

    expect(findNode(home, throughFile)).toBeNull()
  })
})

describe('collectImages', () => {
  it('rassemble les images de toute l’arborescence avec leur chemin', () => {
    const tree = home

    expect(collectImages(tree)).toEqual([{ path: ['projects', 'nevora', 'photo-1'], node: photo }])
  })
})
