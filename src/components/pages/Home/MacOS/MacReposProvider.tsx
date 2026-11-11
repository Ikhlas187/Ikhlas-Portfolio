import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { CODELESS_PROJECTS, SHOWCASE_HIDDEN, SHOWCASE_ORDER, SHOWCASE_RENAMED } from '@/data/projectShowcase'
import { fetchRepoIndex, fetchRepoSnapshot } from '@/lib/api/repos'
import { showcaseRepos, sourceRepoName } from '@/logic/macos/repoShowcase/repoShowcase'
import { buildRepoTree, type RepoTreeDir } from '@/logic/macos/repoTree/repoTree'
import type { RepoSummary } from '@/types/repo'

export type LoadStatus = 'loading' | 'ready' | 'error'

type MacRepos = {
  index: RepoSummary[]
  indexStatus: LoadStatus
  trees: Record<string, RepoTreeDir>
  repoStatus: (name: string) => LoadStatus | null
  requestRepo: (name: string) => void
  reloadIndex: () => void
}

const MacReposContext = createContext<MacRepos | null>(null)

// Repos GitHub du dossier Projets : la liste se charge avec le bureau, l'arbre d'un repo à sa 1re ouverture.
export default function MacReposProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState<RepoSummary[]>([])
  const [indexStatus, setIndexStatus] = useState<LoadStatus>('loading')
  const [indexAttempt, setIndexAttempt] = useState(0)
  const [trees, setTrees] = useState<Record<string, RepoTreeDir>>({})
  const [statuses, setStatuses] = useState<Record<string, LoadStatus>>({})
  const requested = useRef(new Set<string>())

  useEffect(() => {
    let isCurrent = true
    fetchRepoIndex()
      .then((repos) => {
        if (!isCurrent) return
        setIndex(showcaseRepos([...repos, ...CODELESS_PROJECTS], SHOWCASE_ORDER, SHOWCASE_HIDDEN, SHOWCASE_RENAMED))
        setIndexStatus('ready')
      })
      .catch(() => isCurrent && setIndexStatus('error'))
    return () => {
      isCurrent = false
    }
  }, [indexAttempt])

  const reloadIndex = useCallback(() => {
    setIndexStatus('loading')
    setIndexAttempt((attempt) => attempt + 1)
  }, [])

  const requestRepo = useCallback((name: string) => {
    if (requested.current.has(name)) return
    requested.current.add(name)
    // Projet sans code : dossier vide, seul son README s'affiche.
    if (CODELESS_PROJECTS.some((project) => project.name === name)) {
      setTrees((loaded) => ({ ...loaded, [name]: { kind: 'dir', name: '', path: '', children: [] } }))
      setStatuses((current) => ({ ...current, [name]: 'ready' }))
      return
    }
    setStatuses((current) => ({ ...current, [name]: 'loading' }))
    fetchRepoSnapshot(sourceRepoName(name, SHOWCASE_RENAMED))
      .then((snapshot) => {
        const tree = buildRepoTree(snapshot.entries)
        setTrees((loaded) => ({ ...loaded, [name]: tree }))
        setStatuses((current) => ({ ...current, [name]: 'ready' }))
      })
      .catch(() => {
        // Un échec n'est pas définitif : la prochaine ouverture du dossier retente.
        requested.current.delete(name)
        setStatuses((current) => ({ ...current, [name]: 'error' }))
      })
  }, [])

  const value = useMemo(
    (): MacRepos => ({
      index,
      indexStatus,
      trees,
      repoStatus: (name) => statuses[name] ?? null,
      requestRepo,
      reloadIndex,
    }),
    [index, indexStatus, trees, statuses, requestRepo, reloadIndex],
  )

  return <MacReposContext.Provider value={value}>{children}</MacReposContext.Provider>
}

export function useMacRepos(): MacRepos {
  const repos = useContext(MacReposContext)
  if (!repos) throw new Error('useMacRepos doit être appelé sous MacReposProvider')
  return repos
}
