import type { RepoSummary } from '@/types/repo'

// Retire les repos masqués, renomme ceux de `renamed`, met d'abord ceux de la liste dans son ordre, puis les autres du plus récent au plus ancien.
export function showcaseRepos(
  repos: readonly RepoSummary[],
  order: readonly string[],
  hidden: readonly string[],
  renamed: Readonly<Record<string, string>> = {},
) {
  const rank = (name: string) => {
    const index = order.indexOf(name)
    return index === -1 ? order.length : index
  }
  return repos
    .filter((repo) => !hidden.includes(repo.name))
    .map((repo) => (renamed[repo.name] ? { ...repo, name: renamed[repo.name] } : repo))
    .sort((left, right) => rank(left.name) - rank(right.name) || right.updatedAt.localeCompare(left.updatedAt))
}

// Nom du repo sur GitHub (et de son instantané) derrière le nom affiché dans le Mac.
export function sourceRepoName(name: string, renamed: Readonly<Record<string, string>>) {
  return Object.keys(renamed).find((source) => renamed[source] === name) ?? name
}
