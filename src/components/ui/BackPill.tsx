import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type BackPillProps = { label: string; to: string }

/* Bouton « ← Back » de la réf. haufsess.com, en haut des pages projet et certifications. */
export default function BackPill({ label, to }: BackPillProps) {
  return (
    <Link
      to={to}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        'h-auto gap-1 rounded-[50px] px-3 py-1.5 font-sans text-[18px] leading-[1.2] font-medium tracking-[-0.05em] text-black bg-[color-mix(in_srgb,var(--color-black)_6%,var(--color-white))] hover:bg-[color-mix(in_srgb,var(--color-black)_12%,var(--color-white))]',
      )}
    >
      <ArrowLeft aria-hidden="true" className="size-4" />
      {label}
    </Link>
  )
}
