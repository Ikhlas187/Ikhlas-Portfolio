import type { FsPdfFile } from '@/data/macos'

type CvDocumentProps = { document: FsPdfFile['document'] }

// Aperçu factice du CV : une page papier rendue en React.
export default function CvDocument({ document }: CvDocumentProps) {
  return (
    <article className="mx-auto flex aspect-[210/297] w-[460px] flex-col gap-[22px] bg-(--macos-paper) px-[44px] py-[48px] text-(--macos-paper-ink) shadow-(--macos-shadow-window)">
      <header className="border-b border-(--macos-paper-line) pb-[16px]">
        <h1 className="font-sans text-[26px] font-bold tracking-[-0.02em]">{document.title}</h1>
        <p className="mt-[4px] text-[13px] font-medium text-(--color-accent)">{document.subtitle}</p>
      </header>
      {document.sections.map((section) => (
        <section key={section.heading} className="flex flex-col gap-[6px]">
          <h2 className="font-sans text-[11px] font-bold tracking-[0.12em] uppercase">{section.heading}</h2>
          {section.lines.map((line) => (
            <p key={line} className="text-[11.5px] leading-[1.5]">
              {line}
            </p>
          ))}
        </section>
      ))}
    </article>
  )
}
