import { LoaderCircle } from 'lucide-react'
import type { LoadStatus } from '@/components/pages/Home/MacOS/MacReposProvider'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'

type FinderStatusProps = { status: Exclude<LoadStatus, 'ready'>; onRetry: () => void }

// Dossier dont le contenu arrive du réseau (repos GitHub) : chargement, ou échec avec nouvel essai.
export default function FinderStatus({ status, onRetry }: FinderStatusProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].repos

  return (
    <div role="status" className="flex h-full flex-col items-center justify-center gap-[10px] text-[13px] text-(--macos-finder-text-muted)">
      {status === 'loading' ? (
        <>
          <LoaderCircle strokeWidth={2} className="size-[20px] animate-spin" />
          <p>{texts.loading}</p>
        </>
      ) : (
        <>
          <p>{texts.loadError}</p>
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-[6px] bg-(--macos-finder-hover) px-[10px] py-[3px] text-(--macos-finder-text) hover:bg-(--macos-finder-pressed)"
          >
            {texts.retry}
          </button>
        </>
      )}
    </div>
  )
}
