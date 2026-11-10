import type { Localized } from '@/data/locale'

export type ProjectPhoto = { id: string; alt: string }

export type Project = {
  name: string
  eyebrow: string
  description: string
  date: string
  layout: 'a' | 'b'
  photos: ProjectPhoto[]
}

type ProjectsSection = {
  interludeTitle: [string, string]
  dateLabel: string
}

export const PROJECTS: Localized<Project[]> = {
  en: [
    {
      name: 'NEVORA',
      eyebrow: 'Portfolio · E-commerce',
      description:
        'Fashion store inspired by luxury houses: image preloader, pinned horizontal scroll and animated product pages.',
      date: '2025',
      layout: 'a',
      photos: [
        { id: '1580478491436-fd6a937acc9e', alt: 'Fashion editorial, figure in motion' },
        { id: '1629511565591-a1d494ad6c58', alt: 'Studio fashion portrait' },
        { id: '1591892212776-a09de24dbe84', alt: 'Close-up of a high-end garment' },
        { id: '1613915617430-8ab0fd7c6baf', alt: 'Fashion accessories laid flat' },
      ],
    },
    {
      name: 'DRIP',
      eyebrow: 'Portfolio · Mobile app',
      description:
        'Mobile app for reselling Nike sneakers: editorial home, categories pinned on scroll and a mobile-first checkout flow.',
      date: '2025',
      layout: 'b',
      photos: [
        { id: '1560769629-975ec94e6a86', alt: 'Red sneaker on a plain background' },
        { id: '1552346154-21d32810aba3', alt: 'Pair of sneakers in mid-air' },
        { id: '1600185365483-26d7a4cc7519', alt: 'White sneaker in profile' },
        { id: '1595341888016-a392ef81b7de', alt: 'Row of sneakers' },
      ],
    },
    {
      name: 'MEDICASTOCK',
      eyebrow: 'Portfolio · Web app',
      description:
        'Pharmacy stock management: inventory, expiry alerts and dashboards, with shared navigation animations.',
      date: '2025',
      layout: 'a',
      photos: [
        { id: '1607619056574-7b8d3ee536b2', alt: 'Close-up of colorful capsules' },
        { id: '1587854692152-cbe660dbde88', alt: 'Medicine blister packs' },
        { id: '1576602976047-174e57a47881', alt: 'Pills on a colored background' },
        { id: '1562243061-204550d8a2c9', alt: 'Pharmacy shelves' },
      ],
    },
    {
      name: 'ETUDOCS',
      eyebrow: 'Portfolio · Web platform',
      description:
        'Platform for student administrative paperwork: online requests, file tracking and an admin area.',
      date: '2024',
      layout: 'b',
      photos: [
        { id: '1562654501-a0ccc0fc3fb1', alt: 'Administrative documents on a desk' },
        { id: '1590012314607-cda9d9b699ae', alt: 'University library' },
        { id: '1619418602850-35ad20aa1700', alt: 'Student filling in a form' },
        { id: '1668092547528-62bdec358652', alt: 'Stack of filed folders' },
      ],
    },
    {
      name: 'COMUNIST',
      eyebrow: 'Portfolio · Web platform',
      description:
        'Mapping and promoting a town’s local skills: talent directory, profiles and search by trade.',
      date: '2024',
      layout: 'a',
      photos: [
        { id: '1597960194599-22929afc25b1', alt: 'Craftsman at work in his workshop' },
        { id: '1426927308491-6380b6a9936f', alt: 'Craftsman’s hands at the workbench' },
        { id: '1547609434-b732edfee020', alt: 'Workshop tools hanging on a wall' },
        { id: '1611021061285-16c871740efa', alt: 'Ceramicist shaping a piece' },
      ],
    },
  ],
  fr: [
    {
      name: 'NEVORA',
      eyebrow: 'Portfolio · E-commerce',
      description:
        'Boutique de mode inspirée des maisons de luxe : préchargeur d’images, scroll horizontal épinglé et fiches produit animées.',
      date: '2025',
      layout: 'a',
      photos: [
        { id: '1580478491436-fd6a937acc9e', alt: 'Éditorial mode, silhouette en mouvement' },
        { id: '1629511565591-a1d494ad6c58', alt: 'Portrait mode en studio' },
        { id: '1591892212776-a09de24dbe84', alt: 'Détail de vêtement haut de gamme' },
        { id: '1613915617430-8ab0fd7c6baf', alt: 'Accessoires de mode posés à plat' },
      ],
    },
    {
      name: 'DRIP',
      eyebrow: 'Portfolio · App mobile',
      description:
        'Application mobile de revente de sneakers Nike : accueil éditorial, catégories épinglées au scroll et parcours d’achat pensé mobile-first.',
      date: '2025',
      layout: 'b',
      photos: [
        { id: '1560769629-975ec94e6a86', alt: 'Sneaker rouge sur fond uni' },
        { id: '1552346154-21d32810aba3', alt: 'Paire de sneakers en l’air' },
        { id: '1600185365483-26d7a4cc7519', alt: 'Sneaker blanche de profil' },
        { id: '1595341888016-a392ef81b7de', alt: 'Collection de sneakers alignées' },
      ],
    },
    {
      name: 'MEDICASTOCK',
      eyebrow: 'Portfolio · App web',
      description:
        'Gestion de stock pharmaceutique : inventaire, alertes de péremption et tableaux de bord, avec des animations de navigation partagées.',
      date: '2025',
      layout: 'a',
      photos: [
        { id: '1607619056574-7b8d3ee536b2', alt: 'Gélules colorées en gros plan' },
        { id: '1587854692152-cbe660dbde88', alt: 'Blisters de médicaments' },
        { id: '1576602976047-174e57a47881', alt: 'Comprimés sur fond coloré' },
        { id: '1562243061-204550d8a2c9', alt: 'Rayonnages d’une pharmacie' },
      ],
    },
    {
      name: 'ETUDOCS',
      eyebrow: 'Portfolio · Plateforme web',
      description:
        'Plateforme de gestion des actes administratifs étudiants : demandes en ligne, suivi de dossier et espace d’administration.',
      date: '2024',
      layout: 'b',
      photos: [
        { id: '1562654501-a0ccc0fc3fb1', alt: 'Documents administratifs sur un bureau' },
        { id: '1590012314607-cda9d9b699ae', alt: 'Bibliothèque universitaire' },
        { id: '1619418602850-35ad20aa1700', alt: 'Étudiant complétant un dossier' },
        { id: '1668092547528-62bdec358652', alt: 'Pile de dossiers classés' },
      ],
    },
    {
      name: 'COMUNIST',
      eyebrow: 'Portfolio · Plateforme web',
      description:
        'Recensement et valorisation des compétences locales d’une commune : annuaire des talents, profils et recherche par métier.',
      date: '2024',
      layout: 'a',
      photos: [
        { id: '1597960194599-22929afc25b1', alt: 'Artisan au travail dans son atelier' },
        { id: '1426927308491-6380b6a9936f', alt: 'Mains d’un artisan sur l’établi' },
        { id: '1547609434-b732edfee020', alt: 'Outils d’atelier suspendus' },
        { id: '1611021061285-16c871740efa', alt: 'Céramiste façonnant une pièce' },
      ],
    },
  ],
}

export const PROJECTS_SECTION: Localized<ProjectsSection> = {
  en: { interludeTitle: ['SELECTED', 'WORKS'], dateLabel: 'Date:' },
  fr: { interludeTitle: ['TRAVAUX', 'CHOISIS'], dateLabel: 'Date :' },
}

type ProjectPageText = {
  sectionTitle: string
  certificationsLink: string
  back: string
  description: string
  services: string
  year: string
}

// Version mobile de la home (liste de projets en défilement horizontal) et page d'un projet (réf. haufsess.com).
export const PROJECT_PAGE: Localized<ProjectPageText> = {
  en: {
    sectionTitle: 'Selected Projects',
    certificationsLink: 'See my certifications',
    back: 'Back',
    description: 'Description',
    services: 'Services',
    year: 'Year',
  },
  fr: {
    sectionTitle: 'Projets choisis',
    certificationsLink: 'Voir mes certifications',
    back: 'Retour',
    description: 'Description',
    services: 'Services',
    year: 'Année',
  },
}
