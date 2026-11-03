import appleLogoUrl from '@/assets/apple-logo.svg'
import { cn } from '@/lib/utils'

// Guillemets requis : Vite inline le SVG en data URI qui contient des apostrophes.
const MASK = `url("${appleLogoUrl}")`

type AppleLogoProps = { className?: string }

// Le SVG sert de masque : le logo prend la couleur du texte (text-*).
export default function AppleLogo({ className }: AppleLogoProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-block bg-current mask-contain mask-center mask-no-repeat', className)}
      style={{ maskImage: MASK, WebkitMaskImage: MASK }}
    />
  )
}
