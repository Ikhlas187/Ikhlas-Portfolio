import { ExternalLink } from 'lucide-react'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'

type BrowserFrameNoticeProps = { externalUrl: string }

// Bandeau au-dessus de l'iframe : la page réelle s'ouvre dans un vrai onglet du navigateur du visiteur.
export default function BrowserFrameNotice({ externalUrl }: BrowserFrameNoticeProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].browser

  return (
    <p className="flex shrink-0 items-center justify-center gap-[6.5px] bg-(--macos-frame-hover) py-[3.25px] text-[11px] text-(--macos-frame-muted)">
      {texts.frameNotice}
      <a
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex cursor-pointer items-center gap-[3.25px] font-medium text-(--macos-frame-accent) hover:underline"
      >
        {texts.openInNewTab} <ExternalLink size={11} />
      </a>
    </p>
  )
}
