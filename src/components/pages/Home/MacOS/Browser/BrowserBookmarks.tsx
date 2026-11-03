import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'

type BrowserBookmarksProps = { bookmarks: { address: string; title: string }[]; onOpen: (address: string) => void }

export default function BrowserBookmarks({ bookmarks, onOpen }: BrowserBookmarksProps) {
  const { locale } = useLocale()

  return (
    <nav
      aria-label={MACOS[locale].browser.bookmarks}
      className="flex h-[19.5px] shrink-0 items-center gap-[13px] border-b border-(--macos-frame-line) px-[13px] text-[9.75px]"
    >
      {bookmarks.map((bookmark) => (
        <button
          key={bookmark.address}
          type="button"
          onClick={() => onOpen(bookmark.address)}
          className="cursor-pointer truncate text-(--macos-frame-muted) hover:text-(--macos-frame-fg)"
        >
          {bookmark.title}
        </button>
      ))}
    </nav>
  )
}
