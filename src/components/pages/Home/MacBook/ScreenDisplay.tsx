import { useCallback, useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useContextBridge } from 'its-fine'
import MacOS from '@/components/pages/Home/MacOS/MacOS'
import { coverBox } from '@/logic/cameraFit/cameraFit'
import { canScrollBy } from '@/logic/scrollCapture/scrollCapture'

type ScreenDisplayProps = {
  isPoweredOn: boolean
  isInteractive: boolean
  isFitted: boolean
  onShutDown: () => void
}

const SCREEN_WIDTH_PX = 1512
const SCREEN_HEIGHT_PX = 982
const SCREEN_WIDTH_M = 0.3036
// Dessiné 2 fois plus grand puis réduit, sinon Chrome étire le calque 3D et le texte de macOS sort flou.
const RESOLUTION = 2
// En mode transform, drei Html fait valoir 1 px CSS distanceFactor / 400 unités du monde.
const DISTANCE_FACTOR = (SCREEN_WIDTH_M / (SCREEN_WIDTH_PX * RESOLUTION)) * 400
// En plein écran, le bureau garde au moins cette largeur logique (Dock et barre de menus entiers), réduit au besoin.
const FITTED_MIN_WIDTH = 1024
const FULL_SCREEN = { width: SCREEN_WIDTH_PX, height: SCREEN_HEIGHT_PX, scale: 1 }

function canAncestorScroll(target: EventTarget | null, boundary: HTMLElement, event: WheelEvent) {
  for (let node = target instanceof Element ? target : null; node && node !== boundary; node = node.parentElement) {
    const style = getComputedStyle(node)
    const isScrollableY =
      /(auto|scroll)/.test(style.overflowY) &&
      canScrollBy(
        { offset: node.scrollTop, contentSize: node.scrollHeight, viewportSize: node.clientHeight },
        event.deltaY,
      )
    const isScrollableX =
      /(auto|scroll)/.test(style.overflowX) &&
      canScrollBy(
        { offset: node.scrollLeft, contentSize: node.scrollWidth, viewportSize: node.clientWidth },
        event.deltaX,
      )
    if (isScrollableY || isScrollableX) return true
  }
  return false
}

// Écran du MacBook : le composant MacOS à 1512 × 982 px, collé au plan Screen à l'échelle exacte.
export default function ScreenDisplay({ isPoweredOn, isInteractive, isFitted, onShutDown }: ScreenDisplayProps) {
  const aspect = useThree((state) => state.size.width / state.size.height)
  const box = isFitted
    ? coverBox({ width: SCREEN_WIDTH_PX, height: SCREEN_HEIGHT_PX }, aspect, FITTED_MIN_WIDTH)
    : FULL_SCREEN
  const isInteractiveRef = useRef(isInteractive)
  // drei Html rend dans une racine React à part : sans ce pont, MacOS perdrait la locale du site.
  const ContextBridge = useContextBridge()

  useEffect(() => {
    isInteractiveRef.current = isInteractive
  }, [isInteractive])

  // Ref en callback, car drei Html monte son contenu après nos effets.
  const attachWheelCapture = useCallback((container: HTMLDivElement | null) => {
    if (!container) return
    const handleWheel = (event: WheelEvent) => {
      if (!isInteractiveRef.current) return
      if (canAncestorScroll(event.target, container, event)) event.stopPropagation()
    }
    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <Html
      transform
      distanceFactor={DISTANCE_FACTOR}
      position={[0, 0, 0.0005]}
      zIndexRange={[10, 0]}
      pointerEvents={isInteractive ? 'auto' : 'none'}
    >
      <div
        ref={attachWheelCapture}
        data-lenis-prevent
        data-mouse-trail="off"
        className="relative overflow-hidden overscroll-contain bg-black select-none"
        style={{ width: SCREEN_WIDTH_PX * RESOLUTION, height: SCREEN_HEIGHT_PX * RESOLUTION }}
      >
        {/* Plein écran : la caméra couvre la vue, macOS se loge exactement dans la partie visible de la dalle. */}
        <div
          className="absolute top-1/2 left-1/2 transition-[width,height,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{
            width: box.width,
            height: box.height,
            transform: `translate(-50%, -50%) scale(${box.scale * RESOLUTION})`,
          }}
        >
          <ContextBridge>
            <MacOS isPoweredOn={isPoweredOn} onShutdown={onShutDown} />
          </ContextBridge>
        </div>
      </div>
    </Html>
  )
}
