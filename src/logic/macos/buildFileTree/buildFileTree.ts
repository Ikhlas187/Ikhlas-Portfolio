import type { CvContent } from '@/data/cv'
import type { FsFolder, FsNode, FsPdfFile, FsTextFile, MacFileTexts } from '@/data/macos'
import type { RepoTreeDir } from '@/logic/macos/repoTree/repoTree'
import type { RepoSummary } from '@/types/repo'

// Un repo GitHub du dossier Projets ; tree reste null tant que son instantané n'est pas chargé.
export type FileTreeRepo = { summary: RepoSummary; tree: RepoTreeDir | null }

export type FileTreeRole = { id: string; name: string; stack: string[] }

export type FileTreeSources = {
  texts: MacFileTexts
  repos: FileTreeRepo[]
  roles: FileTreeRole[]
  cv: CvContent
  year: string
}

function bulletList(heading: string, items: string[]) {
  return [heading, '', ...items.map((item) => `· ${item}`)].join('\n')
}

function repoChildren(repo: string, dir: RepoTreeDir, date: string): FsNode[] {
  return dir.children.map((child): FsNode =>
    child.kind === 'dir'
      ? { kind: 'folder', id: child.name, name: child.name, date, children: repoChildren(repo, child, date) }
      : { kind: 'code', id: child.name, name: child.name, date, repo, filePath: child.path, size: child.size },
  )
}

// Dossier d'un repo : l'arbre GitHub complet une fois chargé, vide avant.
export function repoFolder({ summary, tree }: FileTreeRepo): FsFolder {
  const date = summary.updatedAt.slice(0, 10)
  return {
    kind: 'folder',
    id: summary.name,
    name: summary.name,
    date,
    children: tree ? repoChildren(summary.name, tree, date) : [],
    repo: { summary, isLoaded: tree !== null },
  }
}

// Arborescence du Finder : Bureau (Projets, Skills, Certifications, CV), Documents, Téléchargements, Corbeille.
export function buildFileTree({ texts, repos, roles, cv, year }: FileTreeSources): FsFolder {
  const cvFile: FsPdfFile = {
    kind: 'pdf',
    id: 'cv',
    name: texts.cvName,
    date: year,
    document: { type: 'cv', cv },
  }
  const about: FsTextFile = {
    kind: 'text',
    id: 'about',
    name: texts.about.name,
    date: year,
    content: texts.about.lines.join('\n'),
  }

  const projectsFolder: FsFolder = {
    kind: 'folder',
    id: 'projects',
    name: texts.folders.projects,
    date: year,
    children: repos.map(repoFolder),
  }

  const certifications: FsFolder = {
    kind: 'folder',
    id: 'certifications',
    name: texts.folders.certifications,
    date: year,
    children: cv.certifications.map((certification) => ({
      kind: 'pdf',
      id: certification.id,
      name: `${certification.title}.pdf`,
      date: certification.year ?? year,
      document: { type: 'certificate', certification, holder: cv.name, labels: cv.certificate },
    })),
  }

  const allTools = [...new Set(roles.flatMap((role) => role.stack))]

  return {
    kind: 'folder',
    id: 'home',
    name: texts.folders.home,
    date: year,
    children: [
      {
        kind: 'folder',
        id: 'desktop',
        name: texts.folders.desktop,
        date: year,
        children: [projectsFolder, certifications, cvFile],
      },
      {
        kind: 'folder',
        id: 'documents',
        name: texts.folders.documents,
        date: year,
        children: [
          about,
          {
            kind: 'text',
            id: 'stack',
            name: texts.stack.name,
            date: year,
            content: bulletList(texts.stack.heading, allTools),
          },
        ],
      },
      {
        kind: 'folder',
        id: 'downloads',
        name: texts.folders.downloads,
        date: year,
        children: [
          {
            kind: 'image',
            id: 'code',
            name: texts.downloadedPhoto.name,
            date: year,
            photoId: texts.downloadedPhoto.photoId,
            alt: texts.downloadedPhoto.alt,
          },
        ],
      },
      { kind: 'folder', id: 'trash', name: texts.folders.trash, date: year, children: [] },
    ],
  }
}
