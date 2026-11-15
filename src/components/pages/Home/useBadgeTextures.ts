import { useEffect, useState } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'
import portraitUrl from '@/assets/about-portrait.webp'

export const BADGE_WIDTH = 1.6
export const BADGE_HEIGHT = 2.25

const PX_WIDTH = 1024
const PX_HEIGHT = Math.round((PX_WIDTH * BADGE_HEIGHT) / BADGE_WIDTH)
const RADIUS = 56
const SLOT = { width: 150, height: 34, top: 58 }

type BadgeTextures = { front: CanvasTexture; back: CanvasTexture }

function tokenColor(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function createFace() {
  const canvas = document.createElement('canvas')
  canvas.width = PX_WIDTH
  canvas.height = PX_HEIGHT
  const context = canvas.getContext('2d')!
  context.beginPath()
  context.roundRect(0, 0, PX_WIDTH, PX_HEIGHT, RADIUS)
  context.clip()
  return { canvas, context }
}

// Fente du mousqueton, découpée dans la carte pour qu'on voie l'anneau passer au travers.
function cutSlot(context: CanvasRenderingContext2D) {
  context.save()
  context.globalCompositeOperation = 'destination-out'
  context.beginPath()
  context.roundRect((PX_WIDTH - SLOT.width) / 2, SLOT.top, SLOT.width, SLOT.height, SLOT.height / 2)
  context.fill()
  context.restore()
}

function toTexture(canvas: HTMLCanvasElement) {
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

function drawFront(photo: HTMLImageElement, name: string) {
  const { canvas, context } = createFace()
  const scale = Math.max(PX_WIDTH / photo.width, PX_HEIGHT / photo.height) * 1.35
  const width = photo.width * scale
  const height = photo.height * scale
  // Cadré sur le buste : le portrait est en pied.
  context.drawImage(photo, (PX_WIDTH - width) / 2, -height * 0.2, width, height)

  const shade = context.createLinearGradient(0, 0, 0, PX_HEIGHT * 0.45)
  shade.addColorStop(0, 'rgba(0, 0, 0, 0.55)')
  shade.addColorStop(1, 'rgba(0, 0, 0, 0)')
  context.fillStyle = shade
  context.fillRect(0, 0, PX_WIDTH, PX_HEIGHT)

  context.fillStyle = tokenColor('--color-white')
  context.textAlign = 'center'
  context.font = `400 92px ${tokenColor('--font-display')}`
  context.fillText(name.toUpperCase(), PX_WIDTH / 2, 250)
  cutSlot(context)
  return toTexture(canvas)
}

function drawBack(name: string, role: string) {
  const { canvas, context } = createFace()
  context.fillStyle = tokenColor('--color-black')
  context.fillRect(0, 0, PX_WIDTH, PX_HEIGHT)

  context.fillStyle = tokenColor('--color-white')
  context.textAlign = 'center'
  context.font = `400 112px ${tokenColor('--font-display')}`
  name
    .toUpperCase()
    .split(' ')
    .forEach((word, index) => context.fillText(word, PX_WIDTH / 2, PX_HEIGHT / 2 - 40 + index * 120))

  context.fillStyle = tokenColor('--color-gray-600')
  context.font = `500 40px ${tokenColor('--font-body')}`
  context.fillText(role.toUpperCase(), PX_WIDTH / 2, PX_HEIGHT / 2 + 230)
  cutSlot(context)
  return toTexture(canvas)
}

export default function useBadgeTextures(name: string, role: string) {
  const [textures, setTextures] = useState<BadgeTextures | null>(null)

  useEffect(() => {
    let isCancelled = false
    const photo = new Image()
    photo.src = portraitUrl
    const fonts = [
      document.fonts.load(`400 92px ${tokenColor('--font-display')}`),
      document.fonts.load(`500 40px ${tokenColor('--font-body')}`),
    ]
    Promise.all([photo.decode(), ...fonts]).then(() => {
      if (isCancelled) return
      setTextures({ front: drawFront(photo, name), back: drawBack(name, role) })
    })
    return () => {
      isCancelled = true
    }
  }, [name, role])

  useEffect(
    () => () => {
      textures?.front.dispose()
      textures?.back.dispose()
    },
    [textures],
  )

  return textures
}
