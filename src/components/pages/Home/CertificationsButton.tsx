import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { PROJECT_PAGE } from '@/data/projects'
import { ROUTES } from '@/data/routes'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'

/* Bouton « Voir mes certifications » : sous les projets sur téléphone, sous le Mac sur ordinateur. */
export default function CertificationsButton() {
  const { locale } = useLocale()

  return (
    <Link
      to={ROUTES.CERTIFICATIONS}
      className={cn(buttonVariants(), 'h-12 w-full gap-2 rounded-full font-sans text-[16px] min-[810px]:w-auto min-[810px]:px-8')}
    >
      {PROJECT_PAGE[locale].certificationsLink}
      <ArrowRight aria-hidden="true" />
    </Link>
  )
}
