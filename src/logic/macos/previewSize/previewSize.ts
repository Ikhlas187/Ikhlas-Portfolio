import type { FsNode } from '@/data/macos'
import type { Size } from '@/logic/macos/windowBounds/windowBounds'

export type PreviewNode = Exclude<FsNode, { kind: 'folder' } | { kind: 'code' }>

const PREVIEW_SIZES: Record<PreviewNode['kind'], Size> = {
  text: { width: 600, height: 500 },
  image: { width: 840, height: 600 },
  pdf: { width: 700, height: 800 },
}
// Montre le vrai certificat en entier (680 px de large, proportions A4 paysage ou Make).
const CERTIFICATE_PREVIEW_SIZE: Size = { width: 760, height: 660 }

export function previewSize(node: PreviewNode): Size {
  return node.kind === 'pdf' && node.document.type === 'certificate' ? CERTIFICATE_PREVIEW_SIZE : PREVIEW_SIZES[node.kind]
}
