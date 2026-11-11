import type { FinderLocation } from '@/data/macos'

export function folderLocation(path: string[]): FinderLocation {
  return { kind: 'folder', path }
}

export function isSameLocation(left: FinderLocation, right: FinderLocation) {
  if (left.kind !== right.kind) return false
  if (left.kind !== 'folder' || right.kind !== 'folder') return true
  return left.path.join('/') === right.path.join('/')
}

// Dossier d'un repo dans <projectsPath>/<repo>/… : son nom, sinon null.
export function repoNameAt(location: FinderLocation, projectsPath: readonly string[]) {
  if (location.kind !== 'folder' || location.path.length <= projectsPath.length) return null
  const isInProjects = projectsPath.every((id, index) => location.path[index] === id)
  return isInProjects ? location.path[projectsPath.length] : null
}
