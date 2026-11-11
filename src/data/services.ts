import type { Localized } from '@/data/locale'

export type ToolId =
  | 'node'
  | 'laravel'
  | 'postgresql'
  | 'react'
  | 'restApi'
  | 'wordpress'
  | 'seo'
  | 'figma'
  | 'vercel'
  | 'typescript'
  | 'tailwind'
  | 'gsap'
  | 'n8n'
  | 'make'
  | 'webhooks'
  | 'aiAgents'
  | 'docker'

export type Service = {
  num: string
  title: string
  desc: string
  tools: ToolId[]
  photo: string
  alt: string
}

type ServicesSection = {
  title: string
  toolsLabel: string
}

export const SERVICES: Localized<Service[]> = {
  en: [
    {
      num: '01',
      title: 'SaaS Development',
      desc: 'I build complete SaaS applications: authentication, subscriptions, dashboards and APIs. Node, Express or Laravel on the server, PostgreSQL for data, and a React interface that keeps up as the product grows.',
      photo: '1551650975-87deedd944c3',
      tools: ['node', 'laravel', 'postgresql', 'react', 'restApi'],
      alt: 'App dashboard shown on a phone and a computer',
    },
    {
      num: '02',
      title: 'Showcase Sites & Portfolios',
      desc: 'Showcase sites and portfolios built to convert: clear structure, editorial content, clean SEO and simple administration. Delivered in React or WordPress, depending on who will manage the content.',
      photo: '1481487196290-c152efe083f5',
      tools: ['react', 'wordpress', 'seo', 'figma', 'vercel'],
      alt: 'Showcase site open in a browser on a laptop',
    },
    {
      num: '03',
      title: 'Frontend Engineering',
      desc: 'Pixel-perfect builds from your Figma mockups, from mobile to large screens. React, TypeScript, Tailwind, GSAP animations. Accessibility, performance and browser support handled during the build, not after.',
      photo: '1498050108023-c5249f4df085',
      tools: ['figma', 'react', 'typescript', 'tailwind', 'gsap'],
      alt: 'Code editor open on a laptop',
    },
    {
      num: '04',
      title: 'AI & Automation',
      desc: 'I connect your tools and take repetitive tasks off your plate: Make or n8n scenarios, webhooks, AI agents connected to your data. Docker and continuous integration when it is time to scale.',
      photo: '1518770660439-4636190af475',
      tools: ['n8n', 'make', 'webhooks', 'aiAgents', 'docker'],
      alt: 'Close-up of a circuit board',
    },
  ],
  fr: [
    {
      num: '01',
      title: 'Développement SaaS',
      desc: 'Je construis des applications SaaS complètes : authentification, abonnements, tableau de bord et API. Node, Express ou Laravel côté serveur, PostgreSQL en base, et une interface React qui suit le produit à mesure qu’il grandit.',
      photo: '1551650975-87deedd944c3',
      tools: ['node', 'laravel', 'postgresql', 'react', 'restApi'],
      alt: 'Tableau de bord d’application affiché sur téléphone et ordinateur',
    },
    {
      num: '02',
      title: 'Sites Vitrines & Portfolios',
      desc: 'Sites de présentation et portfolios pensés pour convertir : structure claire, contenu éditorial, référencement propre et administration simple. Livrés en React ou WordPress selon qui va gérer le contenu ensuite.',
      photo: '1481487196290-c152efe083f5',
      tools: ['react', 'wordpress', 'seo', 'figma', 'vercel'],
      alt: 'Site vitrine ouvert dans un navigateur sur un ordinateur portable',
    },
    {
      num: '03',
      title: 'Intégration Frontend',
      desc: 'Intégration au pixel depuis vos maquettes Figma, du mobile au grand écran. React, TypeScript, Tailwind, animations GSAP. Accessibilité, performance et compatibilité navigateurs traitées pendant le build, pas après.',
      photo: '1498050108023-c5249f4df085',
      tools: ['figma', 'react', 'typescript', 'tailwind', 'gsap'],
      alt: 'Éditeur de code ouvert sur un ordinateur portable',
    },
    {
      num: '04',
      title: 'IA & Automatisation',
      desc: 'Je relie vos outils et je retire les tâches répétées du chemin : scénarios Make ou n8n, webhooks, agents IA connectés à vos données. Conteneurisation Docker et intégration continue quand il faut industrialiser.',
      photo: '1518770660439-4636190af475',
      tools: ['n8n', 'make', 'webhooks', 'aiAgents', 'docker'],
      alt: 'Carte électronique vue de près',
    },
  ],
}

export const SERVICES_SECTION: Localized<ServicesSection> = {
  en: { title: 'Services', toolsLabel: 'Tools' },
  fr: { title: 'Services', toolsLabel: 'Outils' },
}

export const TOOL_NAMES: Localized<Record<ToolId, string>> = {
  en: {
    node: 'Node.js & Express',
    laravel: 'Laravel',
    postgresql: 'PostgreSQL',
    react: 'React',
    restApi: 'REST APIs',
    wordpress: 'WordPress',
    seo: 'SEO',
    figma: 'Figma',
    vercel: 'Vercel',
    typescript: 'TypeScript',
    tailwind: 'Tailwind CSS',
    gsap: 'GSAP',
    n8n: 'n8n',
    make: 'Make',
    webhooks: 'Webhooks',
    aiAgents: 'AI agents',
    docker: 'Docker',
  },
  fr: {
    node: 'Node.js & Express',
    laravel: 'Laravel',
    postgresql: 'PostgreSQL',
    react: 'React',
    restApi: 'API REST',
    wordpress: 'WordPress',
    seo: 'SEO',
    figma: 'Figma',
    vercel: 'Vercel',
    typescript: 'TypeScript',
    tailwind: 'Tailwind CSS',
    gsap: 'GSAP',
    n8n: 'n8n',
    make: 'Make',
    webhooks: 'Webhooks',
    aiAgents: 'Agents IA',
    docker: 'Docker',
  },
}
