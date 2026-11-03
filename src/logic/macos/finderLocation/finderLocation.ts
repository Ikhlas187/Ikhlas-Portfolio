import type { FinderLocation } from '@/data/macos'

export function folderLocation(path: string[]): FinderLocation {
  return { kind: 'folder', path }
}

export function isSameLocation(left: FinderLocation, right: FinderLocation) {
  if (left.kind !== right.kind) return false
  if (left.kind !== 'folder' || right.kind !== 'folder') return true
  return left.path.join('/') === right.path.join('/')
}
