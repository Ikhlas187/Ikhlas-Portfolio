// Contrat des instantanés de repos GitHub écrits par tools/repos/snapshot.mjs dans public/repos/.

export type RepoSummary = {
  name: string
  description: string | null
  language: string | null
  visibility: 'public' | 'private'
  githubUrl: string
  homepageUrl: string | null
  branch: string
  updatedAt: string
  fileCount: number
}

// Fichier présent dans l'arbre mais publié sans contenu.
export type RepoOmission = 'binary' | 'lockfile' | 'tooLarge' | 'budget'

export type RepoEntry =
  | { path: string; type: 'dir' }
  | { path: string; type: 'file'; size: number; content?: string; omitted?: RepoOmission }

export type RepoSnapshot = {
  name: string
  branch: string
  contentBudgetApplied: boolean
  treeTruncated: boolean
  entries: RepoEntry[]
}
