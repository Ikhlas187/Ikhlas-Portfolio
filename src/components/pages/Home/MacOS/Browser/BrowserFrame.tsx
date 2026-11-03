import { useEffect, useRef } from 'react'

type BrowserFrameProps = { src: string; title: string; onFocus: () => void; onLoad: () => void }

export default function BrowserFrame({ src, title, onFocus, onLoad }: BrowserFrameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null)

  // Un clic dans l'iframe n'arrive jamais jusqu'à la fenêtre : on le repère au focus qui quitte la page.
  useEffect(() => {
    const handleBlur = () => {
      if (document.activeElement === frameRef.current) onFocus()
    }
    window.addEventListener('blur', handleBlur)
    return () => window.removeEventListener('blur', handleBlur)
  }, [onFocus])

  return (
    <iframe
      ref={frameRef}
      src={src}
      title={title}
      onLoad={onLoad}
      referrerPolicy="no-referrer"
      className="block size-full border-0 bg-(--macos-finder-window)"
    />
  )
}
