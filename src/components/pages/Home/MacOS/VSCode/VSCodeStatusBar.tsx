import { Bell, ChevronsRightLeft, Globe, GitBranch, Lock } from 'lucide-react'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import type { TextPosition } from '@/logic/macos/textPosition/textPosition'
import type { RepoSummary } from '@/types/repo'

type VSCodeStatusBarProps = {
  repo: RepoSummary | null
  languageLabel: string | null
  position: TextPosition | null
  onOpenHomepage: (url: string) => void
}

const ITEM = 'flex h-full items-center gap-[4px] px-[6px] whitespace-nowrap [&_svg]:size-[13px]'

export default function VSCodeStatusBar({ repo, languageLabel, position, onOpenHomepage }: VSCodeStatusBarProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].vscode

  return (
    <footer className="flex h-[22px] shrink-0 items-center border-t border-(--macos-vscode-border) bg-(--macos-vscode-statusbar) text-[12px] text-(--macos-vscode-muted)">
      <span aria-hidden="true" className="flex h-full w-[34px] items-center justify-center bg-(--macos-vscode-accent) text-(--macos-vscode-fg-active)">
        <ChevronsRightLeft strokeWidth={2.2} className="size-[14px]" />
      </span>
      {repo && (
        <>
          <span className={ITEM}>
            <GitBranch strokeWidth={2} />
            {repo.branch}
          </span>
          {repo.visibility === 'private' && (
            <span className={ITEM} title={texts.privateRepo}>
              <Lock strokeWidth={2} />
              {texts.privateRepo}
            </span>
          )}
        </>
      )}
      <span className="flex-1" />
      {position && <span className={ITEM}>{texts.position.replace('{line}', String(position.line)).replace('{column}', String(position.column))}</span>}
      {languageLabel && (
        <>
          <span className={ITEM}>{texts.spaces}</span>
          <span className={ITEM}>{texts.encoding}</span>
          <span className={ITEM}>{texts.lineEnding}</span>
          <span className={ITEM}>{languageLabel}</span>
        </>
      )}
      {repo?.homepageUrl && (
        <button
          type="button"
          onClick={() => repo.homepageUrl && onOpenHomepage(repo.homepageUrl)}
          className={`${ITEM} cursor-pointer hover:bg-(--macos-vscode-hover) hover:text-(--macos-vscode-fg)`}
        >
          <Globe strokeWidth={2} />
          {new URL(repo.homepageUrl).hostname}
        </button>
      )}
      <span className={ITEM} aria-hidden="true">
        <Bell strokeWidth={2} />
      </span>
    </footer>
  )
}
