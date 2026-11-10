import { Award } from 'lucide-react'
import { CERTIFICATION_PHOTOS } from '@/data/certificationPhotos'
import type { PdfDocument } from '@/data/macos'

type CertificateDocumentProps = { document: Extract<PdfDocument, { type: 'certificate' }> }

// Le vrai certificat (image exportée du PDF) ; à défaut, une carte avec la formation, l'organisme et le titulaire.
export default function CertificateDocument({ document }: CertificateDocumentProps) {
  const { certification, holder, labels } = document
  const photo = CERTIFICATION_PHOTOS[certification.id]

  if (photo) {
    return (
      <img
        src={photo}
        alt={certification.title}
        className="mx-auto w-[680px] max-w-[calc(100%-48px)] shrink-0 bg-(--macos-paper) shadow-(--macos-shadow-window)"
      />
    )
  }

  return (
    <article className="mx-auto flex aspect-[297/210] w-[540px] shrink-0 bg-(--macos-paper) p-[14px] text-(--macos-paper-ink) shadow-(--macos-shadow-window)">
      <div className="flex flex-1 flex-col items-center justify-center gap-[14px] border border-(--macos-paper-line) px-[36px] text-center">
        <Award strokeWidth={1.4} className="size-[34px] text-(--color-accent)" />
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase">{labels.label}</p>
        <h1 className="font-sans text-[28px] leading-[1.1] font-bold tracking-[-0.02em] text-balance">
          {certification.title}
        </h1>
        <div className="mt-[6px] flex flex-col gap-[2px] text-[11px]">
          <p>
            {labels.awardedTo} <span className="font-semibold">{holder}</span>
          </p>
          <p>
            {labels.issuedBy} <span className="font-semibold">{certification.issuer}</span>
          </p>
        </div>
      </div>
    </article>
  )
}
