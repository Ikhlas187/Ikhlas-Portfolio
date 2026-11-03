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
  canZoom?: boolean
  toolbar?: ReactNode
  sidebar?: ReactNode
  sidebarClassName?: string
  titleBarClassName?: string
  contentClassName?: string
  className?: string
  children: ReactNode
}

type DragStart = { pointerX: number; pointerY: number; x: number; y: number; scale: number }

const INTERACTIVE = 'button, input, textarea, a, select, [role="tab"]'

const OPEN_TRANSITION = { type: 'spring', stiffness: 380, damping: 32, mass: 0.9 } as const
const FADE_TRANSITION = { duration: 0.2, ease: 'easeOut' } as const
const INSTANT = { duration: 0 } as const

export default function Window({
  window: macWindow,
  title,
  isFocused,
  canZoom = true,
  toolbar,
  sidebar,
  sidebarClassName,
  titleBarClassName,
  contentClassName,
  className,
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

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest(INTERACTIVE)) return
    if (macWindow.isMaximized) return
    // L'écran peut être mis à l'échelle (MacBook 3D) : on ramène le déplacement du pointeur en pixels de l'écran.
    const root = event.currentTarget.closest<HTMLElement>('[data-macos-root]')
    const scale = root ? root.getBoundingClientRect().width / root.offsetWidth || 1 : 1
    dragStart.current = { pointerX: event.clientX, pointerY: event.clientY, x: rect.x, y: rect.y, scale }
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsDragging(true)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = dragStart.current
    if (!start) return
    onMove({
      x: start.x + (event.clientX - start.pointerX) / start.scale,
      y: start.y + (event.clientY - start.pointerY) / start.scale,
    })
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
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
    onDoubleClick: (event: MouseEvent<HTMLDivElement>) => {
      if (canZoom && !(event.target as HTMLElement).closest(INTERACTIVE)) onZoom()
    },
  }
  const lights = (
    <TrafficLights isFocused={isFocused} canZoom={canZoom} onClose={onClose} onMinimize={onMinimize} onZoom={onZoom} />
  )
  const hasToolbar = toolbar !== undefined

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
      className={cn(
        'absolute top-0 left-0 flex overflow-hidden rounded-[10px] border border-(--macos-window-border) font-(family-name:--font-giantsur) text-[13px] text-(--macos-text) backdrop-blur-3xl backdrop-saturate-[1.8] transition-shadow duration-300',
        isFocused ? 'shadow-(--macos-shadow-window)' : 'shadow-(--macos-shadow-window-idle)',
        sidebar ? 'flex-row bg-(--macos-window-glass)' : 'flex-col bg-(--macos-window)',
        className,
      )}
    >
      {sidebar && (
        <aside
          className={cn(
            'flex w-[200px] shrink-0 flex-col border-r border-(--macos-separator-strong) bg-(--macos-window-sidebar)',
            sidebarClassName,
          )}
        >
          <div {...dragArea} className="flex h-[52px] shrink-0 items-center px-[18px]">
            {lights}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-[10px] pb-[12px]">{sidebar}</div>
        </aside>
      )}
      <div className={cn('flex min-w-0 flex-1 flex-col', sidebar && 'bg-(--macos-window)', contentClassName)}>
        <div
          {...dragArea}
          className={cn(
            'relative flex shrink-0 items-center gap-[14px] border-b border-(--macos-separator-strong) bg-(--macos-window-toolbar) px-[14px] transition-opacity duration-200',
            hasToolbar || sidebar ? 'h-[52px]' : 'h-[38px]',
            !isFocused && 'opacity-75',
            titleBarClassName,
          )}
        >
          {!sidebar && lights}
          {toolbar ?? (
            <p
              className={cn(
                'pointer-events-none truncate font-semibold',
                sidebar ? 'text-[15px]' : 'absolute inset-x-[90px] text-center',
                !isFocused && 'text-(--macos-text-muted)',
              )}
            >
              {title}
            </p>
          )}
        </div>
        <div className="relative min-h-0 flex-1">{children}</div>
      </div>
    </motion.section>
  )
}
