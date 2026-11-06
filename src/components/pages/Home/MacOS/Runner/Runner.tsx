import { useEffect, useRef, useState } from 'react'
import FinderWindow from '@/components/pages/Home/MacOS/FinderWindow'
import type { WindowFrameProps } from '@/components/pages/Home/MacOS/Window'
import { MACOS } from '@/data/macos'
import { REPO_RUNS } from '@/data/projectShowcase'
import { useLocale } from '@/lib/LocaleProvider'
import { commitInput, EMPTY_SCREEN, writeOutput, type TerminalScreen } from '@/logic/macos/terminalScreen/terminalScreen'

type RunnerProps = { frame: WindowFrameProps; repo: string }

type Status = 'loading' | 'running' | 'waiting' | 'exited' | 'error'

// Module Emscripten (voir tools/runs/) : stdout branché caractère par caractère, readLine attend la saisie du visiteur.
type ProgramModule = {
  FS: { init: (input: null, output: (code: number) => void, error: (code: number) => void) => void }
  preRun: (() => void)[]
  readLine: () => Promise<string>
  onExit: () => void
  locateFile: (path: string) => string
}

type ProgramFactory = (module: Partial<ProgramModule>) => Promise<unknown>

// Le script est lu puis importé depuis une URL blob : Vite refuse en dev l'import direct d'un fichier de public/.
async function loadProgram(moduleUrl: string) {
  const source = await fetch(moduleUrl).then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response.text()
  })
  const blobUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }))
  try {
    return (await import(/* @vite-ignore */ blobUrl)) as { default: ProgramFactory }
  } finally {
    URL.revokeObjectURL(blobUrl)
  }
}

/* App Exécution : charge le programme compilé en WebAssembly seulement à l'ouverture, et le fait tourner pour de vrai,
   sortie et saisies au clavier dans la fenêtre, comme dans un terminal. */
export default function Runner({ frame, repo }: RunnerProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].runner
  const repoRun = REPO_RUNS[repo]
  const [screen, setScreen] = useState<TerminalScreen>(EMPTY_SCREEN)
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<Status>('loading')
  const [runId, setRunId] = useState(0)
  const pendingLine = useRef<((line: string) => void) | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (repoRun?.kind !== 'wasm') return
    let isCurrent = true
    // La sortie arrive octet par octet : regroupée et affichée une fois par image.
    const decoder = new TextDecoder()
    let pending = ''
    let frameRequest = 0
    const flush = () => {
      frameRequest = 0
      const text = pending
      pending = ''
      if (isCurrent && text) setScreen((current) => writeOutput(current, text))
    }
    const writeByte = (code: number) => {
      pending += decoder.decode(new Uint8Array([code]), { stream: true })
      if (!frameRequest) frameRequest = requestAnimationFrame(flush)
    }
    setScreen(EMPTY_SCREEN)
    setStatus('loading')
    loadProgram(repoRun.module)
      .then(({ default: create }) => {
        const program: Partial<ProgramModule> = {
          preRun: [() => program.FS?.init(null, writeByte, writeByte)],
          readLine: () =>
            new Promise<string>((resolve) => {
              flush()
              if (!isCurrent) return
              setStatus('waiting')
              pendingLine.current = resolve
            }),
          onExit: () => {
            flush()
            if (isCurrent) setStatus('exited')
          },
          locateFile: (path) => new URL(path, new URL(repoRun.module, window.location.href)).href,
        }
        if (isCurrent) setStatus('running')
        return create(program)
      })
      .catch(() => isCurrent && setStatus('error'))
    return () => {
      isCurrent = false
      cancelAnimationFrame(frameRequest)
      pendingLine.current = null
    }
  }, [repoRun, runId])

  useEffect(() => {
    if (frame.isFocused && status === 'waiting') inputRef.current?.focus({ preventScroll: true })
  }, [frame.isFocused, status])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [screen, status])

  const submit = () => {
    const resolve = pendingLine.current
    if (!resolve) return
    pendingLine.current = null
    setScreen((current) => commitInput(current, input))
    setInput('')
    setStatus('running')
    resolve(input)
  }

  const statusText = { loading: texts.loading, running: '', waiting: '', exited: texts.exited, error: texts.error }[status]

  return (
    <FinderWindow frame={frame} title={repo} contentClassName="bg-(--macos-terminal-bg)">
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus({ preventScroll: true })}
        className="absolute inset-0 cursor-text overflow-y-auto px-[12px] py-[10px] font-(family-name:--font-macos-code) text-[12.5px] leading-[1.45] text-(--macos-terminal-text)"
      >
        {repoRun?.kind === 'wasm' && <p className="mb-[8px] text-(--macos-terminal-prompt)">{repoRun.hint[locale]}</p>}
        {screen.lines.map((line, index) => (
          <p key={index} className="min-h-[1.45em] whitespace-pre-wrap select-text">
            {line}
          </p>
        ))}
        {(screen.partial || status === 'waiting') && (
          <form
            className="flex min-h-[1.45em] whitespace-pre-wrap"
            onSubmit={(event) => {
              event.preventDefault()
              submit()
            }}
          >
            <span className="select-text">{screen.partial}</span>
            {status === 'waiting' && (
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                aria-label={texts.inputLabel}
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent p-0 font-(family-name:--font-macos-code) text-[12.5px] leading-[1.45] text-(--macos-terminal-prompt) caret-(--macos-terminal-prompt) outline-none"
              />
            )}
          </form>
        )}
        {statusText && <p className="mt-[8px] text-(--macos-terminal-prompt)">{statusText}</p>}
        {(status === 'exited' || status === 'error') && (
          <button
            type="button"
            onClick={() => setRunId((id) => id + 1)}
            className="mt-[6px] cursor-pointer text-(--macos-terminal-prompt) underline"
          >
            {texts.restart}
          </button>
        )}
      </div>
    </FinderWindow>
  )
}
