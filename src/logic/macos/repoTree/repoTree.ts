import type { RepoEntry, RepoOmission } from '@/types/repo'

export type RepoTreeFile = {
  kind: 'file'
  name: string
  path: string
  size: number
  content?: string
  omitted?: RepoOmission
}
export type RepoTreeDir = { kind: 'dir'; name: string; path: string; children: RepoTreeNode[] }
export type RepoTreeNode = RepoTreeDir | RepoTreeFile

function compareNames(left: string, right: string) {
  return left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' })
}

// Comme l'explorateur de VS Code : dossiers d'abord, puis fichiers, chacun de A à Z.
export function compareRepoNodes(left: RepoTreeNode, right: RepoTreeNode) {
  if (left.kind !== right.kind) return left.kind === 'dir' ? -1 : 1
  return compareNames(left.name, right.name)
}

function sortTree(dir: RepoTreeDir): RepoTreeDir {
  const children = dir.children.map((child) => (child.kind === 'dir' ? sortTree(child) : child))
  return { ...dir, children: children.sort(compareRepoNodes) }
}

// Arbre trié à partir de la liste à plat de l'instantané ; un dossier manquant dans la liste est créé à la volée.
export function buildRepoTree(entries: RepoEntry[]): RepoTreeDir {
  const root: RepoTreeDir = { kind: 'dir', name: '', path: '', children: [] }
  const dirs = new Map<string, RepoTreeDir>([['', root]])

  const ensureDir = (path: string): RepoTreeDir => {
    const existing = dirs.get(path)
    if (existing) return existing
    const slash = path.lastIndexOf('/')
    const parent = ensureDir(slash === -1 ? '' : path.slice(0, slash))
    const dir: RepoTreeDir = { kind: 'dir', name: path.slice(slash + 1), path, children: [] }
    parent.children.push(dir)
    dirs.set(path, dir)
    return dir
  }

  for (const entry of entries) {
    if (entry.type === 'dir') {
      ensureDir(entry.path)
      continue
    }
    const slash = entry.path.lastIndexOf('/')
    const parent = ensureDir(slash === -1 ? '' : entry.path.slice(0, slash))
    const file: RepoTreeFile = { kind: 'file', name: entry.path.slice(slash + 1), path: entry.path, size: entry.size }
    if (entry.content !== undefined) file.content = entry.content
    if (entry.omitted) file.omitted = entry.omitted
    parent.children.push(file)
  }

  return sortTree(root)
}

export function findRepoNode(root: RepoTreeDir, path: string): RepoTreeNode | null {
  if (path === '') return root
  let node: RepoTreeNode = root
  for (const segment of path.split('/')) {
    if (node.kind !== 'dir') return null
    const child: RepoTreeNode | undefined = node.children.find((item) => item.name === segment)
    if (!child) return null
    node = child
  }
  return node
}

// Dossiers à déplier pour faire apparaître un fichier dans l'explorateur.
export function ancestorPaths(path: string): string[] {
  const segments = path.split('/').slice(0, -1)
  return segments.map((_, index) => segments.slice(0, index + 1).join('/'))
}
