import { useEffect, useRef, useState } from 'react'
import FinderWindow from '@/components/pages/Home/MacOS/FinderWindow'
import type { WindowFrameProps } from '@/components/pages/Home/MacOS/Window'
import { MACOS } from '@/data/macos'
import { REPO_RUNS } from '@/data/projectShowcase'
import { useLocale } from '@/lib/LocaleProvider'
import { counterScale } from '@/logic/macos/counterScale/counterScale'

type QtRunnerProps = { frame: WindowFrameProps; repo: string }

type Status = 'loading' | 'running' | 'exited' | 'error'

// Config de qtLoad (public/runs/<app>/qtloader.js, fourni par Qt).
type QtLoadConfig = {
  locateFile: (path: string) => string
  qt: {
    containerElements: HTMLElement[]
    entryFunction: unknown
    onLoaded: () => void
    onExit: (status: { crashed: boolean }) => void
  }
}

type QtWindow = Window & { qtLoad?: (config: QtLoadConfig) => Promise<unknown> } & Record<string, unknown>

// Scripts classiques (pas des modules) : ajoutés une seule fois à la page, réutilisés aux lancements suivants.
function loadScript(src: string) {
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
  if (existing?.dataset.loaded) return Promise.resolve()
  return new Promise<void>((resolve, reject) => {
    const script = existing ?? document.createElement('script')
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true'
      resolve()
    })
    script.addEventListener('error', () => reject(new Error(src)))
    if (!existing) {
      script.src = src
      document.body.append(script)
    }
  })
}

/* App Exécution, variante Qt : charge au clic une app Qt Widgets compilée en WebAssembly et la dessine dans la fenêtre,
   avec ses vraies fenêtres, menus et boîtes de dialogue. */
export default function QtRunner({ frame, repo }: QtRunnerProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].runner
  const repoRun = REPO_RUNS[repo]
  const [status, setStatus] = useState<Status>('loading')
  const [runId, setRunId] = useState(0)
  const areaRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)

  // L'écran du Mac est rétréci en CSS : l'écran de Qt suit la zone de la fenêtre à sa vraie taille affichée.
  useEffect(() => {
    let frameRequest = 0
    let applied = ''
    const follow = () => {
      const area = areaRef.current
      const screen = screenRef.current
      if (area && screen) {
        const layout = { width: area.offsetWidth, height: area.offsetHeight }
        const box = counterScale(layout, area.getBoundingClientRect().width)
        const next = `${box.width.toFixed(1)}:${box.height.toFixed(1)}:${box.inverseScale.toFixed(4)}`
        if (next !== applied) {
          applied = next
          screen.style.width = `${box.width}px`
          screen.style.height = `${box.height}px`
          screen.style.transform = `scale(${box.inverseScale})`
        }
      }
      frameRequest = requestAnimationFrame(follow)
    }
    follow()
    return () => cancelAnimationFrame(frameRequest)
  }, [])

  useEffect(() => {
    const screen = screenRef.current
    if (repoRun?.kind !== 'qt' || !screen) return
    let isCurrent = true
    setStatus('loading')
    loadScript(repoRun.loader)
      .then(() => loadScript(repoRun.script))
      .then(() => {
        const qtWindow = window as unknown as QtWindow
        if (!isCurrent || !qtWindow.qtLoad) return
        return qtWindow.qtLoad({
          locateFile: (path) => new URL(path, new URL(repoRun.script, window.location.href)).href,
          qt: {
            containerElements: [screen],
            entryFunction: qtWindow[repoRun.entry],
            onLoaded: () => isCurrent && setStatus('running'),
            onExit: ({ crashed }) => isCurrent && setStatus(crashed ? 'error' : 'exited'),
          },
        })
      })
      .catch(() => isCurrent && setStatus('error'))
    return () => {
      isCurrent = false
      screen.replaceChildren()
    }
  }, [repoRun, runId])

  const statusText = { loading: texts.loading, running: '', exited: texts.exited, error: texts.error }[status]

  return (
    <FinderWindow frame={frame} title={repo} contentClassName="bg-(--macos-terminal-bg)">
      <div ref={areaRef} data-wheel-capture className="absolute inset-0 overflow-hidden">
        <div ref={screenRef} className="absolute top-0 left-0 origin-top-left" />
      </div>
      {status !== 'running' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[10px] px-[40px] text-center font-(family-name:--font-macos-code) text-[12.5px] leading-[1.45] text-(--macos-terminal-prompt)">
          {repoRun?.kind === 'qt' && <p>{repoRun.hint[locale]}</p>}
          <p className="text-(--macos-terminal-text)">{statusText}</p>
          {(status === 'exited' || status === 'error') && (
            <button type="button" onClick={() => setRunId((id) => id + 1)} className="cursor-pointer underline">
              {texts.restart}
            </button>
          )}
        </div>
      )}
    </FinderWindow>
  )
}
