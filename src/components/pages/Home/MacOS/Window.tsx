import { useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import TrafficLights from '@/components/pages/Home/MacOS/TrafficLights'
import { useGenie, type GenieDirection } from '@/components/pages/Home/MacOS/useGenie'
import { cn } from '@/lib/utils'
import type { Point } from '@/logic/macos/windowBounds/windowBounds'
import type { MacWindow } from '@/logic/macos/windowManager/windowManager'

export type WindowFrameProps = {
  window: MacWindow
  isFocused: boolean
  onFocus: () => void
  onClose: () => void
  onMinimize: () => void
  onZoom: () => void
  onMove: (position: Point) => void
}

type WindowProps = WindowFrameProps & {
  title: string
  isZoomable?: boolean
  toolbar?: ReactNode
  // false : l'app dessine ses propres barres d'outils (Safari, Notes), marquées data-window-drag.
  hasToolbarRow?: boolean
  // La fenêtre laisse voir le bureau : c'est la barre latérale de l'app qui floute ce qui est derrière.
  isSeeThrough?: boolean
  sidebar?: ReactNode
  sidebarClassName?: string
  titleBarClassName?: string
  contentClassName?: string
  children: ReactNode
}

type DragStart = { pointerX: number; pointerY: number; x: number; y: number; scale: number }

const INTERACTIVE = 'button, input, textarea, a, select, [contenteditable], [role="tab"]'
const DRAG_HANDLE = '[data-window-drag]'

const OPEN_TRANSITION = { type: 'spring', stiffness: 380, damping: 32, mass: 0.9 } as const
const FADE_TRANSITION = { duration: 0.2, ease: 'easeOut' } as const
const INSTANT = { duration: 0 } as const

export default function Window({
  window: macWindow,
  title,
  isFocused,
  isZoomable = true,
  toolbar,
  hasToolbarRow = true,
  isSeeThrough = false,
  sidebar,
  sidebarClassName,
  titleBarClassName,
  contentClassName,
  children,
  onFocus,
  onClose,
  onMinimize,
  onZoom,
  onMove,
}: WindowProps) {
  const dragStart = useRef<DragStart | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const { rect, isMinimized, z } = macWindow
  const isReducedMotion = useReducedMotion() ?? false
  const [wasMinimized, setWasMinimized] = useState(isMinimized)
  const [genieDirection, setGenieDirection] = useState<GenieDirection | null>(
    macWindow.isOpenedFromDock && !isReducedMotion ? 'restore' : null,
  )
  const [hasGenieAtMount] = useState(genieDirection !== null)

  if (wasMinimized !== isMinimized) {
    setWasMinimized(isMinimized)
    // Mouvement réduit : pas de génie, la fenêtre s'efface en fondu court.
    if (!isReducedMotion) setGenieDirection(isMinimized ? 'minimize' : 'restore')
  }

  useGenie(sectionRef, genieDirection, rect, macWindow.app, () => setGenieDirection(null))

  // Pendant le génie, ce sont les bandes copiées qui bougent : la vraie fenêtre reste cachée sur place.
  const isHiddenByGenie = !isReducedMotion && (isMinimized || genieDirection !== null)
  const isFadedOut = isReducedMotion && isMinimized

  const isOnDragHandle = (target: EventTarget) => {
    const element = target as HTMLElement
    return element.closest(DRAG_HANDLE) !== null && element.closest(INTERACTIVE) === null
  }

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || !isOnDragHandle(event.target)) return
    if (macWindow.isMaximized) return
    // L'écran peut être mis à l'échelle (MacBook 3D) : on ramène le déplacement du pointeur en pixels de l'écran.
    const root = event.currentTarget.closest<HTMLElement>('[data-macos-root]')
    const scale = root ? root.getBoundingClientRect().width / root.offsetWidth || 1 : 1
    dragStart.current = { pointerX: event.clientX, pointerY: event.clientY, x: rect.x, y: rect.y, scale }
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsDragging(true)
  }

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const start = dragStart.current
    if (!start) return
    onMove({
      x: start.x + (event.clientX - start.pointerX) / start.scale,
      y: start.y + (event.clientY - start.pointerY) / start.scale,
    })
  }

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    if (!dragStart.current) return
    dragStart.current = null
    event.currentTarget.releasePointerCapture(event.pointerId)
    setIsDragging(false)
  }

  const dragArea = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerUp,
    onDoubleClick: (event: MouseEvent<HTMLElement>) => {
      if (isZoomable && isOnDragHandle(event.target)) onZoom()
    },
  }

  return (
    <motion.section
      ref={sectionRef}
      aria-label={title}
      aria-hidden={isMinimized || undefined}
      onPointerDownCapture={onFocus}
      initial={
        hasGenieAtMount
          ? false
          : { opacity: 0, scaleX: 0.88, scaleY: 0.88, x: rect.x, y: rect.y + 24, width: rect.width, height: rect.height }
      }
      animate={{ opacity: isFadedOut ? 0 : 1, scaleX: 1, scaleY: 1, x: rect.x, y: rect.y, width: rect.width, height: rect.height }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.18, ease: 'easeIn' } }}
      transition={isDragging || isHiddenByGenie ? INSTANT : isReducedMotion ? FADE_TRANSITION : OPEN_TRANSITION}
      style={{
        zIndex: z,
        pointerEvents: isMinimized || isHiddenByGenie ? 'none' : 'auto',
        visibility: isHiddenByGenie ? 'hidden' : 'visible',
      }}
      {...dragArea}
      className={cn(
        'absolute top-0 left-0 flex overflow-hidden rounded-[26px] font-(family-name:--font-giantsur) text-[13px] text-(--macos-frame-fg) transition-shadow duration-250 ease-[cubic-bezier(0.32,0.72,0,1)]',
        // Filet clair intérieur dessiné au-dessus du contenu, comme le ::after de la référence.
        'after:pointer-events-none after:absolute after:inset-0 after:z-40 after:rounded-[inherit] after:shadow-[inset_0_0_0_0.5px_var(--macos-frame-highlight)]',
        isFocused ? 'shadow-(--macos-frame-shadow)' : 'shadow-(--macos-frame-shadow-idle)',
        isSeeThrough
          ? 'bg-transparent'
          : isFocused
            ? 'bg-(--macos-frame-window) backdrop-blur-[50px] backdrop-saturate-[1.9]'
            : 'bg-(--macos-frame-window-solid)',
        sidebar ? 'flex-row' : 'flex-col',
      )}
    >
      <div className="absolute top-[21px] left-[21px] z-20">
        <TrafficLights isFocused={isFocused} isZoomable={isZoomable} onClose={onClose} onMinimize={onMinimize} onZoom={onZoom} />
      </div>
      {sidebar && (
        <aside className={cn('flex w-[200px] shrink-0 flex-col border-r border-(--macos-frame-line)', sidebarClassName)}>
          <div data-window-drag className="h-[52px] shrink-0" />
          <div className="min-h-0 flex-1 overflow-y-auto px-[10px] pb-[12px]">{sidebar}</div>
        </aside>
      )}
      <div className={cn('flex min-w-0 flex-1 flex-col', contentClassName)}>
        {hasToolbarRow && (
          <div
            data-window-drag
            className={cn(
              'relative flex h-[52px] shrink-0 items-center gap-[8px] border-b border-(--macos-frame-line) bg-(--macos-frame-surface) pr-[12px]',
              sidebar ? 'pl-[12px]' : 'pl-[84px]',
              titleBarClassName,
            )}
          >
            {toolbar ?? (
              <p className="pointer-events-none absolute inset-x-[90px] truncate text-center font-semibold">{title}</p>
            )}
          </div>
        )}
        <div className="relative min-h-0 flex-1">{children}</div>
      </div>
    </motion.section>
  )
}
