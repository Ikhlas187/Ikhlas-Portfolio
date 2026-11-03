import { useState, type MouseEvent } from 'react'
import { useLocale } from '@/lib/LocaleProvider'
import { GIANT_SUR, type DesktopTarget } from '@/data/giantSur'
import DesktopItem from '@/components/pages/Home/MacOS/DesktopItem'

type DesktopIconsProps = {
  onClickDesktop: () => void
  onOpen: (target: DesktopTarget) => void
}

// Colonne d'icônes de Giant Sur : un clic sélectionne, un double-clic ouvre.
export default function DesktopIcons({ onClickDesktop, onOpen }: DesktopIconsProps) {
  const { locale } = useLocale()
  const { desktopItems, desktopIconAlt } = GIANT_SUR[locale]
  const [focusedItemId, setFocusedItemId] = useState('')

  const handleClickItem = (event: MouseEvent<HTMLElement>, itemId: string) => {
    event.stopPropagation()
    setFocusedItemId(itemId)
    onClickDesktop()
  }

  const handleClickAround = () => {
    setFocusedItemId('')
    onClickDesktop()
  }

  return (
    <div className="absolute top-0 left-0 flex size-full flex-col items-end pt-8" onClick={handleClickAround}>
      {desktopItems.map((item) => (
        <DesktopItem
          key={item.id}
          title={item.title}
          icon={item.icon}
          iconAlt={desktopIconAlt}
          isSelected={focusedItemId === item.id}
          onClick={(event) => handleClickItem(event, item.id)}
          onOpen={() => onOpen(item.target)}
        />
      ))}
    </div>
  )
}
