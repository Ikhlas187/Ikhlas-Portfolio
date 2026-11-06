import type { RepoSummary } from '@/types/repo'

// Retire les repos masqués, met d'abord ceux de la liste dans son ordre, puis les autres du plus récent au plus ancien.
export function showcaseRepos(repos: readonly RepoSummary[], order: readonly string[], hidden: readonly string[]) {
  const rank = (name: string) => {
    const index = order.indexOf(name)
    return index === -1 ? order.length : index
  }
  return repos
    .filter((repo) => !hidden.includes(repo.name))
    .sort((left, right) => rank(left.name) - rank(right.name) || right.updatedAt.localeCompare(left.updatedAt))
}
