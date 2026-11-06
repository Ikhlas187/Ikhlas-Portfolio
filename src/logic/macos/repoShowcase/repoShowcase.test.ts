import { describe, expect, it } from 'vitest'
import { showcaseRepos } from '@/logic/macos/repoShowcase/repoShowcase'
import type { RepoSummary } from '@/types/repo'

function repo(name: string, updatedAt: string): RepoSummary {
  return {
    name,
    description: null,
    language: null,
    visibility: 'public',
    githubUrl: `https://github.com/x/${name}`,
    homepageUrl: null,
    branch: 'main',
    updatedAt,
    fileCount: 1,
  }
}

describe('showcaseRepos', () => {
  it('suit la liste, puis range les autres du plus récent au plus ancien', () => {
    const repos = [repo('old', '2024-01-01'), repo('b', '2025-01-01'), repo('new', '2026-01-01'), repo('a', '2023-01-01')]

    const names = showcaseRepos(repos, ['a', 'b'], []).map((item) => item.name)

    expect(names).toEqual(['a', 'b', 'new', 'old'])
  })

  it('retire les repos masqués', () => {
    const repos = [repo('keep', '2025-01-01'), repo('tutorial', '2026-01-01')]

    const names = showcaseRepos(repos, [], ['tutorial']).map((item) => item.name)

    expect(names).toEqual(['keep'])
  })
})
