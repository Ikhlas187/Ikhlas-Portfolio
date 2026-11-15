import { useLocale } from '@/lib/LocaleProvider'
import { NOT_FOUND } from '@/data/home'

export default function NotFoundPage() {
  const { locale } = useLocale()
  const notFound = NOT_FOUND[locale]

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="mb-4 mono-sm text-gray-500">{notFound.code}</p>
        <h1 className="text-3xl leading-[1.1] font-semibold tracking-[-0.07em]">{notFound.title}</h1>
      </div>
    </main>
  )
}
