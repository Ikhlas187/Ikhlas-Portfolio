import type { Localized } from '@/data/locale'

export type Role = {
  id: string
  name: string
  color: string
  rot: number
  stack: string[]
}

// Stacks tirées du CV d'Ikhlas. Les noms de technos restent identiques dans les 2 langues.
export const ROLES: Localized<Role[]> = {
  en: [
    {
      id: 'frontend',
      name: 'Frontend Developer',
      color: 'var(--color-accent)',
      rot: 2,
      stack: ['React', 'TypeScript', 'Tailwind', 'Vite', 'Framer Motion'],
    },
    { id: 'backend', name: 'Backend Developer', color: 'var(--color-black)', rot: -1, stack: ['Node', 'Express', 'Django', 'PHP', 'REST API'] },
    {
      id: 'fullstack',
      name: 'Full-Stack Developer',
      color: 'var(--color-black)',
      rot: 1,
      stack: ['React', 'Express', 'PostgreSQL', 'Laravel', 'MySQL'],
    },
    { id: 'automation', name: 'Automation Engineer', color: 'var(--color-black)', rot: -3, stack: ['Make', 'n8n', 'Webhooks', 'HTTP modules'] },
    { id: 'ai-agent', name: 'AI Agent Developer', color: 'var(--color-black)', rot: 2, stack: ['Relevance AI', 'Gemini', 'Claude', 'Make'] },
    {
      id: 'devops',
      name: 'DevOps Engineer',
      color: 'var(--color-black)',
      rot: 1,
      stack: ['Docker', 'GitHub Actions', 'Vercel', 'Linux / Ubuntu'],
    },
    { id: 'database', name: 'Database Developer', color: 'var(--color-black)', rot: 0, stack: ['PostgreSQL', 'MySQL', 'SQLite', 'Supabase'] },
    { id: 'wordpress', name: 'WordPress Developer', color: 'var(--color-black)', rot: 1, stack: ['WordPress', 'Next.js', 'PHP'] },
  ],
  fr: [
    {
      id: 'frontend',
      name: 'Développeur Frontend',
      color: 'var(--color-accent)',
      rot: 2,
      stack: ['React', 'TypeScript', 'Tailwind', 'Vite', 'Framer Motion'],
    },
    { id: 'backend', name: 'Développeur Backend', color: 'var(--color-black)', rot: -1, stack: ['Node', 'Express', 'Django', 'PHP', 'REST API'] },
    {
      id: 'fullstack',
      name: 'Développeur Full-Stack',
      color: 'var(--color-black)',
      rot: 1,
      stack: ['React', 'Express', 'PostgreSQL', 'Laravel', 'MySQL'],
    },
    { id: 'automation', name: 'Ingénieur Automatisation', color: 'var(--color-black)', rot: -3, stack: ['Make', 'n8n', 'Webhooks', 'HTTP modules'] },
    { id: 'ai-agent', name: 'Développeur Agents IA', color: 'var(--color-black)', rot: 2, stack: ['Relevance AI', 'Gemini', 'Claude', 'Make'] },
    {
      id: 'devops',
      name: 'Ingénieur DevOps',
      color: 'var(--color-black)',
      rot: 1,
      stack: ['Docker', 'GitHub Actions', 'Vercel', 'Linux / Ubuntu'],
    },
    { id: 'database', name: 'Développeur Bases de données', color: 'var(--color-black)', rot: 0, stack: ['PostgreSQL', 'MySQL', 'SQLite', 'Supabase'] },
    { id: 'wordpress', name: 'Développeur WordPress', color: 'var(--color-black)', rot: 1, stack: ['WordPress', 'Next.js', 'PHP'] },
  ],
}

export const SKILLS_SECTION: Localized<{ title: string }> = {
  en: { title: 'Skills' },
  fr: { title: 'Compétences' },
}
