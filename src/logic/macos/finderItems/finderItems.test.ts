import { describe, expect, it } from 'vitest'
import {
  appItem,
  filterItemsByName,
  nextSortOrder,
  nodeItem,
  sortItems,
  type FinderItem,
} from '@/logic/macos/finderItems/finderItems'
import type { FsFolder, FsTextFile } from '@/data/macos'

const kindLabels = { folder: 'Folder', text: 'Plain Text', image: 'JPEG image', pdf: 'PDF document', app: 'Application' }

const projects: FsFolder = { kind: 'folder', id: 'projects', name: 'Projects', date: '2026', children: [] }
const about: FsTextFile = { kind: 'text', id: 'about', name: 'About.txt', date: '2024', content: 'Hello' }
const stack: FsTextFile = { kind: 'text', id: 'stack', name: 'Stack.txt', date: '2025', content: 'React, Node, Django' }

const projectsItem = nodeItem(projects, ['desktop', 'projects'])
const aboutItem = nodeItem(about, ['desktop', 'about'])
const stackItem = nodeItem(stack, ['documents', 'stack'])
const items: FinderItem[] = [stackItem, projectsItem, aboutItem]

const names = (sortedItems: FinderItem[]) => sortedItems.map((item) => item.name)

describe('nodeItem', () => {
  it('reprend le nom, la date, la taille et le chemin du fichier', () => {
    const aboutPath = ['desktop', 'about']

    expect(nodeItem(about, aboutPath)).toMatchObject({
      key: 'desktop/about',
      name: 'About.txt',
      kind: 'text',
      dateAdded: '2024',
      sizeInBytes: 5,
      path: aboutPath,
    })
  })
})

describe('appItem', () => {
  it('nomme une app avec l’extension .app', () => {
    const safariLogo = '/giantsur/images/safari-logo.png'

    expect(appItem('browser', 'Safari', safariLogo, '2026').name).toBe('Safari.app')
  })
})

describe('sortItems', () => {
  it('trie par nom dans l’ordre alphabétique', () => {
    const byName = { column: 'name' as const, isAscending: true }

    expect(names(sortItems(items, byName, kindLabels))).toEqual(['About.txt', 'Projects', 'Stack.txt'])
  })

  it('trie par taille décroissante, dossiers sans taille en dernier', () => {
    const bySizeDescending = { column: 'size' as const, isAscending: false }

    expect(names(sortItems(items, bySizeDescending, kindLabels))).toEqual(['Stack.txt', 'About.txt', 'Projects'])
  })

  it('trie par type puis par nom à égalité', () => {
    const byKind = { column: 'kind' as const, isAscending: true }

    expect(names(sortItems(items, byKind, kindLabels))).toEqual(['Projects', 'About.txt', 'Stack.txt'])
  })

  it('trie par date d’ajout, la plus récente d’abord', () => {
    const byDateDescending = { column: 'dateAdded' as const, isAscending: false }

    expect(names(sortItems(items, byDateDescending, kindLabels))).toEqual(['Projects', 'Stack.txt', 'About.txt'])
  })

  it('ne modifie pas la liste reçue', () => {
    const unsortedItems = [...items]

    sortItems(unsortedItems, { column: 'name', isAscending: true }, kindLabels)

    expect(unsortedItems).toEqual(items)
  })
})

describe('nextSortOrder', () => {
  it('inverse l’ordre quand on reclique sur la colonne triée', () => {
    const byNameAscending = { column: 'name' as const, isAscending: true }

    expect(nextSortOrder(byNameAscending, 'name')).toEqual({ column: 'name', isAscending: false })
  })

  it('commence par la date la plus récente sur la colonne Date d’ajout', () => {
    const byNameAscending = { column: 'name' as const, isAscending: true }

    expect(nextSortOrder(byNameAscending, 'dateAdded')).toEqual({ column: 'dateAdded', isAscending: false })
  })

  it('commence de A à Z sur la colonne Type', () => {
    const bySizeDescending = { column: 'size' as const, isAscending: false }

    expect(nextSortOrder(bySizeDescending, 'kind')).toEqual({ column: 'kind', isAscending: true })
  })
})

describe('filterItemsByName', () => {
  it('garde les éléments dont le nom contient la recherche, sans tenir compte de la casse', () => {
    const query = 'STA'

    expect(names(filterItemsByName(items, query))).toEqual(['Stack.txt'])
  })

  it('ignore les accents', () => {
    const accentedItems = [nodeItem({ ...about, name: 'À propos.txt' }, ['desktop', 'about'])]

    expect(names(filterItemsByName(accentedItems, 'a pro'))).toEqual(['À propos.txt'])
  })

  it('renvoie tout pour une recherche vide', () => {
    const blankQuery = '   '

    expect(filterItemsByName(items, blankQuery)).toBe(items)
  })
})
