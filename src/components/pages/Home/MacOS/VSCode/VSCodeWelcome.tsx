import { FolderGit2, Lock } from 'lucide-react'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import type { RepoSummary } from '@/types/repo'

type VSCodeWelcomeProps = { repos: RepoSummary[]; onOpenRepo: (name: string) => void }

// Page d'accueil quand VS Code s'ouvre depuis le Dock, sans repo : les repos d'Ikhlas en « Récent ».
export default function VSCodeWelcome({ repos, onOpenRepo }: VSCodeWelcomeProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].vscode

  return (
    <div className="absolute inset-0 overflow-y-auto bg-(--macos-vscode-editor) px-[64px] py-[56px] text-(--macos-vscode-fg)">
      <h1 className="font-(family-name:--font-macos-frame) text-[32px] leading-tight font-normal tracking-normal text-(--macos-vscode-fg-active)">
        {texts.welcomeTitle}
      </h1>
      <p className="mt-[4px] text-[18px] text-(--macos-vscode-muted)">{texts.welcomeSubtitle}</p>
      <h2 className="mt-[36px] mb-[8px] font-(family-name:--font-macos-frame) text-[15px] font-normal tracking-normal">{texts.recent}</h2>
      <ul className="grid max-w-[560px] gap-[2px] text-[13px]">
        {repos.map((repo) => (
          <li key={repo.name}>
            <button
              type="button"
              onClick={() => onOpenRepo(repo.name)}
              className="flex w-full cursor-pointer items-center gap-[8px] rounded-[4px] px-[6px] py-[3px] text-left hover:bg-(--macos-vscode-hover)"
            >
              <FolderGit2 aria-hidden="true" strokeWidth={1.8} className="size-[14px] shrink-0 text-(--macos-vscode-accent)" />
              <span className="text-(--macos-vscode-syntax-variable)">{repo.name}</span>
              {repo.visibility === 'private' && <Lock aria-hidden="true" strokeWidth={2} className="size-[11px] text-(--macos-vscode-muted)" />}
              <span className="truncate text-(--macos-vscode-muted)">{repo.description ?? repo.language ?? ''}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
