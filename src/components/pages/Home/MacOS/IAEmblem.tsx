import { cn } from '@/lib/utils'

type IAEmblemProps = { className?: string }

// Monogramme « IA » d'Ikhlas, même police et même graisse que celui du capot (LidEmblem).
export default function IAEmblem({ className }: IAEmblemProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-flex items-center justify-center font-heading leading-none font-medium', className)}
    >
      IA
    </span>
  )
}
