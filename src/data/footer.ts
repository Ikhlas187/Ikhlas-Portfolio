import type { Localized } from '@/data/locale'

export type BookingMailLabels = { subject: string; body: string }

type FooterContent = {
  pitch: string
  contactLine: string
  emailLabel: string
  githubLabel: string
  linkedinLabel: string
  copyright: string
  booking: {
    previousMonthLabel: string
    nextMonthLabel: string
    weekDays: string[]
    hour12Label: string
    hour24Label: string
    slotsLabel: string
    mail: BookingMailLabels
  }
}

export const FOOTER: Localized<FooterContent> = {
  en: {
    pitch: "Let's talk about your project, wherever you are.",
    contactLine: 'Prefer to skip the call? Write to me by email or find me on GitHub.',
    emailLabel: 'olaagb40@gmail.com',
    githubLabel: 'GitHub',
    linkedinLabel: 'LinkedIn',
    copyright: '© 2026 Ikhlas Agbeti.',
    booking: {
      previousMonthLabel: 'Previous month',
      nextMonthLabel: 'Next month',
      weekDays: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
      hour12Label: '12h',
      hour24Label: '24h',
      slotsLabel: 'Available times',
      mail: {
        subject: 'Call request · {date}',
        body: 'Hi Ikhlas,\n\nI would like to book a call on {date} at {time}.\n\n',
      },
    },
  },
  fr: {
    pitch: 'Parlons de votre projet, où que vous soyez.',
    contactLine: "Vous préférez éviter l'appel ? Écrivez-moi par email ou retrouvez-moi sur GitHub.",
    emailLabel: 'olaagb40@gmail.com',
    githubLabel: 'GitHub',
    linkedinLabel: 'LinkedIn',
    copyright: '© 2026 Ikhlas Agbeti.',
    booking: {
      previousMonthLabel: 'Mois précédent',
      nextMonthLabel: 'Mois suivant',
      weekDays: ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'],
      hour12Label: '12h',
      hour24Label: '24h',
      slotsLabel: 'Créneaux disponibles',
      mail: {
        subject: "Demande d'appel · {date}",
        body: "Bonjour Ikhlas,\n\nJe souhaiterais réserver un appel le {date} à {time}.\n\n",
      },
    },
  },
}
