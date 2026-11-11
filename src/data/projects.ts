import columinstBoard from '@/assets/projects/columinst/board.webp'
import columinstCover from '@/assets/projects/columinst/cover-portrait.webp'
import componentsHoleCover from '@/assets/projects/components-hole/cover-portrait.webp'
import componentsHoleAgenciy from '@/assets/projects/components-hole/agenciy-home.webp'
import componentsHoleDetroit from '@/assets/projects/components-hole/detroit-home.webp'
import componentsHoleGallery from '@/assets/projects/components-hole/gallery.webp'
import componentsHoleGrainient from '@/assets/projects/components-hole/grainient-home.webp'
import componentsHoleHanzo from '@/assets/projects/components-hole/hanzo-home.webp'
import componentsHoleIncredibles from '@/assets/projects/components-hole/incredibles-home.webp'
import componentsHoleIntelli from '@/assets/projects/components-hole/intelli-home.webp'
import componentsHoleMacbookScroll from '@/assets/projects/components-hole/macbook-scroll.webp'
import componentsHoleNormalboring from '@/assets/projects/components-hole/normalboring-home.webp'
import componentsHoleNovaApp from '@/assets/projects/components-hole/nova-app.webp'
import componentsHoleOversizedTitle from '@/assets/projects/components-hole/oversized-title.webp'
import componentsHolePoppr from '@/assets/projects/components-hole/poppr-home.webp'
import componentsHolePortfolite from '@/assets/projects/components-hole/portfolite-home.webp'
import componentsHoleStackgrid from '@/assets/projects/components-hole/stackgrid-home.webp'
import componentsHoleVerseo from '@/assets/projects/components-hole/verseo-home.webp'
import componentsHoleVoltMenu from '@/assets/projects/components-hole/volt-menu.webp'
import efreeshopComponents from '@/assets/projects/efreeshop/components.webp'
import efreeshopHero from '@/assets/projects/efreeshop/hero.webp'
import efreeshopCoverLandscape from '@/assets/projects/efreeshop/cover-landscape.webp'
import efreeshopCoverPortrait from '@/assets/projects/efreeshop/cover-portrait.webp'
import efreeshopPricing from '@/assets/projects/efreeshop/pricing.webp'
import efreeshopSell from '@/assets/projects/efreeshop/sell.webp'
import etudocsFaq from '@/assets/projects/etudocs/faq.webp'
import etudocsFeatures from '@/assets/projects/etudocs/features.webp'
import etudocsHero from '@/assets/projects/etudocs/hero.webp'
import etudocsLogin from '@/assets/projects/etudocs/login.webp'
import etudocsCover from '@/assets/projects/etudocs/cover.webp'
import githubUserCover from '@/assets/projects/github-user/cover-portrait.webp'
import githubUserHero from '@/assets/projects/github-user/hero.webp'
import githubUserSearch from '@/assets/projects/github-user/search.webp'
import medicastockCover from '@/assets/projects/medicastock/cover-portrait.webp'
import medicastockHero from '@/assets/projects/medicastock/hero.webp'
import medicastockServices from '@/assets/projects/medicastock/services.webp'
import medipassCover from '@/assets/projects/medipass/cover-portrait.webp'
import medipassMenu from '@/assets/projects/medipass/menu.webp'
import portfolioCover from '@/assets/projects/portfolio/cover-portrait.webp'
import portfolioHero from '@/assets/projects/portfolio/hero.webp'
import type { Localized } from '@/data/locale'

export type ProjectPhoto = { id: string; alt: string }

export type Project = {
  name: string
  eyebrow: string
  description: string
  date: string
  photos: ProjectPhoto[]
}

type ProjectsSection = {
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
  en: { dateLabel: 'Date:' },
  fr: { dateLabel: 'Date :' },
}

export type ShowcaseShot = { src: string; alt: string }

// Projets du téléphone et du Mac : captures haute définition des vrais projets, cover en portrait (téléphone) et paysage (tablette).
export type ShowcaseProject = {
  slug: string
  // Nom du dossier du projet dans le dossier Projects du Mac.
  repo: string
  name: string
  services: string[]
  stack: string[]
  description: string
  year: string
  // Seulement pour les projets que le visiteur peut ouvrir (Efreeshop, MEDICASTOCK).
  link?: { label: string; href: string }
  cover: { portrait: string; landscape: string; alt: string }
  shots: ShowcaseShot[]
}

const EFREESHOP_URL = 'https://www.e-freeshop.com'
const MEDICASTOCK_URL = 'https://medicastock-react.vercel.app'

const STACKS = {
  efreeshop: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Drizzle ORM', 'PostgreSQL (Neon)', 'NextAuth', 'FedaPay', 'GSAP'],
  etudocs: ['React', 'Vite', 'TanStack Query', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'JWT', 'Puppeteer'],
  portfolio: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'shadcn/ui', 'Framer Motion', 'GSAP', 'Lenis', 'Vercel Functions', 'Neon'],
  medicastock: ['React', 'Vite', 'GSAP', 'Chart.js', 'Node.js', 'Express', 'PostgreSQL', 'JWT'],
  githubUser: ['React', 'Vite', 'React Router', 'Tailwind CSS', 'GitHub REST API'],
  componentsHole: ['React', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'GSAP', 'Framer Motion', 'Three.js'],
  medipass: ['C++', 'SQLite', 'Emscripten (WebAssembly)'],
  columinst: ['C++', 'Qt Widgets', 'SQLite', 'Emscripten (WebAssembly)'],
}

export const SHOWCASE_PROJECTS: Localized<ShowcaseProject[]> = {
  en: [
    {
      slug: 'efreeshop',
      repo: 'Efreeshop',
      name: 'Efreeshop',
      services: ['Web platform', 'Marketplace'],
      stack: STACKS.efreeshop,
      description:
        'Freemium platform of UI resources for frontend developers in Africa and beyond: React components, templates and digital products to browse, copy or sell, with Mobile Money payments built in.',
      year: '2026',
      link: { label: 'Visit e-freeshop.com', href: EFREESHOP_URL },
      cover: { portrait: efreeshopCoverPortrait, landscape: efreeshopCoverLandscape, alt: 'Efreeshop home page on mobile: the n°1 platform to sell components, templates and digital products' },
      shots: [
        { src: efreeshopHero, alt: 'Efreeshop home page: the n°1 platform to sell components, templates and digital products' },
        { src: efreeshopComponents, alt: 'Premium components section with a React code sample' },
        { src: efreeshopSell, alt: 'Sell your creations section: open a shop, get paid by Mobile Money' },
        { src: efreeshopPricing, alt: 'Pricing: Free, Pro and Creator plans in CFA francs' },
      ],
    },
    {
      slug: 'etudocs',
      repo: 'ETUDOCS',
      name: 'EtuDocs',
      services: ['Web app', 'Full stack'],
      stack: STACKS.etudocs,
      description:
        'Built at the HACKBYIFRI 2026 hackathon: students request their administrative documents online, follow each validation step in real time, and download authentic documents checked by QR code.',
      year: '2026',
      cover: { portrait: etudocsCover, landscape: etudocsCover, alt: '2 graduating students in cap and gown' },
      shots: [
        { src: etudocsHero, alt: 'EtuDocs home page with a preview of the student dashboard' },
        { src: etudocsFeatures, alt: 'Features: available documents, real-time tracking, authentic documents' },
        { src: etudocsFaq, alt: 'Frequently asked questions next to the dashboard' },
        { src: etudocsLogin, alt: 'EtuDocs sign-in page' },
      ],
    },
    {
      slug: 'portfolio',
      repo: 'Ikhlas-Portfolio',
      name: 'Portfolio',
      services: ['Website', 'Creative development'],
      stack: STACKS.portfolio,
      description:
        'This site: a giant hero, an interactive fake macOS that runs my projects in WebAssembly, scroll animations and a note board shared between visitors.',
      year: '2026',
      cover: { portrait: portfolioCover, landscape: portfolioHero, alt: 'Portfolio home page on mobile with the Ikhlas Agbeti name' },
      shots: [{ src: portfolioHero, alt: 'Portfolio home page with the Ikhlas A. name' }],
    },
    {
      slug: 'medicastock',
      repo: 'medicastock-react',
      name: 'MEDICASTOCK',
      services: ['Web app', 'Full stack'],
      stack: STACKS.medicastock,
      description:
        'Hospital pharmacy stock management: medicines, batches and expiry dates, stock movements, threshold alerts and statistics, behind an administrator sign-in.',
      year: '2026',
      link: { label: 'Visit the site', href: MEDICASTOCK_URL },
      cover: { portrait: medicastockCover, landscape: medicastockHero, alt: 'MEDICASTOCK home page on mobile: smart management of pharmaceutical stock' },
      shots: [
        { src: medicastockHero, alt: 'MEDICASTOCK home page: smart management of pharmaceutical stock' },
        { src: medicastockServices, alt: 'Services section: drug catalogue sorted by family' },
      ],
    },
    {
      slug: 'github-user',
      repo: 'github-user',
      name: 'github-user',
      services: ['Web app', 'API'],
      stack: STACKS.githubUser,
      description: 'Search any GitHub user and see their profile and repositories in seconds, straight from the GitHub API.',
      year: '2026',
      cover: { portrait: githubUserCover, landscape: githubUserHero, alt: 'github-user home page on mobile: discover GitHub profiles and repos' },
      shots: [
        { src: githubUserHero, alt: 'github-user home page: discover GitHub profiles and repos' },
        { src: githubUserSearch, alt: 'User search results' },
      ],
    },
    {
      slug: 'components-hole',
      repo: 'components-hole',
      name: 'components-hole',
      services: ['Component library', 'Creative development'],
      stack: STACKS.componentsHole,
      description:
        'My library of more than 300 React components rebuilt from website studies, and 12 full templates (studios, AI agencies, SaaS, finance app, portfolios): menus, heros, carousels, cursors, footers and scroll animations, each one testable full screen.',
      year: '2026',
      cover: { portrait: componentsHoleCover, landscape: componentsHoleGallery, alt: 'components-hole: Agenciy template on mobile' },
      shots: [
        { src: componentsHoleGallery, alt: 'Gallery of the components, each one opens full screen' },
        { src: componentsHoleAgenciy, alt: 'Agenciy template: creative studio home page' },
        { src: componentsHoleHanzo, alt: 'Hanzo template: design subscription for startups' },
        { src: componentsHolePoppr, alt: 'Poppr template: immersive studio home page' },
        { src: componentsHoleDetroit, alt: 'Detroit template: giant typographic hero' },
        { src: componentsHoleIntelli, alt: 'Intelli template: AI automation agency' },
        { src: componentsHoleGrainient, alt: 'Grainient template: grainy gradients marketplace' },
        { src: componentsHoleIncredibles, alt: 'Incredibles template: student documents platform' },
        { src: componentsHoleNormalboring, alt: 'Normal is Boring template: horizontal rail' },
        { src: componentsHoleNovaApp, alt: 'Nova template: finance app landing page' },
        { src: componentsHolePortfolite, alt: 'Portfolite template: designer portfolio' },
        { src: componentsHoleStackgrid, alt: 'Stackgrid template: AI agency' },
        { src: componentsHoleVerseo, alt: 'Verseo template: AI writing SaaS landing page' },
        { src: componentsHoleVoltMenu, alt: 'Volt menu open: chartreuse panel' },
        { src: componentsHoleMacbookScroll, alt: 'Macbook Scroll: a MacBook that opens on scroll' },
        { src: componentsHoleOversizedTitle, alt: 'Oversized chapter title' },
      ],
    },
    {
      slug: 'medipass',
      repo: 'MediPass',
      name: 'MediPass',
      services: ['Desktop software', 'Object-oriented programming'],
      stack: STACKS.medipass,
      description:
        'Console hospital management in C++: administrator and health professional accounts, patients, consultations and statistics, stored in SQLite. It runs in the browser through WebAssembly in the Mac on this site.',
      year: '2025',
      cover: { portrait: medipassCover, landscape: medipassMenu, alt: 'MediPass running in WebAssembly: administrator menu and statistics' },
      shots: [{ src: medipassMenu, alt: 'MediPass running in WebAssembly: administrator menu and statistics' }],
    },
    {
      slug: 'columinst',
      repo: 'Columinst',
      name: 'Columinst',
      services: ['Desktop software', 'Task manager'],
      stack: STACKS.columinst,
      description:
        'Kanban task manager in C++ and Qt: projects in tabs, editable columns and cards, search, JSON and CSV export and statistics, saved in SQLite. It runs in the browser through WebAssembly in the Mac on this site.',
      year: '2025',
      cover: { portrait: columinstCover, landscape: columinstBoard, alt: 'Columinst running in WebAssembly: a project board with its columns' },
      shots: [{ src: columinstBoard, alt: 'Columinst running in WebAssembly: a project board with its columns' }],
    },
  ],
  fr: [
    {
      slug: 'efreeshop',
      repo: 'Efreeshop',
      name: 'Efreeshop',
      services: ['Plateforme web', 'Marketplace'],
      stack: STACKS.efreeshop,
      description:
        'Plateforme freemium de ressources UI pour les développeurs frontend africains et du monde entier : composants React, templates et produits digitaux à parcourir, copier ou vendre, avec paiement Mobile Money intégré.',
      year: '2026',
      link: { label: 'Voir e-freeshop.com', href: EFREESHOP_URL },
      cover: { portrait: efreeshopCoverPortrait, landscape: efreeshopCoverLandscape, alt: 'Accueil d’Efreeshop sur mobile : la plateforme n°1 pour vendre composants, templates et produits digitaux' },
      shots: [
        { src: efreeshopHero, alt: 'Accueil d’Efreeshop : la plateforme n°1 pour vendre composants, templates et produits digitaux' },
        { src: efreeshopComponents, alt: 'Section des composants premium avec un exemple de code React' },
        { src: efreeshopSell, alt: 'Section vendre ses créations : ouvrir son stand, être payé par Mobile Money' },
        { src: efreeshopPricing, alt: 'Tarifs : offres Free, Pro et Créateur en francs CFA' },
      ],
    },
    {
      slug: 'etudocs',
      repo: 'ETUDOCS',
      name: 'EtuDocs',
      services: ['Application web', 'Full stack'],
      stack: STACKS.etudocs,
      description:
        'Réalisé au hackathon HACKBYIFRI 2026 : les étudiants demandent leurs documents administratifs en ligne, suivent chaque étape de validation en temps réel et téléchargent des documents authentifiés par QR code.',
      year: '2026',
      cover: { portrait: etudocsCover, landscape: etudocsCover, alt: '2 étudiants diplômés en toge et toque' },
      shots: [
        { src: etudocsHero, alt: 'Accueil d’EtuDocs avec un aperçu du tableau de bord étudiant' },
        { src: etudocsFeatures, alt: 'Fonctionnalités : documents disponibles, suivi en temps réel, documents authentiques' },
        { src: etudocsFaq, alt: 'Questions fréquentes à côté du tableau de bord' },
        { src: etudocsLogin, alt: 'Page de connexion d’EtuDocs' },
      ],
    },
    {
      slug: 'portfolio',
      repo: 'Ikhlas-Portfolio',
      name: 'Portfolio',
      services: ['Site web', 'Développement créatif'],
      stack: STACKS.portfolio,
      description:
        'Ce site : un hero géant, un faux macOS interactif qui fait tourner mes projets en WebAssembly, des animations au défilement et un tableau de notes partagé entre les visiteurs.',
      year: '2026',
      cover: { portrait: portfolioCover, landscape: portfolioHero, alt: 'Accueil du portfolio sur mobile avec le nom Ikhlas Agbeti' },
      shots: [{ src: portfolioHero, alt: 'Accueil du portfolio avec le nom Ikhlas A.' }],
    },
    {
      slug: 'medicastock',
      repo: 'medicastock-react',
      name: 'MEDICASTOCK',
      services: ['Application web', 'Full stack'],
      stack: STACKS.medicastock,
      description:
        'Gestion du stock de la pharmacie d’un hôpital : médicaments, lots et dates de péremption, entrées et sorties, alertes de seuil et statistiques, derrière une connexion administrateur.',
      year: '2026',
      link: { label: 'Voir le site', href: MEDICASTOCK_URL },
      cover: { portrait: medicastockCover, landscape: medicastockHero, alt: 'Accueil de MEDICASTOCK sur mobile : gestion intelligente du stock pharmaceutique' },
      shots: [
        { src: medicastockHero, alt: 'Accueil de MEDICASTOCK : gestion intelligente du stock pharmaceutique' },
        { src: medicastockServices, alt: 'Section Services : catalogue des médicaments classés par famille' },
      ],
    },
    {
      slug: 'github-user',
      repo: 'github-user',
      name: 'github-user',
      services: ['Application web', 'API'],
      stack: STACKS.githubUser,
      description: 'Recherche n’importe quel utilisateur GitHub et affiche son profil et ses repos en quelques secondes, directement depuis l’API de GitHub.',
      year: '2026',
      cover: { portrait: githubUserCover, landscape: githubUserHero, alt: 'Accueil de github-user sur mobile : découvrir profils et repos GitHub' },
      shots: [
        { src: githubUserHero, alt: 'Accueil de github-user : découvrir profils et repos GitHub' },
        { src: githubUserSearch, alt: 'Résultats d’une recherche d’utilisateur' },
      ],
    },
    {
      slug: 'components-hole',
      repo: 'components-hole',
      name: 'components-hole',
      services: ['Bibliothèque de composants', 'Développement créatif'],
      stack: STACKS.componentsHole,
      description:
        'Ma bibliothèque de plus de 300 composants React refaits à partir d’études de sites, et 12 templates complets (studios, agences IA, SaaS, app de finance, portfolios) : menus, heros, carrousels, curseurs, footers et animations au défilement, chacun testable en plein écran.',
      year: '2026',
      cover: { portrait: componentsHoleCover, landscape: componentsHoleGallery, alt: 'components-hole : template Agenciy sur mobile' },
      shots: [
        { src: componentsHoleGallery, alt: 'Galerie des composants, chacun s’ouvre en plein écran' },
        { src: componentsHoleAgenciy, alt: 'Template Agenciy : accueil d’un studio créatif' },
        { src: componentsHoleHanzo, alt: 'Template Hanzo : abonnement design pour startups' },
        { src: componentsHolePoppr, alt: 'Template Poppr : accueil immersif d’un studio' },
        { src: componentsHoleDetroit, alt: 'Template Detroit : hero typographique géant' },
        { src: componentsHoleIntelli, alt: 'Template Intelli : agence d’automatisation IA' },
        { src: componentsHoleGrainient, alt: 'Template Grainient : marketplace de dégradés grainés' },
        { src: componentsHoleIncredibles, alt: 'Template Incredibles : plateforme de documents étudiants' },
        { src: componentsHoleNormalboring, alt: 'Template Normal is Boring : rail horizontal' },
        { src: componentsHoleNovaApp, alt: 'Template Nova : landing d’une app de finance' },
        { src: componentsHolePortfolite, alt: 'Template Portfolite : portfolio de designer' },
        { src: componentsHoleStackgrid, alt: 'Template Stackgrid : agence IA' },
        { src: componentsHoleVerseo, alt: 'Template Verseo : landing d’un SaaS d’écriture IA' },
        { src: componentsHoleVoltMenu, alt: 'Menu Volt ouvert : panneau chartreuse' },
        { src: componentsHoleMacbookScroll, alt: 'Macbook Scroll : un MacBook qui s’ouvre au défilement' },
        { src: componentsHoleOversizedTitle, alt: 'Titre de chapitre géant' },
      ],
    },
    {
      slug: 'medipass',
      repo: 'MediPass',
      name: 'MediPass',
      services: ['Logiciel', 'Programmation orientée objet'],
      stack: STACKS.medipass,
      description:
        'Gestion d’hôpital en console, en C++ : comptes administrateur et professionnel de santé, patients, consultations et statistiques, enregistrés dans SQLite. Il tourne dans le navigateur grâce à WebAssembly, dans le Mac de ce site.',
      year: '2025',
      cover: { portrait: medipassCover, landscape: medipassMenu, alt: 'MediPass lancé en WebAssembly : menu administrateur et statistiques' },
      shots: [{ src: medipassMenu, alt: 'MediPass lancé en WebAssembly : menu administrateur et statistiques' }],
    },
    {
      slug: 'columinst',
      repo: 'Columinst',
      name: 'Columinst',
      services: ['Logiciel', 'Gestionnaire de tâches'],
      stack: STACKS.columinst,
      description:
        'Gestionnaire de tâches Kanban en C++ et Qt : projets en onglets, colonnes et cartes modifiables, recherche, export JSON et CSV et statistiques, enregistrés dans SQLite. Il tourne dans le navigateur grâce à WebAssembly, dans le Mac de ce site.',
      year: '2025',
      cover: { portrait: columinstCover, landscape: columinstBoard, alt: 'Columinst lancé en WebAssembly : tableau de projet et ses colonnes' },
      shots: [{ src: columinstBoard, alt: 'Columinst lancé en WebAssembly : tableau de projet et ses colonnes' }],
    },
  ],
}

type ProjectPageText = {
  sectionTitle: string
  certificationsLink: string
  back: string
  description: string
  services: string
  stack: string
  year: string
  link: string
}

// Version mobile de la home (liste de projets en défilement horizontal) et page d'un projet (réf. haufsess.com).
export const PROJECT_PAGE: Localized<ProjectPageText> = {
  en: {
    sectionTitle: 'Selected Projects',
    certificationsLink: 'See my certifications',
    back: 'Back',
    description: 'Description',
    services: 'Services',
    stack: 'Stack',
    year: 'Year',
    link: 'Link',
  },
  fr: {
    sectionTitle: 'Projets sélectionnés',
    certificationsLink: 'Voir mes certifications',
    back: 'Retour',
    description: 'Description',
    services: 'Services',
    stack: 'Stack technique',
    year: 'Année',
    link: 'Lien',
  },
}
