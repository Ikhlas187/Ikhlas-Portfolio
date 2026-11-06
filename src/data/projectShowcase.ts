import type { Localized } from '@/data/locale'

// Projets du dossier Projets du faux macOS, dans l'ordre qui intéresse un recruteur (produit complet, stack actuelle,
// projets en ligne d'abord). Les repos absents de cette liste passent après, du plus récent au plus ancien.
export const SHOWCASE_ORDER = [
  'Ikhlas-Portfolio',
  'kommit-frontend',
  'kommit-backend',
  'portfolio-backend',
  'medicastock-react',
  'github-user',
  'john-website',
  'components-hole',
  'kommit-perso',
  'Groupe_5_Java',
  'Groupe_15_POO',
  'Columinst',
  'Gestionnaire_de_contacts',
  'MediPass',
  'New-Projet-Int-grateur',
]

// Exercices et tutoriels : sans intérêt pour un recruteur, retirés du dossier.
export const SHOWCASE_HIDDEN = ['JavaScript', 'React-tutoriel-', 'Podia-Project', 'Landing-Page-']

// « Exécuter » : une app web s'ouvre dans le Safari du Mac ; un programme compilé en WebAssembly tourne pour de vrai
// dans l'app Exécution, en terminal (wasm) ou avec ses fenêtres Qt (qt). Chargé seulement au clic, voir tools/runs/.
export type RepoRun =
  | { kind: 'web'; url: string }
  | { kind: 'wasm'; module: string; hint: Localized<string> }
  | { kind: 'qt'; loader: string; script: string; entry: string; hint: Localized<string> }

export const REPO_RUNS: Record<string, RepoRun> = {
  'Ikhlas-Portfolio': { kind: 'web', url: 'https://ikhlas-dev.vercel.app' },
  'medicastock-react': { kind: 'web', url: 'https://medicastock-react.vercel.app' },
  'github-user': { kind: 'web', url: 'https://github-user-red.vercel.app' },
  'john-website': { kind: 'web', url: 'https://john-website-peach.vercel.app' },
  'components-hole': { kind: 'web', url: 'https://my-project-pied-xi.vercel.app' },
  Groupe_15_POO: {
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
