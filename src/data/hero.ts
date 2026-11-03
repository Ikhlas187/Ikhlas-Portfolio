import type { Localized } from '@/data/locale'
import type { NavLink } from '@/data/site'

type HeroContent = {
  name: string
  tagline: string
  photoId: string
  photoAlt: string
}

type HeaderContent = {
  avatarInitials: string
  avatarLabel: string
  homeLink: NavLink
  navLabel: string
  openMenuLabel: string
  closeMenuLabel: string
}

export const HERO: Localized<HeroContent> = {
  en: {
    name: 'IKHLAS AGBETI',
    tagline: 'Fast, readable products with character in every pixel.',
    photoId: '1555066931-4365d14bab8c',
    photoAlt: 'Lines of code on a dark screen',
  },
  fr: {
    name: 'IKHLAS AGBETI',
    tagline: 'Des produits rapides et lisibles, avec du caractère dans chaque pixel.',
    photoId: '1555066931-4365d14bab8c',
    photoAlt: 'Lignes de code sur un écran sombre',
  },
}

export const HEADER: Localized<HeaderContent> = {
  en: {
    avatarInitials: 'IA',
    avatarLabel: 'Ikhlas Agbeti',
    homeLink: { label: 'Welcome', href: '/' },
    navLabel: 'Main',
    openMenuLabel: 'Open menu',
    closeMenuLabel: 'Close menu',
  },
  fr: {
    avatarInitials: 'IA',
    avatarLabel: 'Ikhlas Agbeti',
    homeLink: { label: 'Accueil', href: '/' },
    navLabel: 'Principale',
    openMenuLabel: 'Ouvrir le menu',
    closeMenuLabel: 'Fermer le menu',
  },
}
