import { describe, expect, test } from 'vitest'
import { unsplashPhotoUrl } from '@/logic/unsplashPhotoUrl/unsplashPhotoUrl'

describe('unsplashPhotoUrl', () => {
  test('construit l’URL Unsplash de la photo recadrée à la largeur demandée', () => {
    const photoId = '1511300636408-a63a89df3482'
    const width = 1200

    const photoUrl = unsplashPhotoUrl(photoId, width)

    expect(photoUrl).toBe(
      'https://images.unsplash.com/photo-1511300636408-a63a89df3482?auto=format&fit=crop&w=1200&q=80',
    )
  })

  test.each([400, 800, 1600])('reporte la largeur %i dans le paramètre w', (width) => {
    const photoId = 'abc'

    const photoUrl = unsplashPhotoUrl(photoId, width)

    expect(new URL(photoUrl).searchParams.get('w')).toBe(String(width))
  })
})
