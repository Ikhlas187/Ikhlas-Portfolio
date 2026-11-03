import { useState, type MouseEvent } from 'react'
import DesktopItem from '@/components/pages/Home/MacOS/DesktopItem'
import { useMacFiles } from '@/components/pages/Home/MacOS/useMacFiles'
import { DESKTOP_PATH } from '@/data/macos'
import { findNode } from '@/logic/macos/fileTree/fileTree'
import { nodeItem } from '@/logic/macos/finderItems/finderItems'

type DesktopIconsProps = {
  onClickDesktop: () => void
  onOpen: (path: string[]) => void
}

// Colonne d'icônes du bureau, tirée du dossier Bureau du Finder : un clic sélectionne, un double-clic ouvre.
export default function DesktopIcons({ onClickDesktop, onOpen }: DesktopIconsProps) {
  const desktop = findNode(useMacFiles(), DESKTOP_PATH)
  const items = desktop?.kind === 'folder' ? desktop.children.map((node) => nodeItem(node, [...DESKTOP_PATH, node.id])) : []
  const [focusedItemKey, setFocusedItemKey] = useState('')

  const handleClickItem = (event: MouseEvent<HTMLElement>, itemKey: string) => {
    event.stopPropagation()
    setFocusedItemKey(itemKey)
    onClickDesktop()
  }

  const handleClickAround = () => {
    setFocusedItemKey('')
    onClickDesktop()
  }

  return (
    <div className="absolute top-0 left-0 flex size-full flex-col items-end pt-8" onClick={handleClickAround}>
      {items.map((item) => (
        <DesktopItem
          key={item.key}
          item={item}
          isSelected={focusedItemKey === item.key}
          onClick={(event) => handleClickItem(event, item.key)}
          onOpen={() => onOpen(item.path)}
        />
      ))}
    </div>
  )
}
