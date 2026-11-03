import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, RotateCw, Search, Star } from 'lucide-react'
import { FRAME_ICON_STROKE, FRAME_TOOL, FRAME_TOOLBAR } from '@/components/pages/Home/MacOS/frameClasses'
import { Input } from '@/components/ui/input'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'

type BrowserToolbarProps = {
  address: string
  isLoading: boolean
  isBookmarked: boolean
  canGoBack: boolean
  canGoForward: boolean
  onBack: () => void
  onForward: () => void
  onReload: () => void
  onBookmark: () => void
  onNewTab: () => void
  onSubmitAddress: (address: string) => void
}

// Barre d'outils du Safari de la référence : précédent / suivant, adresse centrée de 468 px, signet, nouvel onglet.
export default function BrowserToolbar({
  address,
  isLoading,
  isBookmarked,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  onReload,
  onBookmark,
  onNewTab,
  onSubmitAddress,
}: BrowserToolbarProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].browser
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState('')

  return (
    <form
      data-window-drag
      className={cn(FRAME_TOOLBAR, 'gap-[3.25px] pl-[84px]')}
      onSubmit={(event) => {
        event.preventDefault()
        if (draft.trim() !== '') onSubmitAddress(draft)
        event.currentTarget.querySelector('input')?.blur()
      }}
    >
      <button type="button" aria-label={texts.back} disabled={!canGoBack} onClick={onBack} className={FRAME_TOOL}>
        <ChevronLeft strokeWidth={FRAME_ICON_STROKE} />
      </button>
      <button
        type="button"
        aria-label={texts.forward}
        disabled={!canGoForward}
        onClick={onForward}
        className={FRAME_TOOL}
      >
        <ChevronRight strokeWidth={FRAME_ICON_STROKE} />
      </button>
      <div className="relative mx-auto flex w-full max-w-[468px] items-center">
        <Search size={13} className="pointer-events-none absolute left-[8.125px] text-(--macos-frame-muted)" />
        <Input
          name="address"
          value={isEditing ? draft : address}
          placeholder={texts.addressPlaceholder}
          aria-label={texts.address}
          autoComplete="off"
          spellCheck={false}
          onFocus={(event) => {
            setDraft(address)
            setIsEditing(true)
            event.currentTarget.select()
          }}
          onBlur={() => {
            setIsEditing(false)
            setDraft('')
          }}
          onChange={(event) => setDraft(event.target.value)}
          // Le contour orange global du site ferait double emploi avec l'anneau bleu macOS du champ.
          style={{ outline: 'none' }}
          className="h-[22.75px] w-full rounded-[8px]! border-0 bg-(--macos-frame-hover)! px-[26px]! py-0! text-center [font-family:inherit]! text-[13px]! text-(--macos-frame-fg)! shadow-none select-text placeholder:text-(--macos-frame-muted)! focus:bg-(--macos-frame-surface)! focus:text-left focus:shadow-[0_0_0_3px_var(--macos-frame-focus)] focus-visible:ring-0"
        />
        <button
          type="button"
          aria-label={texts.reload}
          onClick={onReload}
          className="absolute right-[3.25px] grid size-[19.5px] cursor-pointer place-items-center rounded-[3.25px] text-(--macos-frame-muted) hover:text-(--macos-frame-fg)"
        >
          <RotateCw size={13} className={cn(isLoading && 'motion-safe:animate-spin')} />
        </button>
      </div>
      <button
        type="button"
        aria-label={texts.addBookmark}
        disabled={address === ''}
        onClick={onBookmark}
        className={FRAME_TOOL}
      >
        <Star strokeWidth={FRAME_ICON_STROKE} className={cn(isBookmarked && 'fill-current text-(--macos-frame-star)')} />
      </button>
      <button type="button" aria-label={texts.newTab} onClick={onNewTab} className={FRAME_TOOL}>
        <Plus strokeWidth={FRAME_ICON_STROKE} />
      </button>
    </form>
  )
}
