export type Service = {
  num: string
  title: string
  desc: string
  photo: string
  alt: string
}

export const SERVICES: Service[] = [
  {
    num: '[01]',
    title: 'SaaS Development',
    desc: "Je construis des applications SaaS complètes : authentification, abonnements, tableau de bord et API. Node, Express ou Laravel côté serveur, PostgreSQL en base, et une interface React qui suit le produit à mesure qu'il grandit.",
    photo: '1551650975-87deedd944c3',
    alt: "Tableau de bord d'application affiché sur téléphone et ordinateur",
  },
  {
    num: '[02]',
    title: 'Sites Vitrines & Portfolios',
    desc: 'Sites de présentation et portfolios pensés pour convertir : structure claire, contenu éditorial, référencement propre et administration simple. Livrés en React ou WordPress selon qui va gérer le contenu ensuite.',
    photo: '1481487196290-c152efe083f5',
    alt: 'Site vitrine ouvert dans un navigateur sur un ordinateur portable',
  },
  {
    num: '[03]',
    title: 'Frontend Engineering',
    desc: 'Intégration au pixel depuis vos maquettes Figma, du mobile au grand écran. React, TypeScript, Tailwind, animations GSAP. Accessibilité, performance et compatibilité navigateurs traitées pendant le build, pas après.',
    photo: '1498050108023-c5249f4df085',
    alt: 'Éditeur de code ouvert sur un ordinateur portable',
  },
  {
    num: '[04]',
    title: 'IA & Automatisation',
    desc: 'Je relie vos outils et je retire les tâches répétées du chemin : scénarios Make ou n8n, webhooks, agents IA connectés à vos données. Conteneurisation Docker et intégration continue quand il faut industrialiser.',
    photo: '1518770660439-4636190af475',
    alt: 'Carte électronique vue de près',
  },
]

export const SERVICES_SECTION = {
  title: 'services',
  label: 'Ce que je fais',
  scrollText: 'Défiler',
}
