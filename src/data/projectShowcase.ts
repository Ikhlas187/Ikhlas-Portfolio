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

// « Exécuter » : une app web s'ouvre dans le Safari du Mac, un programme rejoue sa vraie session dans l'app Exécution.
export type RepoRun = { kind: 'web'; url: string } | { kind: 'session'; file: string }

export const REPO_RUNS: Record<string, RepoRun> = {
  'Ikhlas-Portfolio': { kind: 'web', url: 'https://ikhlas-dev.vercel.app' },
  'medicastock-react': { kind: 'web', url: 'https://medicastock-react.vercel.app' },
  'github-user': { kind: 'web', url: 'https://github-user-red.vercel.app' },
  'john-website': { kind: 'web', url: 'https://john-website-peach.vercel.app' },
  'components-hole': { kind: 'web', url: 'https://my-project-pied-xi.vercel.app' },
}
