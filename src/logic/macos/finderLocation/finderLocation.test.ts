import { describe, expect, it } from 'vitest'
import { folderLocation, isSameLocation, repoNameAt } from '@/logic/macos/finderLocation/finderLocation'
import type { FinderLocation } from '@/data/macos'

describe('isSameLocation', () => {
  it('compare 2 dossiers par leur chemin', () => {
    const desktop = folderLocation(['desktop'])
    const otherDesktop = folderLocation(['desktop'])

    expect(isSameLocation(desktop, otherDesktop)).toBe(true)
  })

  it('distingue 2 dossiers différents', () => {
    const desktop = folderLocation(['desktop'])
    const projects = folderLocation(['desktop', 'projects'])

    expect(isSameLocation(desktop, projects)).toBe(false)
  })

  it('reconnaît un emplacement virtuel identique', () => {
    const recents: FinderLocation = { kind: 'recents' }
    const otherRecents: FinderLocation = { kind: 'recents' }

    expect(isSameLocation(recents, otherRecents)).toBe(true)
  })

  it('distingue un emplacement virtuel d’un dossier', () => {
    const applications: FinderLocation = { kind: 'applications' }
    const root = folderLocation([])

    expect(isSameLocation(applications, root)).toBe(false)
  })
})

describe('repoNameAt', () => {
  const projectsPath = ['desktop', 'projects']

  it('donne le nom du repo pour son dossier et ses sous-dossiers', () => {
    const locations = [folderLocation(['desktop', 'projects', 'MediPass']), folderLocation(['desktop', 'projects', 'MediPass', 'src'])]

    const repoNames = locations.map((location) => repoNameAt(location, projectsPath))

    expect(repoNames).toEqual(['MediPass', 'MediPass'])
  })

  it('rend null hors du dossier Projets ou sur le dossier Projets lui-même', () => {
    const locations = [folderLocation(['desktop', 'projects']), folderLocation(['documents', 'about']), { kind: 'recents' as const }]

    const repoNames = locations.map((location) => repoNameAt(location, projectsPath))

    expect(repoNames).toEqual([null, null, null])
  })
})
