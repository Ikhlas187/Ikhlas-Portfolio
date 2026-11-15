import type { Localized } from '@/data/locale'
import type { NavLink } from '@/data/site'

type HeroContent = {
  name: string
  fullName: string
  badgeLabel: string
  location: string
  availability: string
  establishedLabel: string
  establishedYear: string
  tagline: string
  ctaLabel: string
}

type HeaderContent = {
  avatarLabel: string
  homeLink: NavLink
  navLabel: string
  openMenuLabel: string
  closeMenuLabel: string
}

export const HERO: Localized<HeroContent> = {
  en: {
    name: 'Ikhlas A.',
    fullName: 'Ikhlas Agbeti',
    badgeLabel: 'Badge with a photo of Ikhlas Agbeti, hanging from a lanyard: drag it to move it, scroll to flip it and enter it.',
    location: 'Based in Lille',
    availability: 'Available worldwide',
    establishedLabel: 'ESTD',
    establishedYear: '2024',
    tagline: 'Web developer building websites, apps and automations.',
    ctaLabel: 'Start a project',
  },
  fr: {
    name: 'Ikhlas A.',
    fullName: 'Ikhlas Agbeti',
    badgeLabel: 'Badge avec une photo d’Ikhlas Agbeti, suspendu à un cordon : glissez-le pour le déplacer, faites défiler pour le retourner et entrer dedans.',
    location: 'Basé à Lille',
    availability: 'Disponible partout dans le monde',
    establishedLabel: 'Depuis',
    establishedYear: '2024',
    tagline: 'Développeur web qui crée des sites, des applications et des automatisations.',
    ctaLabel: 'Démarrer un projet',
  },
}

export const HEADER: Localized<HeaderContent> = {
  en: {
    avatarLabel: 'Ikhlas Agbeti',
    homeLink: { label: 'Welcome', href: '#top' },
    navLabel: 'Main',
    openMenuLabel: 'Open menu',
    closeMenuLabel: 'Close menu',
  },
  fr: {
    avatarLabel: 'Ikhlas Agbeti',
    homeLink: { label: 'Accueil', href: '#top' },
    navLabel: 'Principale',
    openMenuLabel: 'Ouvrir le menu',
    closeMenuLabel: 'Fermer le menu',
  },
}
