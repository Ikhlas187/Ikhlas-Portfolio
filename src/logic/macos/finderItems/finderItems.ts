import type { DockApp } from '@/data/giantSur'
import type { FsNode } from '@/data/macos'
import { fileSizeInBytes } from '@/logic/macos/fileSize/fileSize'

export type FinderItemKind = FsNode['kind'] | 'app'

type FinderItemBase = { key: string; name: string; sizeInBytes: number | null; dateAdded: string }

export type FinderNodeItem = FinderItemBase & { kind: FsNode['kind']; node: FsNode; path: string[] }
export type FinderAppItem = FinderItemBase & { kind: 'app'; app: DockApp; logo: string }
export type FinderItem = FinderNodeItem | FinderAppItem

export type SortColumn = 'name' | 'size' | 'kind' | 'dateAdded'
export type SortOrder = { column: SortColumn; isAscending: boolean }

export const DEFAULT_SORT_ORDER: SortOrder = { column: 'name', isAscending: true }

export function nodeItem(node: FsNode, path: string[]): FinderNodeItem {
  return {
    key: path.join('/'),
    name: node.name,
    kind: node.kind,
    sizeInBytes: fileSizeInBytes(node),
    dateAdded: node.date,
    node,
    path,
  }
}

export function appItem(app: DockApp, title: string, logo: string, dateAdded: string): FinderAppItem {
  return { key: `app:${app}`, name: `${title}.app`, kind: 'app', sizeInBytes: null, dateAdded, app, logo }
}

function compareNames(left: FinderItem, right: FinderItem) {
  return left.name.localeCompare(right.name, undefined, { numeric: true, sensitivity: 'base' })
}

// À égalité sur la colonne triée, le nom départage toujours dans l'ordre alphabétique.
export function sortItems(items: FinderItem[], order: SortOrder, kindLabels: Record<FinderItemKind, string>) {
  const compareColumn = (left: FinderItem, right: FinderItem) => {
    switch (order.column) {
      case 'name':
        return compareNames(left, right)
      case 'size':
        return (left.sizeInBytes ?? -1) - (right.sizeInBytes ?? -1)
      case 'kind':
        return kindLabels[left.kind].localeCompare(kindLabels[right.kind])
      case 'dateAdded':
        return left.dateAdded.localeCompare(right.dateAdded)
    }
  }
  return [...items].sort((left, right) => {
    const byColumn = compareColumn(left, right)
    if (byColumn !== 0) return order.isAscending ? byColumn : -byColumn
    return compareNames(left, right)
  })
}

// Comme le Finder : taille et date partent du plus grand, nom et type de A à Z.
export function nextSortOrder(order: SortOrder, column: SortColumn): SortOrder {
  if (order.column === column) return { column, isAscending: !order.isAscending }
  return { column, isAscending: column === 'name' || column === 'kind' }
}

function searchable(text: string) {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase()
}

// Sous-chaîne du nom, sans tenir compte de la casse ni des accents.
export function filterItemsByName(items: FinderItem[], query: string) {
  const needle = searchable(query.trim())
  if (!needle) return items
  return items.filter((item) => searchable(item.name).includes(needle))
}
