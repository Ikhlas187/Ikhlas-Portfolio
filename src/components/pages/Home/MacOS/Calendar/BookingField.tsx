import type { ReactNode } from 'react'

type BookingFieldProps = { label: string; children: ReactNode }

export default function BookingField({ label, children }: BookingFieldProps) {
  return (
    <label className="flex items-center gap-[12px] border-b border-(--macos-app-line) px-[16px] last:border-b-0">
      <span className="w-[64px] shrink-0 text-[15px] text-(--macos-app-ink)">{label}</span>
      {children}
    </label>
  )
}
