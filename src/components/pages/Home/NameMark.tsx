import { cn } from '@/lib/utils'

type NameMarkProps = {
  name: string
  className?: string
}

// Copie de la réf. : viewBox 1136 x 269 et texte HTML dans un foreignObject, mis à l'échelle de la largeur.
// La viewBox n'est pas recalée sur le nom : les lettres ont la taille de celles de la réf., le nom est centré dans la largeur.
// Le Plus Jakarta Sans de Google Fonts a un ascendant plus court que celui servi par Framer (279 contre 350 à cette taille) :
// à line-height 100 %, sa ligne de base tombe à 244 au lieu de 261. top 17px (unités de la viewBox) la remet au même endroit.
// left -8.5px recentre l'encre : avec l'interlettrage négatif, text-center laisse le nom décalé vers la droite.
// Partagé par le hero et le footer, comme sur la réf.
export default function NameMark({ name, className }: NameMarkProps) {
  return (
    <svg viewBox="0 0 1136 269" className="block h-auto w-full overflow-hidden" role="img" aria-label={name}>
      <foreignObject width="100%" height="100%" className="overflow-visible">
        <p
          className={cn(
            'relative top-[17px] -left-[8.5px] m-0 text-center font-heading text-[269.149px] leading-[100%] font-normal tracking-[-0.08em] whitespace-pre',
            className,
          )}
        >
          {name}
        </p>
      </foreignObject>
    </svg>
  )
}
