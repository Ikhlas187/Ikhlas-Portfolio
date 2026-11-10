import { useEffect, useState } from 'react'
import { BookOpen, Compass, ExternalLink } from 'lucide-react'
import { MACOS } from '@/data/macos'
import { REPO_RUNS } from '@/data/projectShowcase'
import { PROJECT_PAGE, SHOWCASE_PROJECTS } from '@/data/projects'
import { fetchRepoSnapshot } from '@/lib/api/repos'
import { useLocale } from '@/lib/LocaleProvider'
import { readmeSummary } from '@/logic/macos/readmeSummary/readmeSummary'
import type { RepoSummary } from '@/types/repo'

type RepoReadmeProps = { repo: RepoSummary; onRun: () => void }

const LINK =
  'inline-flex cursor-pointer items-center gap-[5px] text-(--macos-finder-text) underline underline-offset-[3px] hover:opacity-70'

/* README d'un projet sous ses fichiers, comme sur GitHub : résumé, services, année, liens et captures
   (mêmes infos que la page projet du téléphone quand le projet y figure). */
export default function RepoReadme({ repo, onRun }: RepoReadmeProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].repos
  const labels = PROJECT_PAGE[locale]
  const showcase = SHOWCASE_PROJECTS[locale].find((project) => project.repo === repo.name)
  const [readme, setReadme] = useState<string | null>(null)
  const hasCode = repo.githubUrl !== ''

  // Sans fiche projet : le résumé vient du README.md du repo, lu dans son instantané.
  useEffect(() => {
    if (showcase || !hasCode) return
    let isCurrent = true
    fetchRepoSnapshot(repo.name)
      .then((snapshot) => {
        const file = snapshot.entries.find((entry) => entry.type === 'file' && /^readme\.md$/i.test(entry.path))
        const summary = file?.type === 'file' && file.content ? readmeSummary(file.content) : null
        if (isCurrent) setReadme(summary)
      })
      .catch(() => isCurrent && setReadme(null))
    return () => {
      isCurrent = false
    }
  }, [repo.name, showcase, hasCode])

  const summary = showcase?.description ?? readme ?? repo.description
  const services = showcase?.services ?? (repo.language ? [repo.language] : [])
  const year = showcase?.year ?? repo.updatedAt.slice(0, 4)
  const isWebRunnable = REPO_RUNS[repo.name]?.kind === 'web'

  return (
    <section className="mx-[16px] mt-[8px] mb-[20px] rounded-[10px] border border-(--macos-finder-separator) text-(--macos-finder-text)">
      <header className="flex items-center gap-[7px] border-b border-(--macos-finder-separator) px-[16px] py-[9px] text-[12px] font-semibold">
        <BookOpen strokeWidth={1.8} className="size-[14px]" />
        {texts.readme}
      </header>
      <div className="flex flex-col gap-[18px] px-[24px] py-[20px]">
        <h2 className="text-[26px] leading-[1.15] font-bold tracking-[-0.02em]">{showcase?.name ?? repo.name}</h2>
        {summary && <p className="max-w-[620px] text-[14px] leading-[1.55] select-text">{summary}</p>}
        <dl className="grid grid-cols-[auto_1fr] gap-x-[24px] gap-y-[8px] text-[13px]">
          {services.length > 0 && (
            <>
              <dt className="text-(--macos-finder-text-muted)">{showcase ? labels.services : texts.language}</dt>
              <dd>{services.join(' · ')}</dd>
            </>
          )}
          <dt className="text-(--macos-finder-text-muted)">{labels.year}</dt>
          <dd>{year}</dd>
          <dt className="text-(--macos-finder-text-muted)">{labels.link}</dt>
          <dd className="flex flex-wrap gap-x-[16px] gap-y-[4px]">
            {isWebRunnable && (
              <button type="button" onClick={onRun} className={LINK}>
                <Compass strokeWidth={1.8} className="size-[13px]" />
                {texts.openInSafari}
              </button>
            )}
            {hasCode && (
              <a href={repo.githubUrl} target="_blank" rel="noreferrer" className={LINK}>
                <ExternalLink strokeWidth={1.8} className="size-[13px]" />
                {texts.openOnGitHub}
              </a>
            )}
          </dd>
        </dl>
        {showcase && (
          <div className="flex flex-col gap-[10px]">
            {showcase.shots.map((shot) => (
              <img key={shot.src} src={shot.src} alt={shot.alt} loading="lazy" className="w-full rounded-[8px] border border-(--macos-finder-separator)" />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
