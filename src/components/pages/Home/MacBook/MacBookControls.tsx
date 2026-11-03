import { PowerIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MACBOOK } from '@/data/macbook'
import { useLocale } from '@/lib/LocaleProvider'

type MacBookControlsProps = {
  isPoweredOn: boolean
  onTogglePower: () => void
}

const PILL = 'h-9 rounded-full border-white/20 bg-black/70 px-4 text-white backdrop-blur hover:bg-white hover:text-black'

export default function MacBookControls({ isPoweredOn, onTogglePower }: MacBookControlsProps) {
  const { locale } = useLocale()
  const text = MACBOOK[locale]

  return (
    <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2">
      <Button variant="outline" className={PILL} onClick={onTogglePower}>
        <PowerIcon />
        {isPoweredOn ? text.shutDown : text.powerOn}
      </Button>
    </div>
  )
}
