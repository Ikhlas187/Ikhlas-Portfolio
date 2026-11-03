import { describe, expect, it } from 'vitest'
import { NO_EDITOR_TABS, closeEditorTab, openEditorTab, type EditorTabs } from '@/logic/macos/editorTabs/editorTabs'

const threeTabs: EditorTabs = { paths: ['a.ts', 'b.ts', 'c.ts'], activePath: 'b.ts' }

describe('openEditorTab', () => {
  it('ouvre un premier onglet et l’active', () => {
    const path = 'src/App.tsx'

    expect(openEditorTab(NO_EDITOR_TABS, path)).toEqual({ paths: ['src/App.tsx'], activePath: 'src/App.tsx' })
  })

  it('insère un nouvel onglet juste après l’onglet actif', () => {
    const path = 'new.ts'

    expect(openEditorTab(threeTabs, path)).toEqual({ paths: ['a.ts', 'b.ts', 'new.ts', 'c.ts'], activePath: 'new.ts' })
  })

  it('réactive un fichier déjà ouvert sans le dupliquer', () => {
    const alreadyOpen = 'c.ts'

    expect(openEditorTab(threeTabs, alreadyOpen)).toEqual({ paths: ['a.ts', 'b.ts', 'c.ts'], activePath: 'c.ts' })
  })

  it('ne modifie pas les onglets reçus', () => {
    const tabs: EditorTabs = { paths: ['a.ts'], activePath: 'a.ts' }

    openEditorTab(tabs, 'b.ts')

    expect(tabs).toEqual({ paths: ['a.ts'], activePath: 'a.ts' })
  })
})

describe('closeEditorTab', () => {
  it('active le voisin de droite quand on ferme l’onglet actif', () => {
    const activePath = 'b.ts'

    expect(closeEditorTab(threeTabs, activePath)).toEqual({ paths: ['a.ts', 'c.ts'], activePath: 'c.ts' })
  })

  it('active le voisin de gauche quand l’onglet actif fermé était le dernier', () => {
    const tabs: EditorTabs = { paths: ['a.ts', 'b.ts'], activePath: 'b.ts' }

    expect(closeEditorTab(tabs, 'b.ts')).toEqual({ paths: ['a.ts'], activePath: 'a.ts' })
  })

  it('garde l’onglet actif quand on en ferme un autre', () => {
    const otherPath = 'a.ts'

    expect(closeEditorTab(threeTabs, otherPath)).toEqual({ paths: ['b.ts', 'c.ts'], activePath: 'b.ts' })
  })

  it('ne laisse aucun onglet actif après la fermeture du dernier', () => {
    const singleTab: EditorTabs = { paths: ['a.ts'], activePath: 'a.ts' }

    expect(closeEditorTab(singleTab, 'a.ts')).toEqual(NO_EDITOR_TABS)
  })
})
