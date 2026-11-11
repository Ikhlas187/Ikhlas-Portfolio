import { describe, expect, it } from 'vitest'
import { fileName, workspaceFor } from '@/logic/macos/vscodeWorkspace/vscodeWorkspace'

describe('workspaceFor', () => {
  it('ouvre le fichier demandé et déplie ses dossiers parents', () => {
    const payload = { repo: 'MediPass', file: 'src/core/main.cpp' }

    const workspace = workspaceFor(payload)

    expect(workspace).toEqual({
      repo: 'MediPass',
      tabs: { paths: ['src/core/main.cpp'], activePath: 'src/core/main.cpp' },
      expanded: new Set(['src', 'src/core']),
    })
  })

  it('part sans onglet ni dossier déplié quand aucun fichier n’est demandé', () => {
    const payload = {}

    const workspace = workspaceFor(payload)

    expect(workspace).toEqual({ repo: null, tabs: { paths: [], activePath: null }, expanded: new Set() })
  })
})

describe('fileName', () => {
  it('garde le nom du fichier sans ses dossiers', () => {
    const paths = ['src/core/main.cpp', 'README.md']

    const names = paths.map(fileName)

    expect(names).toEqual(['main.cpp', 'README.md'])
  })
})
