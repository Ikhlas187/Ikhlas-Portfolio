import { cn } from '@/lib/utils'

type NameMarkProps = {
  name: string
  className?: string
}

// <text> SVG et non foreignObject : Safari iPhone ne met pas à l'échelle le HTML d'un foreignObject.
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
