import {
  SiReact, SiTypescript, SiTailwindcss, SiVite, SiFramer,
  SiNodedotjs, SiExpress, SiDjango, SiPhp, SiLaravel,
  SiMake, SiN8N, SiGooglegemini, SiClaude,
  SiDocker, SiGithubactions, SiVercel, SiUbuntu,
  SiPostgresql, SiMysql, SiSqlite, SiSupabase,
  SiWordpress, SiNextdotjs,
} from 'react-icons/si';
import { TbApi, TbWebhook, TbPlug, TbRobot } from 'react-icons/tb';

/* Chaque techno : logo de marque + couleur (calibrée pour rester lisible
   sur fond sombre au survol). Par défaut les logos sont gris (cf. CSS). */
export const TECH = {
  'React':         { Icon: SiReact,        color: '#61DAFB' },
  'TypeScript':    { Icon: SiTypescript,   color: '#4C9BE8' },
  'Tailwind':      { Icon: SiTailwindcss,  color: '#38BDF8' },
  'Vite':          { Icon: SiVite,         color: '#8B7BFF' },
  'Framer Motion': { Icon: SiFramer,       color: '#5B8CFF' },
  'Node':          { Icon: SiNodedotjs,    color: '#7FD16B' },
  'Express':       { Icon: SiExpress,      color: '#E8E8E8' },
  'Django':        { Icon: SiDjango,       color: '#5FC79E' },
  'PHP':           { Icon: SiPhp,          color: '#9AA6E0' },
  'REST API':      { Icon: TbApi,          color: '#B8BEC8' },
  'Laravel':       { Icon: SiLaravel,      color: '#FF6A5E' },
  'Make':          { Icon: SiMake,         color: '#C56BF5' },
  'n8n':           { Icon: SiN8N,          color: '#F26D8E' },
  'Webhooks':      { Icon: TbWebhook,      color: '#B8BEC8' },
  'HTTP modules':  { Icon: TbPlug,         color: '#B8BEC8' },
  'Relevance AI':  { Icon: TbRobot,        color: '#8A83FF' },
  'Gemini':        { Icon: SiGooglegemini, color: '#7BA8F0' },
  'Claude':        { Icon: SiClaude,       color: '#E0916F' },
  'Docker':        { Icon: SiDocker,       color: '#55AEF5' },
  'GitHub Actions':{ Icon: SiGithubactions,color: '#5AA0FF' },
  'Vercel':        { Icon: SiVercel,       color: '#FFFFFF' },
  'Linux / Ubuntu':{ Icon: SiUbuntu,       color: '#F2814F' },
  'PostgreSQL':    { Icon: SiPostgresql,   color: '#6D8EF0' },
  'MySQL':         { Icon: SiMysql,        color: '#6BB6C9' },
  'SQLite':        { Icon: SiSqlite,       color: '#6BC7F0' },
  'Supabase':      { Icon: SiSupabase,     color: '#56E0A0' },
  'WordPress':     { Icon: SiWordpress,    color: '#5B8DEF' },
  'Next.js':       { Icon: SiNextdotjs,    color: '#FFFFFF' },
};
