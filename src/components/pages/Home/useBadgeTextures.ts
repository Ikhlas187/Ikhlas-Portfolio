import { useEffect, useState } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'
import portraitUrl from '@/assets/about-portrait.webp'

// Texture carrée du modèle badge.glb : recto dans la moitié gauche, verso dans la moitié droite, sur 75,7 % de la hauteur.
const ATLAS = 1024
const FACE_WIDTH = ATLAS / 2
const FACE_HEIGHT = Math.round(ATLAS * 0.757)

function tokenColor(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function drawFront(context: CanvasRenderingContext2D, photo: HTMLImageElement, name: string) {
  context.fillStyle = tokenColor('--color-lanyard')
  context.fillRect(0, 0, FACE_WIDTH, FACE_HEIGHT)
  const scale = Math.max(FACE_WIDTH / photo.width, FACE_HEIGHT / photo.height) * 1.35
  const width = photo.width * scale
  const height = photo.height * scale
  context.save()
  context.beginPath()
  context.rect(0, 0, FACE_WIDTH, FACE_HEIGHT)
  context.clip()
  // Cadré sur le buste : le portrait est en pied.
  context.drawImage(photo, (FACE_WIDTH - width) / 2, -height * 0.13, width, height)
  const shade = context.createLinearGradient(0, 0, 0, FACE_HEIGHT * 0.4)
  shade.addColorStop(0, 'rgba(0, 0, 0, 0.55)')
  shade.addColorStop(1, 'rgba(0, 0, 0, 0)')
  context.fillStyle = shade
  context.fillRect(0, 0, FACE_WIDTH, FACE_HEIGHT)
  context.restore()

  context.fillStyle = tokenColor('--color-white')
  context.textAlign = 'center'
  context.font = `400 46px ${tokenColor('--font-display')}`
  context.fillText(name.toUpperCase(), FACE_WIDTH / 2, 120)
}

function drawBack(context: CanvasRenderingContext2D, name: string, role: string) {
  const left = FACE_WIDTH
  context.fillStyle = tokenColor('--color-black')
  context.fillRect(left, 0, FACE_WIDTH, FACE_HEIGHT)
  context.fillStyle = tokenColor('--color-white')
  context.textAlign = 'center'
  context.font = `400 60px ${tokenColor('--font-display')}`
  name
    .toUpperCase()
    .split(' ')
    .forEach((word, index) => context.fillText(word, left + FACE_WIDTH / 2, FACE_HEIGHT / 2 - 20 + index * 66))
  context.fillStyle = tokenColor('--color-gray-600')
  context.font = `500 19px ${tokenColor('--font-body')}`
  context.fillText(role.toUpperCase(), left + FACE_WIDTH / 2, FACE_HEIGHT / 2 + 130)
}

export default function useBadgeTextures(name: string, role: string) {
  const [texture, setTexture] = useState<CanvasTexture | null>(null)

  useEffect(() => {
    let isCancelled = false
    const photo = new Image()
    photo.src = portraitUrl
    const fonts = [
      document.fonts.load(`400 60px ${tokenColor('--font-display')}`),
      document.fonts.load(`500 19px ${tokenColor('--font-body')}`),
    ]
    Promise.all([photo.decode(), ...fonts]).then(() => {
      if (isCancelled) return
      const canvas = document.createElement('canvas')
      canvas.width = ATLAS
      canvas.height = ATLAS
      const context = canvas.getContext('2d')!
      drawFront(context, photo, name)
      drawBack(context, name, role)
      const atlas = new CanvasTexture(canvas)
      atlas.colorSpace = SRGBColorSpace
      atlas.flipY = false
      atlas.anisotropy = 16
      setTexture(atlas)
    })
    return () => {
      isCancelled = true
    }
  }, [name, role])

  useEffect(() => () => texture?.dispose(), [texture])

  return texture
}
