import type { Localized } from '@/data/locale'

export type NavLink = { label: string; href: string }

export const SITE = {
  name: 'Ikhlas Olamidé',
  url: 'https://ikhlas.studio',
  email: 'olaagb40@gmail.com',
  // Lien de réservation Cal.com (utilisateur/type d'événement) : à remplacer par le vrai lien une fois le compte créé.
  calLink: 'ikhlas-agbeti/30min',
  socials: {
    github: 'https://github.com/Ikhlas187',
    linkedin: 'https://www.linkedin.com/in/ikhlas-agbeti-28b866349/',
  },
}

export const SITE_META: Localized<{ title: string; description: string }> = {
  en: {
    title: 'Ikhlas Olamidé · Creative Designer & Developer',
    description: 'Creative designer and developer focused on branding and memorable web experiences.',
  },
  fr: {
    title: 'Ikhlas Olamidé · Designer & Développeur Créatif',
    description: 'Designer & Développeur Créatif spécialisé en branding et expériences web mémorables.',
  },
}

export const NAV_LINKS: Localized<NavLink[]> = {
  en: [
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  fr: [
    { label: 'Projets', href: '/projects' },
    { label: 'À propos', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
}
