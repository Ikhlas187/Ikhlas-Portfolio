import type { Localized } from '@/data/locale'

type ProcessStep = { n: string; title: string; text: string }

type ProcessContent = {
  headline: [string, string]
  cta: string
  steps: ProcessStep[]
}

export const PROCESS: Localized<ProcessContent> = {
  en: {
    headline: ['We don’t work for your team', 'we become part of it.'],
    cta: 'Schedule your call',
    steps: [
      { n: '01', title: 'Schedule your call', text: 'A quick, honest conversation, no pitch decks, no fluff.' },
      { n: '02', title: 'Subscribe to the plan', text: 'Pick a plan that fits where you are today. No lock-in.' },
      { n: '03', title: 'We ship in iterations', text: 'Weekly cycles, tight feedback loops.' },
      { n: '04', title: 'Repeat', text: "The longer we're in, the sharper we get." },
    ],
  },
  fr: {
    headline: ['Nous ne travaillons pas pour votre équipe', 'nous en faisons partie.'],
    cta: 'Planifiez votre appel',
    steps: [
      { n: '01', title: 'Planifiez votre appel', text: 'Une conversation courte et honnête, sans présentation commerciale ni blabla.' },
      { n: '02', title: 'Choisissez la formule', text: 'Prenez la formule adaptée à votre situation actuelle. Sans engagement.' },
      { n: '03', title: 'Nous livrons par itérations', text: 'Des cycles d’une semaine, des retours rapides.' },
      { n: '04', title: 'On recommence', text: 'Plus on avance ensemble, plus on devient précis.' },
    ],
  },
}
