import type { Localized } from '@/data/locale'
import type { NavLink } from '@/data/site'

type HeroContent = {
  name: string
  fullName: string
  role: string
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
    role: 'Web developer studying in Lille',
  },
  fr: {
    name: 'Ikhlas A.',
    fullName: 'Ikhlas Agbeti',
    role: 'Développeur web, étudiant à Lille',
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
