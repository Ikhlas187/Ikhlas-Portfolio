import columinstBoard from '@/assets/projects/readme/columinst-1.webp'
import componentsHoleHome from '@/assets/projects/readme/components-hole-1.webp'
import githubUserHome from '@/assets/projects/readme/github-user-1.webp'
import githubUserSearch from '@/assets/projects/readme/github-user-2.webp'
import portfolioHero from '@/assets/projects/readme/ikhlas-portfolio-1.webp'
import medicastockHero from '@/assets/projects/readme/medicastock-react-1.webp'
import medicastockServices from '@/assets/projects/readme/medicastock-react-2.webp'
import medipassAdminMenu from '@/assets/projects/readme/medipass-1.webp'
import type { Localized } from '@/data/locale'
import type { ShowcaseShot } from '@/data/projects'

// Captures des projets lancés (site en ligne ou build WebAssembly du Mac), affichées sous leur README, par nom de repo.
export const README_SHOTS: Localized<Record<string, ShowcaseShot[]>> = {
  en: {
    'Ikhlas-Portfolio': [{ src: portfolioHero, alt: 'Portfolio home page with the Ikhlas A. name' }],
    'medicastock-react': [
      { src: medicastockHero, alt: 'MEDICASTOCK home page: smart management of pharmaceutical stock' },
      { src: medicastockServices, alt: 'Services section: drug catalogue sorted by family' },
    ],
    'github-user': [
      { src: githubUserHome, alt: 'github-user home page: discover GitHub profiles and repos' },
      { src: githubUserSearch, alt: 'User search results' },
    ],
    'components-hole': [{ src: componentsHoleHome, alt: 'Gallery of website studies rebuilt as React components' }],
    MediPass: [{ src: medipassAdminMenu, alt: 'MediPass running in WebAssembly: admin menu after sign-in' }],
    Columinst: [{ src: columinstBoard, alt: 'Columinst running in WebAssembly: a project board with its columns' }],
  },
  fr: {
    'Ikhlas-Portfolio': [{ src: portfolioHero, alt: "Page d'accueil du portfolio avec le nom Ikhlas A." }],
    'medicastock-react': [
      { src: medicastockHero, alt: "Page d'accueil de MEDICASTOCK : gestion intelligente du stock pharmaceutique" },
      { src: medicastockServices, alt: 'Section Services : catalogue des médicaments classés par famille' },
    ],
    'github-user': [
      { src: githubUserHome, alt: "Page d'accueil de github-user : découvrir profils et repos GitHub" },
      { src: githubUserSearch, alt: "Résultats d'une recherche d'utilisateur" },
    ],
    'components-hole': [{ src: componentsHoleHome, alt: "Galerie d'études de sites refaites en composants React" }],
    MediPass: [{ src: medipassAdminMenu, alt: 'MediPass lancé en WebAssembly : menu administrateur après connexion' }],
    Columinst: [{ src: columinstBoard, alt: 'Columinst lancé en WebAssembly : tableau de projet et ses colonnes' }],
  },
}
