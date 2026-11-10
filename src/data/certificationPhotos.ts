// Image de chaque certificat, par id de certification (data/cv.ts) : src/assets/certifications/<id>.webp, exportée du PDF reçu.
const FILES = import.meta.glob<string>('/src/assets/certifications/*.webp', { eager: true, import: 'default' })

export const CERTIFICATION_PHOTOS: Record<string, string> = Object.fromEntries(
  Object.entries(FILES).map(([path, url]) => [path.split('/').pop()!.replace('.webp', ''), url]),
)
