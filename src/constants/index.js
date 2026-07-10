export const SITE = {
  name: 'Ikhlas Olamidé',
  title: 'Ikhlas Olamidé — Designer & Développeur Créatif',
  description: 'Designer & Développeur Créatif spécialisé en branding et expériences web mémorables.',
  url: 'https://ikhlas.studio',
  email: 'hello@ikhlas.studio',
  socials: {
    github:   'https://github.com/ikhlasonlamide',
    linkedin: 'https://linkedin.com/in/ikhlasonlamide',
  },
};

export const NAV_LINKS = [
  { label: 'Projets', href: '/projects' },
  { label: 'About',   href: '/about'    },
  { label: 'Contact', href: '/contact'  },
];

export const ROUTES = {
  HOME:     '/',
  PROJECTS: '/projects',
  PROJECT:  '/projects/:slug',
  ABOUT:    '/about',
  CONTACT:  '/contact',
};

export const ANIMATION = {
  duration: { fast: 0.2, base: 0.6, slow: 1.0, xslow: 1.4 },
  ease: {
    outExpo:   'power4.out',
    inOutExpo: 'power4.inOut',
    elastic:   'elastic.out(1, 0.5)',
  },
  variants: {
    fadeUp: {
      hidden:  { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    },
    fadeIn: {
      hidden:  { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.6 } },
    },
    staggerContainer: {
      hidden:  {},
      visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
    },
  },
};

export const PROJECTS = [
  {
    id: 1, slug: 'projet-1', title: 'Projet 01',
    category: 'Branding', year: '2024',
    description: 'Description courte du projet.',
    tags: ['Branding', 'Identity', 'Web'],
    color: '#E8530A', featured: true,
  },
  {
    id: 2, slug: 'projet-2', title: 'Projet 02',
    category: 'Web', year: '2024',
    description: 'Description courte du projet.',
    tags: ['React', 'GSAP', 'WebGL'],
    color: '#00E5A0', featured: true,
  },
];
