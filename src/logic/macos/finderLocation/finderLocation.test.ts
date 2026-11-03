import { describe, expect, it } from 'vitest'
import { folderLocation, isSameLocation } from '@/logic/macos/finderLocation/finderLocation'
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
