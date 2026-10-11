export type ProjectPhoto = { id: string; alt: string }

export type Project = {
  name: string
  eyebrow: string
  description: string
  date: string
  accent: string
  dark: string
  layout: 'a' | 'b'
  photos: ProjectPhoto[]
}

export const PROJECTS: Project[] = [
  {
    name: 'NEVORA',
    eyebrow: 'Portfolio · E-commerce',
    description:
      "Boutique de mode inspirée des maisons de luxe : préchargeur d'images, scroll horizontal épinglé et fiches produit animées.",
    date: '2025',
    accent: '#FFB703',
    dark: '#4A3300',
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
      "Application mobile de revente de sneakers Nike : accueil éditorial, catégories épinglées au scroll et parcours d'achat pensé mobile-first.",
    date: '2025',
    accent: '#06D6A0',
    dark: '#03352A',
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
    accent: '#3B82F6',
    dark: '#0A2A5E',
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
      "Plateforme de gestion des actes administratifs étudiants : demandes en ligne, suivi de dossier et espace d'administration.",
    date: '2024',
    accent: '#0E7C86',
    dark: '#06343A',
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
      "Recensement et valorisation des compétences locales d'une commune : annuaire des talents, profils et recherche par métier.",
    date: '2024',
    accent: '#FF7B00',
    dark: '#4A2400',
    layout: 'a',
    photos: [
      { id: '1597960194599-22929afc25b1', alt: 'Artisan au travail dans son atelier' },
      { id: '1426927308491-6380b6a9936f', alt: 'Mains d’un artisan sur l’établi' },
      { id: '1547609434-b732edfee020', alt: 'Outils d’atelier suspendus' },
      { id: '1611021061285-16c871740efa', alt: 'Céramiste façonnant une pièce' },
    ],
  },
]

export const PROJECTS_SECTION = {
  interludeTitle: ['SELECTED', 'WORKS'],
  dateLabel: 'Date:',
}
