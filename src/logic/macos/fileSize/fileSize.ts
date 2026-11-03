import type { FsNode } from '@/data/macos'

export type FileSizeUnits = { bytes: string; kb: string; mb: string; decimal: string }

// Les fichiers du faux Mac n'ont pas de poids réel : on en déduit un plausible et stable de leur contenu.
export function fileSizeInBytes(node: FsNode): number | null {
  switch (node.kind) {
    case 'folder':
      return null
    case 'text':
      return new TextEncoder().encode(node.content).length
    case 'image':
      return 400_000 + (charCodeSum(node.photoId) % 40) * 50_000
    case 'pdf':
      return 60_000 + JSON.stringify(node.document).length * 20
  }
}

function charCodeSum(text: string) {
  return [...text].reduce((sum, char) => sum + char.charCodeAt(0), 0)
}

// Unités décimales, comme le Finder : 1 Ko = 1 000 octets ; « -- » pour un dossier.
export function formatFileSize(bytes: number | null, units: FileSizeUnits): string {
  if (bytes === null) return '--'
  if (bytes < 1_000) return `${bytes} ${units.bytes}`
  if (bytes < 1_000_000) return `${Math.round(bytes / 1_000)} ${units.kb}`
  return `${(bytes / 1_000_000).toFixed(1).replace('.', units.decimal)} ${units.mb}`
}
