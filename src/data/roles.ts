export type Role = {
  name: string
  color: string
  rot: number
  stack: string[]
}

// Stacks tirées du CV d'Ikhlas.
export const ROLES: Role[] = [
  {
    name: 'Frontend Developer',
    color: '#3B82F6',
    rot: 2,
    stack: ['React', 'TypeScript', 'Tailwind', 'Vite', 'Framer Motion'],
  },
  { name: 'Backend Developer', color: '#06D6A0', rot: -1, stack: ['Node', 'Express', 'Django', 'PHP', 'REST API'] },
  {
    name: 'Full-Stack Developer',
    color: '#8338EC',
    rot: 1,
    stack: ['React', 'Express', 'PostgreSQL', 'Laravel', 'MySQL'],
  },
  { name: 'Automation Engineer', color: '#FF7B00', rot: -3, stack: ['Make', 'n8n', 'Webhooks', 'HTTP modules'] },
  { name: 'AI Agent Developer', color: '#FB6F92', rot: 2, stack: ['Relevance AI', 'Gemini', 'Claude', 'Make'] },
  {
    name: 'DevOps Engineer',
    color: '#EF233C',
    rot: 1,
    stack: ['Docker', 'GitHub Actions', 'Vercel', 'Linux / Ubuntu'],
  },
  { name: 'Database Developer', color: '#FFB703', rot: 0, stack: ['PostgreSQL', 'MySQL', 'SQLite', 'Supabase'] },
  { name: 'WordPress Developer', color: '#FF4D6D', rot: 1, stack: ['WordPress', 'Next.js', 'PHP'] },
]

export const SKILLS_SECTION = {
  title: 'Skills',
}
