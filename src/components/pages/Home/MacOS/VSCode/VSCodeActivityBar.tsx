import { Blocks, CircleUserRound, Files, GitBranch, Play, Search, Settings } from 'lucide-react'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'

const ITEM = 'relative grid h-[48px] w-full place-items-center text-(--macos-vscode-icon) [&_svg]:size-[24px]'

// Barre d'activité de gauche ; seul l'explorateur est actif, les autres vues sont décoratives.
export default function VSCodeActivityBar() {
  const { locale } = useLocale()
  const texts = MACOS[locale].vscode.activity
  const decorative = [
    { label: texts.search, Icon: Search },
    { label: texts.sourceControl, Icon: GitBranch },
    { label: texts.run, Icon: Play },
    { label: texts.extensions, Icon: Blocks },
  ]

  return (
    <nav className="flex w-[48px] shrink-0 flex-col border-r border-(--macos-vscode-border) bg-(--macos-vscode-activitybar)">
      <span
        title={texts.explorer}
        aria-current="page"
        className={cn(ITEM, 'text-(--macos-vscode-fg-active) before:absolute before:inset-y-0 before:left-0 before:w-[2px] before:bg-(--macos-vscode-accent)')}
      >
        <Files strokeWidth={1.5} aria-label={texts.explorer} />
      </span>
      {decorative.map(({ label, Icon }) => (
        <span key={label} title={label} className={ITEM}>
          <Icon strokeWidth={1.5} aria-label={label} />
        </span>
      ))}
      <span className="flex-1" />
      <span title={texts.accounts} className={ITEM}>
        <CircleUserRound strokeWidth={1.5} aria-label={texts.accounts} />
      </span>
      <span title={texts.manage} className={ITEM}>
        <Settings strokeWidth={1.5} aria-label={texts.manage} />
      </span>
    </nav>
  )
}
