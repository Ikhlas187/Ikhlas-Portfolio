import { Bot, Braces, Search, Webhook, type LucideIcon } from 'lucide-react'
import type { IconType } from 'react-icons'
import {
  SiDocker,
  SiFigma,
  SiGsap,
  SiLaravel,
  SiMake,
  SiN8N,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiWordpress,
} from 'react-icons/si'
import type { ToolId } from '@/data/services'

// Logo de chaque outil des services : marque via react-icons/si, notion sans marque via lucide.
export const TOOL_LOGOS: Record<ToolId, IconType | LucideIcon> = {
  node: SiNodedotjs,
  laravel: SiLaravel,
  postgresql: SiPostgresql,
  react: SiReact,
  restApi: Braces,
  wordpress: SiWordpress,
  seo: Search,
  figma: SiFigma,
  vercel: SiVercel,
  typescript: SiTypescript,
  tailwind: SiTailwindcss,
  gsap: SiGsap,
  n8n: SiN8N,
  make: SiMake,
  webhooks: Webhook,
  aiAgents: Bot,
  docker: SiDocker,
}
