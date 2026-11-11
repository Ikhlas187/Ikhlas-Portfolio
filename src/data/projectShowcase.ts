import type { Localized } from '@/data/locale'
import type { RepoSummary } from '@/types/repo'

// Ordre du dossier Projects pour un recruteur ; les repos absents passent après, du plus récent au plus ancien.
export const SHOWCASE_ORDER = [
  'Efreeshop',
  'ETUDOCS',
  'Ikhlas-Portfolio',
  'medicastock-react',
  'github-user',
  'components-hole',
  'MediPass',
  'Columinst',
]

// Projets sans code consultable (repo privé d'une autre équipe) : un dossier qui ne s'ouvre que dans le Safari du Mac.
export const CODELESS_PROJECTS: RepoSummary[] = [
  {
    name: 'Efreeshop',
    description: null,
    language: 'TypeScript',
    visibility: 'private',
    githubUrl: '',
    homepageUrl: 'https://www.e-freeshop.com',
    branch: 'main',
    updatedAt: '2026-07-12T00:00:00Z',
    fileCount: 0,
  },
]

// Exercices, tutoriels et projets retirés du dossier ; « MediPass » est l'ancienne version, remplacée par Groupe_15_POO.
export const SHOWCASE_HIDDEN = [
  'JavaScript',
  'React-tutoriel-',
  'Podia-Project',
  'Landing-Page-',
  'kommit-frontend',
  'kommit-backend',
  'kommit-perso',
  'portfolio-backend',
  'john-website',
  'Groupe_5_Java',
  'Gestionnaire_de_contacts',
  'New-Projet-Int-grateur',
  'MediPass',
]

// Repos affichés sous un autre nom dans le Mac : nom GitHub vers nom affiché.
export const SHOWCASE_RENAMED: Record<string, string> = { Groupe_15_POO: 'MediPass' }

// « Exécuter » : app web dans le Safari du Mac, ou programme WebAssembly (tools/runs/) dans l'app Exécution.
export type RepoRun =
  | { kind: 'web'; url: string }
  | { kind: 'wasm'; module: string; hint: Localized<string> }
  | { kind: 'qt'; loader: string; script: string; entry: string; hint: Localized<string> }

export const REPO_RUNS: Record<string, RepoRun> = {
  Efreeshop: { kind: 'web', url: 'https://www.e-freeshop.com' },
  'Ikhlas-Portfolio': { kind: 'web', url: 'https://ikhlas-dev.vercel.app' },
  'medicastock-react': { kind: 'web', url: 'https://medicastock-react.vercel.app' },
  'github-user': { kind: 'web', url: 'https://github-user-red.vercel.app' },
  'components-hole': { kind: 'web', url: 'https://my-project-pied-xi.vercel.app' },
  MediPass: {
    kind: 'wasm',
    module: '/runs/medipass/medipass.mjs',
    hint: {
      en: 'MediPass, C++ and SQLite compiled to WebAssembly. Demo logins: admin / demo1234 (choice 1) or docteur / demo1234 (choice 2).',
      fr: 'MediPass, C++ et SQLite compilés en WebAssembly. Comptes de démo : admin / demo1234 (choix 1) ou docteur / demo1234 (choix 2).',
    },
  },
  Columinst: {
    kind: 'qt',
    loader: '/runs/columinst/qtloader.js',
    script: '/runs/columinst/columinst.js',
    entry: 'columinst_entry',
    hint: {
      en: 'Columinst, a Qt C++ task manager compiled to WebAssembly (8.5 MB). Its SQLite database lives in this tab only.',
      fr: 'Columinst, gestionnaire de tâches Qt C++ compilé en WebAssembly (8,5 Mo). Sa base SQLite vit seulement dans cet onglet.',
    },
  },
}
