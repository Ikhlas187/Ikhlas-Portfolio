import {
  Atom,
  Braces,
  File,
  FileArchive,
  FileCode,
  FileCode2,
  FileImage,
  FileText,
  FileVideo,
  Hash,
  Info,
  Settings,
  Type,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { fileIconKind, type FileIconKind } from '@/logic/macos/codeLanguage/codeLanguage'

type VSCodeFileIconProps = { path: string; className?: string }

// Lucide à la place des icônes Seti de VS Code, mêmes couleurs par famille de fichier.
const ICONS: Record<FileIconKind, { Icon: LucideIcon; color: string }> = {
  react: { Icon: Atom, color: 'text-(--macos-vscode-icon-react)' },
  typescript: { Icon: FileCode, color: 'text-(--macos-vscode-icon-typescript)' },
  script: { Icon: FileCode, color: 'text-(--macos-vscode-icon-script)' },
  markup: { Icon: FileCode2, color: 'text-(--macos-vscode-icon-markup)' },
  style: { Icon: Hash, color: 'text-(--macos-vscode-icon-style)' },
  json: { Icon: Braces, color: 'text-(--macos-vscode-icon-json)' },
  markdown: { Icon: Info, color: 'text-(--macos-vscode-icon-markdown)' },
  code: { Icon: FileCode2, color: 'text-(--macos-vscode-icon-code)' },
  config: { Icon: Settings, color: 'text-(--macos-vscode-icon-config)' },
  image: { Icon: FileImage, color: 'text-(--macos-vscode-icon-image)' },
  media: { Icon: FileVideo, color: 'text-(--macos-vscode-icon-image)' },
  font: { Icon: Type, color: 'text-(--macos-vscode-icon-markup)' },
  archive: { Icon: FileArchive, color: 'text-(--macos-vscode-icon-binary)' },
  pdf: { Icon: FileText, color: 'text-(--macos-vscode-syntax-regexp)' },
  text: { Icon: File, color: 'text-(--macos-vscode-icon-config)' },
}

export default function VSCodeFileIcon({ path, className }: VSCodeFileIconProps) {
  const { Icon, color } = ICONS[fileIconKind(path)]
  return <Icon aria-hidden="true" strokeWidth={2} className={cn('size-[14px] shrink-0', color, className)} />
}
