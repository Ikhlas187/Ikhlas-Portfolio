import { cn } from '@/lib/utils'

type NameMarkProps = {
  name: string
  className?: string
}

// viewBox 1136 x 269 de la réf. ; le nom est un <text> SVG et non du HTML dans un foreignObject :
// Safari sur iPhone ne met pas à l'échelle le contenu d'un foreignObject, le nom débordait du cadre.
// Ligne de base à 261 comme la réf. ; x décalé de 8,5 : l'interlettrage négatif laisse sinon le nom décalé vers la droite.
// Partagé par le hero et le footer, comme sur la réf.
export default function NameMark({ name, className }: NameMarkProps) {
  return (
    <svg viewBox="0 0 1136 269" className={cn('block h-auto w-full overflow-hidden', className)} role="img" aria-label={name}>
      <text
        x={568 - 8.5}
        y={261}
        textAnchor="middle"
        fill="currentColor"
        className="font-heading text-[269.149px] font-normal tracking-[-0.08em]"
        xmlSpace="preserve"
      >
        {name}
      </text>
    </svg>
  )
}
