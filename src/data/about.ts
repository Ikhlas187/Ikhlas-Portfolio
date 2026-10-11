export type AboutSegment = string | { highlight: string } | { link: string; href: string } | { quote: string }

export const ABOUT = {
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
      { link: 'Comprint', href: 'https://comprint.bj' },
      ' as a developer, where I got to build across design and web: everything from user interfaces to a full Django application. Later I joined ',
      { link: 'Socialoop', href: 'https://socialoop.eu' },
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
  ] satisfies AboutSegment[][],
}

export const CALL_WIDGET = {
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
  ariaReopen: "Rouvrir la carte d'appel",
  ariaDecline: "Refuser l'appel",
  ariaAccept: 'Répondre : écrire un message',
  ariaCloseForm: 'Fermer le formulaire',
}
