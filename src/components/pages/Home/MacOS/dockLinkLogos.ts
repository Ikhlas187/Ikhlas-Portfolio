import type { IconType } from 'react-icons'
import { FaLinkedinIn } from 'react-icons/fa6'
import { SiGithub } from 'react-icons/si'
import type { DockLinkId } from '@/data/giantSur'

// Logos de marque (pas des icônes d'interface) : simple-icons n'a plus LinkedIn, d'où Font Awesome pour celui-ci.
export const DOCK_LINK_LOGOS: Record<DockLinkId, { Logo: IconType; className: string }> = {
  github: { Logo: SiGithub, className: 'text-(--macos-dock-github)' },
  linkedin: { Logo: FaLinkedinIn, className: 'text-(--macos-dock-linkedin)' },
}
