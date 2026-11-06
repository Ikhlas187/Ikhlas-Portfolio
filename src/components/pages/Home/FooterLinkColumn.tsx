import type { FooterColumn } from '@/data/footer'

type FooterLinkColumnProps = {
  column: FooterColumn
}

export default function FooterLinkColumn({ column }: FooterLinkColumnProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-sans text-[16px] leading-[1.4] font-medium text-white">{column.title}</p>
      <ul className="flex flex-col gap-3">
        {column.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.isExternal ? '_blank' : undefined}
              rel={link.isExternal ? 'noreferrer' : undefined}
              className="cursor-pointer font-sans text-[16px] leading-[1.4] font-normal break-all text-white/55 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
