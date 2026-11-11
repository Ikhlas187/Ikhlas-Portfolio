import type { FsFolder, FsNode } from '@/data/macos'

export function findNode(root: FsFolder, path: string[]): FsNode | null {
  let node: FsNode = root
  for (const id of path) {
    if (node.kind !== 'folder') return null
    const child: FsNode | undefined = node.children.find((item) => item.id === id)
    if (!child) return null
    node = child
  }
  return node
}

// Les dossiers traversés, racine comprise : sert à la barre de chemin du Finder.
export function collectImages(
  node: FsNode,
  path: string[] = [],
): { path: string[]; node: Extract<FsNode, { kind: 'image' }> }[] {
  if (node.kind === 'image') return [{ path, node }]
  if (node.kind !== 'folder') return []
  return node.children.flatMap((child) => collectImages(child, [...path, child.id]))
}
