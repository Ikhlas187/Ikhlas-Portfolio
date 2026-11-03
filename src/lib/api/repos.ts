import type { RepoSnapshot, RepoSummary } from '@/types/repo'

const REPOS_URL = '/repos'

// Une seule requête par fichier pour toute la session : les instantanés ne changent qu'au déploiement.
const cache = new Map<string, Promise<unknown>>()

async function getJson<T>(url: string): Promise<T> {
  const cached = cache.get(url)
  if (cached) return cached as Promise<T>
  const request = fetch(url).then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response.json() as Promise<T>
  })
  cache.set(url, request)
  request.catch(() => cache.delete(url))
  return request
}

export function fetchRepoIndex() {
  return getJson<RepoSummary[]>(`${REPOS_URL}/index.json`)
}

export function fetchRepoSnapshot(name: string) {
  return getJson<RepoSnapshot>(`${REPOS_URL}/${encodeURIComponent(name)}.json`)
}
