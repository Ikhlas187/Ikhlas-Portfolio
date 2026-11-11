import type { Localized } from '@/data/locale'

export type Role = {
  id: string
  name: string
  stack: string[]
}

// Stacks tirées du CV d'Ikhlas. Les noms de technos restent identiques dans les 2 langues.
export const ROLES: Localized<Role[]> = {
  en: [
    {
      id: 'frontend',
      name: 'Frontend Developer',
      stack: ['React', 'TypeScript', 'Tailwind', 'Vite', 'Framer Motion'],
    },
    { id: 'backend', name: 'Backend Developer', stack: ['Node', 'Express', 'Django', 'PHP', 'REST API'] },
    {
      id: 'fullstack',
      name: 'Full-Stack Developer',
      stack: ['React', 'Express', 'PostgreSQL', 'Laravel', 'MySQL'],
    },
    { id: 'automation', name: 'Automation Engineer', stack: ['Make', 'n8n', 'Webhooks', 'HTTP modules'] },
    { id: 'ai-agent', name: 'AI Agent Developer', stack: ['Relevance AI', 'Gemini', 'Claude', 'Make'] },
    {
      id: 'devops',
      name: 'DevOps Engineer',
      stack: ['Docker', 'GitHub Actions', 'Vercel', 'Linux / Ubuntu'],
    },
    { id: 'database', name: 'Database Developer', stack: ['PostgreSQL', 'MySQL', 'SQLite', 'Supabase'] },
    { id: 'wordpress', name: 'WordPress Developer', stack: ['WordPress', 'Next.js', 'PHP'] },
  ],
  fr: [
    {
      id: 'frontend',
      name: 'Développeur Frontend',
      stack: ['React', 'TypeScript', 'Tailwind', 'Vite', 'Framer Motion'],
    },
    { id: 'backend', name: 'Développeur Backend', stack: ['Node', 'Express', 'Django', 'PHP', 'REST API'] },
    {
      id: 'fullstack',
      name: 'Développeur Full-Stack',
      stack: ['React', 'Express', 'PostgreSQL', 'Laravel', 'MySQL'],
    },
    { id: 'automation', name: 'Ingénieur Automatisation', stack: ['Make', 'n8n', 'Webhooks', 'HTTP modules'] },
    { id: 'ai-agent', name: 'Développeur Agents IA', stack: ['Relevance AI', 'Gemini', 'Claude', 'Make'] },
    {
      id: 'devops',
      name: 'Ingénieur DevOps',
      stack: ['Docker', 'GitHub Actions', 'Vercel', 'Linux / Ubuntu'],
    },
    { id: 'database', name: 'Développeur Bases de données', stack: ['PostgreSQL', 'MySQL', 'SQLite', 'Supabase'] },
    { id: 'wordpress', name: 'Développeur WordPress', stack: ['WordPress', 'Next.js', 'PHP'] },
  ],
}
