import type { ReactNode } from 'react'

// Survol de la réf. : le libellé monte hors du bouton et sa copie remonte d'en dessous (450ms, cubic-bezier(0.76,0,0.24,1)).
const ROLL = 'transition-transform duration-[450ms] ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none'

export default function RollingLabel({ children }: { children: ReactNode }) {
  return (
    <span className="relative flex overflow-hidden">
      <span className={`flex items-center gap-1.5 ${ROLL} group-hover/button:-translate-y-[180%] group-focus-visible/button:-translate-y-[180%]`}>
        {children}
      </span>
      <span
        aria-hidden="true"
        className={`absolute inset-0 flex translate-y-[180%] items-center gap-1.5 ${ROLL} group-hover/button:translate-y-0 group-focus-visible/button:translate-y-0`}
      >
        {children}
      </span>
    </span>
  )
}
