import { useState } from 'react'
import { Search, X } from 'lucide-react'

type FinderSearchProps = {
  label: string
  clearLabel: string
  query: string
  onQueryChange: (query: string) => void
  buttonClassName: string
}

// La loupe s'ouvre en champ de recherche, puis se referme quand le champ perd le focus vide ou sur Échap.
export default function FinderSearch({ label, clearLabel, query, onQueryChange, buttonClassName }: FinderSearchProps) {
  const [isOpen, setIsOpen] = useState(false)

  const close = () => {
    onQueryChange('')
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button type="button" aria-label={label} onClick={() => setIsOpen(true)} className={buttonClassName}>
        <Search strokeWidth={1.8} className="size-[17px]" />
      </button>
    )
  }

  return (
    <label className="flex h-[28px] w-[170px] items-center gap-[5px] rounded-[7px] bg-(--macos-finder-field) px-[7px] text-(--macos-finder-tool) ring-[3px] ring-(--macos-finder-focus)">
      <Search strokeWidth={1.8} className="size-[14px] shrink-0" />
      <input
        autoFocus
        type="search"
        aria-label={label}
        placeholder={label}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        onKeyDown={(event) => event.key === 'Escape' && close()}
        onBlur={() => query === '' && setIsOpen(false)}
        // Le contour orange global du site ferait double emploi avec l'anneau bleu macOS du champ.
        style={{ outline: 'none' }}
        className="min-w-0 flex-1 bg-transparent text-[13px] text-(--macos-finder-text) placeholder:text-(--macos-finder-text-muted) [&::-webkit-search-cancel-button]:hidden"
      />
      {query && (
        <button
          type="button"
          aria-label={clearLabel}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onQueryChange('')}
          className="flex size-[14px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-(--macos-finder-text-muted) text-(--macos-finder-window)"
        >
          <X strokeWidth={3} className="size-[9px]" />
        </button>
      )}
    </label>
  )
}
