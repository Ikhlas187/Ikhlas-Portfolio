import { useState } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink, House, Lock, RotateCw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'

type BrowserToolbarProps = {
  address: string
  isLoading: boolean
  // Adresse réelle de la page, à ouvrir dans un onglet du navigateur du visiteur.
  externalUrl?: string
  canGoBack: boolean
  canGoForward: boolean
  onBack: () => void
  onForward: () => void
  onReload: () => void
  onHome: () => void
  onSubmitAddress: (address: string) => void
}

const TOOL_BUTTON =
  'flex size-[28px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-(--macos-finder-tool) hover:bg-(--macos-finder-hover) disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent'

export default function BrowserToolbar({
  address,
  isLoading,
  externalUrl,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  onReload,
  onHome,
  onSubmitAddress,
}: BrowserToolbarProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].browser
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState('')

  return (
    <div className="flex min-w-0 flex-1 items-center gap-[2px] pl-[10px]">
      <button type="button" aria-label={texts.back} disabled={!canGoBack} onClick={onBack} className={TOOL_BUTTON}>
        <ChevronLeft strokeWidth={1.8} className="size-[20px]" />
      </button>
      <button
        type="button"
        aria-label={texts.forward}
        disabled={!canGoForward}
        onClick={onForward}
        className={TOOL_BUTTON}
      >
        <ChevronRight strokeWidth={1.8} className="size-[20px]" />
      </button>
      <button type="button" aria-label={texts.reload} onClick={onReload} className={TOOL_BUTTON}>
        <RotateCw strokeWidth={1.8} className={cn('size-[15px]', isLoading && 'motion-safe:animate-spin')} />
      </button>
      <form
        className="mx-[12px] flex h-[30px] min-w-0 flex-1 items-center gap-[7px] rounded-[8px] bg-(--macos-finder-field) px-[10px] text-(--macos-finder-tool) focus-within:ring-[3px] focus-within:ring-(--macos-finder-focus)"
        onSubmit={(event) => {
          event.preventDefault()
          if (draft.trim() === '') return
          onSubmitAddress(draft)
          event.currentTarget.querySelector('input')?.blur()
        }}
      >
        <Lock strokeWidth={1.8} className="size-[12px] shrink-0" />
        <Input
          name="address"
          value={isEditing ? draft : address}
          placeholder={texts.addressPlaceholder}
          aria-label={texts.addressPlaceholder}
          autoComplete="off"
          spellCheck={false}
          onFocus={() => {
            setDraft(address)
            setIsEditing(true)
          }}
          onBlur={() => {
            setIsEditing(false)
            setDraft('')
          }}
          onChange={(event) => setDraft(event.target.value)}
          // Le contour orange global du site ferait double emploi avec l'anneau bleu macOS du champ.
          style={{ outline: 'none' }}
          className="h-full rounded-none px-0 py-0 [font-family:inherit] text-[13px] text-(--macos-finder-text) shadow-none select-text placeholder:text-(--macos-finder-text-muted) focus-visible:ring-0"
        />
      </form>
      <button type="button" aria-label={texts.home} title={texts.home} onClick={onHome} className={TOOL_BUTTON}>
        <House strokeWidth={1.8} className="size-[16px]" />
      </button>
      {externalUrl && (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={texts.openInNewTab}
          title={texts.openInNewTab}
          className={TOOL_BUTTON}
        >
          <ExternalLink strokeWidth={1.8} className="size-[16px]" />
        </a>
      )}
    </div>
  )
}
