import { useLocale } from '@/lib/LocaleProvider'
import { NOT_FOUND } from '@/data/home'

export default function NotFoundPage() {
  const { locale } = useLocale()
  const notFound = NOT_FOUND[locale]

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="mb-4 text-sm text-gray-500">{notFound.code}</p>
        <h1 className="text-3xl">{notFound.title}</h1>
      </div>
    </main>
  )
}
