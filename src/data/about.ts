import type { Localized } from '@/data/locale'

export type AboutSegment = string | { highlight: string } | { link: string; href: string } | { quote: string }

type AboutContent = {
  kicker: string
  label: string
  paragraphs: AboutSegment[][]
}

type CallWidgetContent = {
  initials: string
  greeting: string
  name: string
  emailLabel: string
  emailPlaceholder: string
  messageLabel: string
  messagePlaceholder: string
  sendLabels: Record<'idle' | 'sending' | 'sent' | 'error', string>
  ariaReopen: string
  ariaDecline: string
  ariaAccept: string
  ariaCloseForm: string
}

const COMPRINT = { link: 'Comprint', href: 'https://comprint.bj' }
const SOCIALOOP = { link: 'Socialoop', href: 'https://socialoop.eu' }

export const ABOUT: Localized<AboutContent> = {
  en: {
    kicker: 'Inside my little life',
    label: 'About',
    paragraphs: [
      [
        'I first stumbled into code at 16, tinkering with HTML and small scripts between school assignments. Though I went on to study software engineering at IFRI, curiosity always had a quiet, persistent pull. I spent my evenings building side projects, ',
        { highlight: 'chasing curiosity over convention' },
        '.',
      ],
      [
        'I then joined ',
        COMPRINT,
        ' as a developer, where I got to build across design and web: everything from user interfaces to a full Django application. Later I joined ',
        SOCIALOOP,
        ' as a junior developer, building ',
        { highlight: 'automations and AI agents' },
        ' for a remote-first European team.',
      ],
      [
        'Then automation changed how I work. With Make and n8n I started wiring CRM agents, LinkedIn publishing flows and personal assistants. Afterall, ',
        { quote: '“You learn more by shipping than by planning.”' },
        ' Every project on this page comes from that habit. Now I’m curious, pragmatic, and a little more patient.',
      ],
      [
        'As I step further into work and life, I’m not just asking what I want to build next, but how I want to build it: fast, readable, with ',
        { highlight: 'character in every pixel' },
        '.',
      ],
    ],
  },
  fr: {
    kicker: 'Un peu de ma vie',
    label: 'À propos',
    paragraphs: [
      [
        'J’ai découvert le code à 16 ans, en bricolant du HTML et de petits scripts entre deux devoirs. J’ai ensuite étudié le génie logiciel à l’IFRI, mais la curiosité m’a toujours attiré, doucement et sans relâche. Je passais mes soirées à construire des projets perso, ',
        { highlight: 'en préférant la curiosité aux conventions' },
        '.',
      ],
      [
        'J’ai ensuite rejoint ',
        COMPRINT,
        ' comme développeur, entre design et web : des interfaces utilisateur jusqu’à une application Django complète. Plus tard, j’ai rejoint ',
        SOCIALOOP,
        ' comme développeur junior, pour y construire des ',
        { highlight: 'automatisations et des agents IA' },
        ' au sein d’une équipe européenne qui travaille à distance.',
      ],
      [
        'Puis l’automatisation a changé ma façon de travailler. Avec Make et n8n, j’ai commencé à câbler des agents CRM, des flux de publication LinkedIn et des assistants personnels. Après tout, ',
        { quote: '« On apprend plus en livrant qu’en planifiant. »' },
        ' Chaque projet de cette page vient de cette habitude. Aujourd’hui, je suis curieux, pragmatique, et un peu plus patient.',
      ],
      [
        'À mesure que j’avance dans le travail et dans la vie, je ne me demande plus seulement ce que je veux construire ensuite, mais comment je veux le construire : rapide, lisible, avec ',
        { highlight: 'du caractère dans chaque pixel' },
        '.',
      ],
    ],
  },
}

export const CALL_WIDGET: Localized<CallWidgetContent> = {
  en: {
    initials: 'IK',
    greeting: 'Hey',
    name: 'I’m Ikhlas',
    emailLabel: 'Your email',
    emailPlaceholder: 'you@example.com',
    messageLabel: 'Your message',
    messagePlaceholder: 'Hi Ikhlas, let’s talk about…',
    sendLabels: {
      idle: 'Send',
      sending: 'Sending…',
      sent: 'Sent, thank you!',
      error: 'Failed, retry',
    },
    ariaReopen: 'Reopen the call card',
    ariaDecline: 'Decline the call',
    ariaAccept: 'Answer: write a message',
    ariaCloseForm: 'Close the form',
  },
  fr: {
    initials: 'IK',
    greeting: 'Salut',
    name: 'Moi, c’est Ikhlas',
    emailLabel: 'Votre e-mail',
    emailPlaceholder: 'vous@exemple.com',
    messageLabel: 'Votre message',
    messagePlaceholder: 'Bonjour Ikhlas, parlons de…',
    sendLabels: {
      idle: 'Envoyer',
      sending: 'Envoi…',
      sent: 'Envoyé, merci !',
      error: 'Échec, réessayer',
    },
    ariaReopen: 'Rouvrir la carte d’appel',
    ariaDecline: 'Refuser l’appel',
    ariaAccept: 'Répondre : écrire un message',
    ariaCloseForm: 'Fermer le formulaire',
  },
}
