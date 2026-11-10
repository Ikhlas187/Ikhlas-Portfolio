import { describe, expect, it } from 'vitest'
import type { CvContent } from '@/data/cv'
import type { MacFileTexts } from '@/data/macos'
import { buildFileTree, type FileTreeSources } from '@/logic/macos/buildFileTree/buildFileTree'
import { findNode } from '@/logic/macos/fileTree/fileTree'
import { buildRepoTree } from '@/logic/macos/repoTree/repoTree'
import type { RepoSummary } from '@/types/repo'

const texts: MacFileTexts = {
  folders: {
    home: 'ikhlas',
    desktop: 'Desktop',
    documents: 'Documents',
    downloads: 'Downloads',
    projects: 'Projects',
    certifications: 'Certifications',
    trash: 'Trash',
  },
  about: { name: 'About.txt', lines: ['Ikhlas Agbeti', 'Software Engineer'] },
  stack: { name: 'Stack.txt', heading: 'Tools' },
  downloadedPhoto: { name: 'code.jpg', alt: 'Code', photoId: 'code-id' },
  cvName: 'CV.pdf',
}

const cv: CvContent = {
  name: 'Ikhlas AGBETI',
  headline: 'Student',
  contacts: [],
  headings: {
    profile: 'Profile',
    skills: 'Skills',
    experience: 'Experience',
    projects: 'Projects',
    education: 'Education',
    certifications: 'Certifications',
    languages: 'Languages',
    interests: 'Interests',
  },
  profile: 'Profile text',
  skillGroups: [
    { id: 'frontend', name: 'Frontend', skills: ['React', 'Next.js'] },
    { id: 'methods', name: 'Methods', skills: ['Agile'] },
  ],
  experiences: [],
  projects: [],
  education: [],
  certifications: [
    { id: 'python', title: 'Python', issuer: 'Mind Luster' },
    { id: 'make-basics', title: 'Make Academy Basics', issuer: 'Make' },
  ],
  languages: [],
  interests: [],
  certificate: { label: 'Certificate', awardedTo: 'Awarded to', issuedBy: 'Issued by' },
}

const kommit: RepoSummary = {
  name: 'kommit-frontend',
  description: null,
  language: 'TypeScript',
  visibility: 'private',
  githubUrl: 'https://github.com/Ikhlas187/kommit-frontend',
  homepageUrl: null,
  branch: 'dev',
  updatedAt: '2026-10-12T09:00:00Z',
  fileCount: 2,
}
const kommitTree = buildRepoTree([
  { path: 'src/main.tsx', type: 'file', size: 120, content: 'render()' },
  { path: 'README.md', type: 'file', size: 9, content: '# Kommit' },
])
const portfolio: RepoSummary = { ...kommit, name: 'portfolio-backend' }

const sources: FileTreeSources = {
  texts,
  repos: [
    { summary: kommit, tree: kommitTree },
    { summary: portfolio, tree: null },
  ],
  roles: [
    { id: 'front', name: 'Frontend', stack: ['React', 'TypeScript'] },
    { id: 'back', name: 'Backend', stack: ['Node', 'React'] },
  ],
  cv,
  year: '2026',
}

describe('buildFileTree', () => {
  it('pose sur le Bureau les dossiers Projects, Certifications et le CV, rien d’autre (plus de Skills)', () => {
    const tree = buildFileTree(sources)

    const desktop = findNode(tree, ['desktop'])

    expect(desktop?.kind === 'folder' && desktop.children.map((node) => node.name)).toEqual([
      'Projects',
      'Certifications',
      'CV.pdf',
    ])
  })

  it('range un dossier par repo GitHub dans Bureau/Projets', () => {
    const tree = buildFileTree(sources)

    const projects = findNode(tree, ['desktop', 'projects'])

    expect(projects?.kind === 'folder' && projects.children.map((node) => node.name)).toEqual([
      'kommit-frontend',
      'portfolio-backend',
    ])
  })

  it('reprend l’arbre d’un repo chargé, dossiers d’abord, daté du dernier push', () => {
    const tree = buildFileTree(sources)

    const repo = findNode(tree, ['desktop', 'projects', 'kommit-frontend'])

    expect(repo?.kind === 'folder' && repo.children.map((node) => [node.kind, node.name, node.date])).toEqual([
      ['folder', 'src', '2026-10-12'],
      ['code', 'README.md', '2026-10-12'],
    ])
  })

  it('relie chaque fichier de code à son repo et à son chemin dans le repo', () => {
    const tree = buildFileTree(sources)

    const main = findNode(tree, ['desktop', 'projects', 'kommit-frontend', 'src', 'main.tsx'])

    expect(main).toEqual({
      kind: 'code',
      id: 'main.tsx',
      name: 'main.tsx',
      date: '2026-10-12',
      repo: 'kommit-frontend',
      filePath: 'src/main.tsx',
      size: 120,
    })
  })

  it('laisse vide et marqué non chargé le dossier d’un repo dont l’instantané manque', () => {
    const tree = buildFileTree(sources)

    const repo = findNode(tree, ['desktop', 'projects', 'portfolio-backend'])

    expect(repo?.kind === 'folder' && [repo.children, repo.repo?.isLoaded]).toEqual([[], false])
  })

  it('crée un PDF de certificat par certification, au nom du titulaire du CV', () => {
    const tree = buildFileTree(sources)

    const python = findNode(tree, ['desktop', 'certifications', 'python'])

    expect(python).toEqual({
      kind: 'pdf',
      id: 'python',
      name: 'Python.pdf',
      date: '2026',
      document: {
        type: 'certificate',
        certification: { id: 'python', title: 'Python', issuer: 'Mind Luster' },
        holder: 'Ikhlas AGBETI',
        labels: cv.certificate,
      },
    })
  })

  it('porte le contenu du CV dans CV.pdf', () => {
    const tree = buildFileTree(sources)

    const cvFile = findNode(tree, ['desktop', 'cv'])

    expect(cvFile?.kind === 'pdf' && cvFile.document).toEqual({ type: 'cv', cv })
  })

  it('liste chaque outil une seule fois dans Stack.txt', () => {
    const tree = buildFileTree(sources)

    const stack = findNode(tree, ['documents', 'stack'])

    expect(stack?.kind === 'text' && stack.content).toBe('Tools\n\n· React\n· TypeScript\n· Node')
  })

  it('joint les lignes de la présentation dans Documents/About.txt', () => {
    const tree = buildFileTree(sources)

    const about = findNode(tree, ['documents', 'about'])

    expect(about?.kind === 'text' && about.content).toBe('Ikhlas Agbeti\nSoftware Engineer')
  })

  it('ne modifie pas les sources reçues', () => {
    const snapshot = structuredClone(sources)

    buildFileTree(sources)

    expect(sources).toEqual(snapshot)
  })
})
