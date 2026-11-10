import type { Localized } from '@/data/locale'
import { SITE } from '@/data/site'

// CV d'Ikhlas : affiché dans l'Aperçu du faux macOS (CV.pdf) et source des dossiers Skills et Certifications.

export type CvSkillGroup = { id: string; name: string; skills: string[] }
// year : à remplir avec l'année du certificat ; photo : src/assets/certifications/<id>.(webp|jpg|png).
export type CvCertification = { id: string; title: string; issuer: string; year?: string }
export type CvExperience = { role: string; company: string; period: string; tasks: string[] }
export type CvProject = { name: string; summary: string; stack: string }
export type CvEducation = { degree: string; school: string; period: string }
export type CvLanguage = { name: string; level: string }

export type CvContent = {
  name: string
  headline: string
  contacts: { label: string; value: string }[]
  headings: Record<
    'profile' | 'skills' | 'experience' | 'projects' | 'education' | 'certifications' | 'languages' | 'interests',
    string
  >
  profile: string
  skillGroups: CvSkillGroup[]
  experiences: CvExperience[]
  projects: CvProject[]
  education: CvEducation[]
  certifications: CvCertification[]
  languages: CvLanguage[]
  interests: string[]
  // Libellés de la carte d'une certification ouverte dans l'Aperçu.
  certificate: { label: string; awardedTo: string; issuedBy: string }
}

const CONTACTS = [
  { label: 'E-mail', value: SITE.email },
  { label: 'GitHub', value: SITE.socials.github.replace('https://', '') },
  { label: 'LinkedIn', value: SITE.socials.linkedin.replace('https://www.', '').replace(/\/$/, '') },
]

export const CV: Localized<CvContent> = {
  en: {
    name: 'Ikhlas AGBETI',
    headline: 'Computer science student, web development & AI automation',
    contacts: CONTACTS,
    headings: {
      profile: 'Profile',
      skills: 'Skills',
      experience: 'Experience',
      projects: 'Projects',
      education: 'Education',
      certifications: 'Certifications',
      languages: 'Languages',
      interests: 'Interests',
    },
    profile:
      'Computer science student passionate about new technologies and programming, looking for an internship or a student job in web development and automation. Curious, autonomous and motivated, with 3 developer assignments behind me (Next.js, WordPress, AI agents) and skills in web development, algorithms and databases.',
    skillGroups: [
      {
        id: 'languages',
        name: 'Languages',
        skills: ['JavaScript', 'Python', 'C', 'C++', 'Java', 'SQL', 'PHP', 'HTML/CSS'],
      },
      { id: 'frontend', name: 'Frontend', skills: ['React', 'Next.js', 'Tailwind CSS', 'WordPress'] },
      {
        id: 'backend',
        name: 'Backend and databases',
        skills: ['Express.js', 'Django', 'PHP', 'PostgreSQL', 'MySQL', 'REST API'],
      },
      {
        id: 'automation',
        name: 'Automation and AI',
        skills: ['Make', 'n8n', 'Relevance AI', 'Claude', 'AI agents', 'Webhooks'],
      },
      { id: 'methods', name: 'Methods', skills: ['Agile', 'Teamwork'] },
    ],
    experiences: [
      {
        role: 'Developer',
        company: 'Zsquares Sol Inc',
        period: 'Aug 2026 – Sep 2026',
        tasks: ['WhatsApp agent for customer service', 'Workflow that sends the newsletter automatically'],
      },
      {
        role: 'Developer',
        company: 'Comprint FR',
        period: 'Dec 2025 – Mar 2026',
        tasks: ['Development and maintenance of client web applications with Next.js and WordPress'],
      },
      {
        role: 'Developer',
        company: 'Socialoop EU',
        period: 'Jul 2025 – Sep 2025',
        tasks: [
          'User interfaces built with the design teams',
          'Automations and AI agents: CRM agents, automated LinkedIn publishing, personal assistants',
        ],
      },
    ],
    projects: [
      { name: 'EfreeShop', summary: 'Store for components, templates and digital products', stack: '' },
      { name: 'EtuDocs', summary: 'Management of administrative documents', stack: 'React, Express.js' },
      { name: 'MedicaStock', summary: 'Pharmaceutical stock management', stack: 'React, PHP' },
      { name: 'Comunist', summary: 'Census of the local skills of a town', stack: 'React, PHP' },
      { name: 'Nevora', summary: 'Clothing store', stack: 'React, Express.js' },
      { name: 'BudgetPro', summary: 'Personal budget desktop application', stack: 'Java, SceneBuilder' },
    ],
    education: [
      { degree: 'Bachelor year 1, Mathematics and Computer Science', school: 'Université de Lille', period: '2026 – 2027' },
      { degree: 'Bachelor year 2, Software Engineering', school: 'IFRI', period: '2025 – 2026' },
      { degree: 'Baccalauréat, series D', school: '', period: '2024' },
    ],
    certifications: [
      { id: 'python-mind-luster', title: 'Python', issuer: 'Mind Luster' },
      { id: 'sql-intermediate', title: 'SQL Intermediate', issuer: 'Sololearn' },
      { id: 'web-development', title: 'Web Development', issuer: 'Sololearn' },
      { id: 'python-developer', title: 'Python Developer', issuer: 'Sololearn' },
      { id: 'make-basics', title: 'Make Academy Basics', issuer: 'Make' },
      { id: 'make-intermediate', title: 'Make Academy Intermediate', issuer: 'Make' },
      { id: 'make-advanced', title: 'Make Academy Advanced', issuer: 'Make' },
    ],
    languages: [
      { name: 'French', level: 'Advanced' },
      { name: 'English', level: 'Intermediate' },
    ],
    interests: ['Music', 'Tech podcasts', 'Gaming', 'Sport'],
    certificate: { label: 'Certificate of completion', awardedTo: 'Awarded to', issuedBy: 'Issued by' },
  },
  fr: {
    name: 'Ikhlas AGBETI',
    headline: 'Étudiant en informatique, développement web & automatisation IA',
    contacts: CONTACTS,
    headings: {
      profile: 'Profil',
      skills: 'Compétences',
      experience: 'Expériences',
      projects: 'Projets',
      education: 'Formation',
      certifications: 'Certifications',
      languages: 'Langues',
      interests: 'Centres d’intérêt',
    },
    profile:
      'Étudiant en informatique passionné par les nouvelles technologies et la programmation, je recherche un stage ou un job étudiant en développement web et automatisation. Curieux, autonome et motivé, j’ai mené 3 missions de développeur (Next.js, WordPress, agents IA) et j’ai des compétences en développement web, algorithmique et bases de données.',
    skillGroups: [
      {
        id: 'languages',
        name: 'Langages',
        skills: ['JavaScript', 'Python', 'C', 'C++', 'Java', 'SQL', 'PHP', 'HTML/CSS'],
      },
      { id: 'frontend', name: 'Frontend', skills: ['React', 'Next.js', 'Tailwind CSS', 'WordPress'] },
      {
        id: 'backend',
        name: 'Backend et bases de données',
        skills: ['Express.js', 'Django', 'PHP', 'PostgreSQL', 'MySQL', 'API REST'],
      },
      {
        id: 'automation',
        name: 'Automatisation et IA',
        skills: ['Make', 'n8n', 'Relevance AI', 'Claude', 'Agents IA', 'Webhooks'],
      },
      { id: 'methods', name: 'Méthodes', skills: ['Agile', 'Travail en équipe'] },
    ],
    experiences: [
      {
        role: 'Développeur',
        company: 'Zsquares Sol Inc',
        period: 'août 2026 – septembre 2026',
        tasks: ['Agent WhatsApp pour le service client', 'Workflow d’envoi automatique de la newsletter'],
      },
      {
        role: 'Développeur',
        company: 'Comprint FR',
        period: 'décembre 2025 – mars 2026',
        tasks: ['Développement et maintenance d’applications web clientes avec Next.js et WordPress'],
      },
      {
        role: 'Développeur',
        company: 'Socialoop EU',
        period: 'juillet 2025 – septembre 2025',
        tasks: [
          'Interfaces utilisateur réalisées avec les équipes de conception',
          'Automatisations et agents IA : agents CRM, publication automatisée sur LinkedIn, assistants personnels',
        ],
      },
    ],
    projects: [
      { name: 'EfreeShop', summary: 'Vente de composants, templates et produits digitaux', stack: '' },
      { name: 'EtuDocs', summary: 'Gestion des actes administratifs', stack: 'React, Express.js' },
      { name: 'MedicaStock', summary: 'Gestion de stock pharmaceutique', stack: 'React, PHP' },
      { name: 'Comunist', summary: 'Recensement des compétences locales d’une commune', stack: 'React, PHP' },
      { name: 'Nevora', summary: 'Boutique de vêtements', stack: 'React, Express.js' },
      { name: 'BudgetPro', summary: 'Budget personnel, application desktop', stack: 'Java, SceneBuilder' },
    ],
    education: [
      { degree: 'Licence 1 Math-Info', school: 'Université de Lille', period: '2026 – 2027' },
      { degree: 'Licence 2 Génie Logiciel', school: 'IFRI', period: '2025 – 2026' },
      { degree: 'Baccalauréat D', school: '', period: '2024' },
    ],
    certifications: [
      { id: 'python-mind-luster', title: 'Python', issuer: 'Mind Luster' },
      { id: 'sql-intermediate', title: 'SQL Intermédiaire', issuer: 'Sololearn' },
      { id: 'web-development', title: 'Web Development', issuer: 'Sololearn' },
      { id: 'python-developer', title: 'Python Developer', issuer: 'Sololearn' },
      { id: 'make-basics', title: 'Make Academy Basics', issuer: 'Make' },
      { id: 'make-intermediate', title: 'Make Academy Intermédiaire', issuer: 'Make' },
      { id: 'make-advanced', title: 'Make Academy Advanced', issuer: 'Make' },
    ],
    languages: [
      { name: 'Français', level: 'Avancé' },
      { name: 'Anglais', level: 'Intermédiaire' },
    ],
    interests: ['Musique', 'Podcasts tech', 'Gaming', 'Sport'],
    certificate: { label: 'Certificat de réussite', awardedTo: 'Décerné à', issuedBy: 'Délivré par' },
  },
}
