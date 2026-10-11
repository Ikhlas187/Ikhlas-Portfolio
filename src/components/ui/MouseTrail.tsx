import { useEffect, useRef } from 'react'

type MouseTrailProps = {
  lifetime?: number
  width?: number
  minDist?: number
}

type TrailPoint = { x: number; y: number; t: number }

const MAX_POINTS = 400

/* Traînée « feutre » qui suit le curseur (réf. KokonutUI), en blend difference pour rester visible sur tout fond. */
export default function MouseTrail({
  lifetime = 1400, // ms avant effacement d'un point
  width = 6, // px
  minDist = 4, // px entre 2 points enregistrés
}: MouseTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf = 0
    const points: TrailPoint[] = []

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onMove = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY
      const last = points[points.length - 1]
      if (last) {
        const dx = x - last.x
        const dy = y - last.y
        if (dx * dx + dy * dy < minDist * minDist) return
      }
      points.push({ x, y, t: performance.now() })
      if (points.length > MAX_POINTS) points.shift()
    }

    const mid = (a: TrailPoint, b: TrailPoint) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })

    const draw = () => {
      const now = performance.now()

      while (points.length && now - points[0].t > lifetime) {
        points.shift()
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (points.length > 2) {
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        // Un seul chemin continu : aucune jointure visible entre segments.
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length - 1; i++) {
          const to = mid(points[i], points[i + 1])
          ctx.quadraticCurveTo(points[i].x, points[i].y, to.x, to.y)
        }
        const last = points[points.length - 1]
        ctx.lineTo(last.x, last.y)
        ctx.lineWidth = width
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.stroke()
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [lifetime, width, minDist])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-9998 size-full mix-blend-difference"
    />
  )
}
