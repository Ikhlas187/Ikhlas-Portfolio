import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

type BackPillProps = { label: string; to: string }

/* Bouton « ← Back » de la réf. haufsess.com, en haut des pages projet et certifications. */
export default function BackPill({ label, to }: BackPillProps) {
  return (
    <Link
      to={to}
      className="inline-flex cursor-pointer items-center gap-1 rounded-[50px] bg-[color-mix(in_srgb,var(--color-black)_6%,var(--color-white))] px-3 py-1.5 font-sans text-[18px] leading-[1.2] font-medium tracking-[-0.05em] transition-colors hover:bg-[color-mix(in_srgb,var(--color-black)_12%,var(--color-white))]"
    >
      <ArrowLeft aria-hidden="true" className="size-4" />
      {label}
    </Link>
  )
}
