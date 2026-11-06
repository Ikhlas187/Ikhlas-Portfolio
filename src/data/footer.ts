import type { Localized } from '@/data/locale'
import { SITE } from '@/data/site'

export type FooterLink = { label: string; href: string; isExternal?: boolean }

export type FooterColumn = { title: string; links: FooterLink[] }

type FooterContent = {
  callTitle: string
  columns: FooterColumn[]
  copyright: string
  credit: string
}

const EMAIL_LINK = `mailto:${SITE.email}`

export const FOOTER: Localized<FooterContent> = {
  en: {
    callTitle: 'Book a call with me',
    columns: [
      {
        title: 'Navigation',
        links: [
          { label: 'Home', href: '#top' },
          { label: 'About', href: '#about' },
          { label: 'Experiences', href: '#experience' },
          { label: 'Services', href: '#services' },
        ],
      },
      {
        title: 'Services',
        links: [
          { label: 'SaaS Development', href: '#services' },
          { label: 'Showcase Sites & Portfolios', href: '#services' },
          { label: 'Frontend Engineering', href: '#services' },
          { label: 'AI & Automation', href: '#services' },
        ],
      },
      {
        title: 'Contact',
        links: [
          { label: SITE.email, href: EMAIL_LINK },
          { label: 'Book a call', href: '#contact' },
          { label: 'Pin a note', href: '#notes' },
        ],
      },
      {
        title: 'Social',
        links: [
          { label: 'GitHub', href: SITE.socials.github, isExternal: true },
          { label: 'LinkedIn', href: SITE.socials.linkedin, isExternal: true },
        ],
      },
    ],
    copyright: '© 2026 Ikhlas Agbeti. All rights reserved.',
    credit: 'Designed & built by Ikhlas',
  },
  fr: {
    callTitle: 'Prendre rendez-vous avec moi',
    columns: [
      {
        title: 'Navigation',
        links: [
          { label: 'Accueil', href: '#top' },
          { label: 'À propos', href: '#about' },
          { label: 'Expériences', href: '#experience' },
          { label: 'Services', href: '#services' },
        ],
      },
      {
        title: 'Services',
        links: [
          { label: 'Développement SaaS', href: '#services' },
          { label: 'Sites Vitrines & Portfolios', href: '#services' },
          { label: 'Intégration Frontend', href: '#services' },
          { label: 'IA & Automatisation', href: '#services' },
        ],
      },
      {
        title: 'Contact',
        links: [
          { label: SITE.email, href: EMAIL_LINK },
          { label: 'Prendre rendez-vous', href: '#contact' },
          { label: 'Épingler une note', href: '#notes' },
        ],
      },
      {
        title: 'Réseaux',
        links: [
          { label: 'GitHub', href: SITE.socials.github, isExternal: true },
          { label: 'LinkedIn', href: SITE.socials.linkedin, isExternal: true },
        ],
      },
    ],
    copyright: '© 2026 Ikhlas Agbeti. Tous droits réservés.',
    credit: 'Conçu et développé par Ikhlas',
  },
}
