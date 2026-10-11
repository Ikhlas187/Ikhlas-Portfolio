import { NOT_FOUND } from '@/data/home'

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="mb-4 text-sm text-gray-500">{NOT_FOUND.code}</p>
        <h1 className="text-3xl">{NOT_FOUND.title}</h1>
      </div>
    </main>
  )
}
