import type { Localized } from '@/data/locale'
import type { ExperiencePeriod } from '@/logic/experiencePeriod/experiencePeriod'

export type ExperienceItem = {
  company: string
  role: string
  period: ExperiencePeriod
  highlights: string[]
}

type ExperienceContent = {
  title: string
  items: ExperienceItem[]
}

const ZSQUARES_PERIOD = { start: { year: 2026, month: 8 }, end: { year: 2026, month: 9 } }
const COMPRINT_PERIOD = { start: { year: 2025, month: 12 }, end: { year: 2026, month: 3 } }
const SOCIALOOP_PERIOD = { start: { year: 2025, month: 7 }, end: { year: 2025, month: 9 } }

export const EXPERIENCE: Localized<ExperienceContent> = {
  en: {
    title: 'Experiences',
    items: [
      {
        company: 'Zsquares Sol Inc',
        role: 'Developer',
        period: ZSQUARES_PERIOD,
        highlights: [
          'Set up a WhatsApp agent for customer service.',
          'Built a workflow that sends the newsletter automatically.',
        ],
      },
      {
        company: 'Comprint FR',
        role: 'Developer',
        period: COMPRINT_PERIOD,
        highlights: ['Developed and maintained client web applications with Next.js and WordPress.'],
      },
      {
        company: 'Socialoop EU',
        role: 'Developer',
        period: SOCIALOOP_PERIOD,
        highlights: [
          'Worked with design teams to build intuitive user interfaces.',
          'Designed automations and AI agents: CRM agents, automated LinkedIn posting, personal assistants.',
        ],
      },
    ],
  },
  fr: {
    title: 'Expériences',
    items: [
      {
        company: 'Zsquares Sol Inc',
        role: 'Développeur',
        period: ZSQUARES_PERIOD,
        highlights: [
          "Mise en place d'un agent WhatsApp pour le service client.",
          "Création d'un workflow d'envoi automatique de newsletter.",
        ],
      },
      {
        company: 'Comprint FR',
        role: 'Développeur',
        period: COMPRINT_PERIOD,
        highlights: ["Développement et maintenance d'applications web clientes avec Next.js et WordPress."],
      },
      {
        company: 'Socialoop EU',
        role: 'Développeur',
        period: SOCIALOOP_PERIOD,
        highlights: [
          'Collaboration avec les équipes de conception pour créer des interfaces utilisateur intuitives.',
          "Conception d'automatisations et d'agents IA : agents CRM, publication automatisée sur LinkedIn, assistants personnels.",
        ],
      },
    ],
  },
}
