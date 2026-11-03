import { useEffect, useRef, useState } from 'react'
import FinderWindow from '@/components/pages/Home/MacOS/FinderWindow'
import type { WindowFrameProps } from '@/components/pages/Home/MacOS/Window'
import { Input } from '@/components/ui/input'
import { ABOUT_PATH, MACOS } from '@/data/macos'
import { useMacFiles } from '@/components/pages/Home/MacOS/useMacFiles'
import { useLocale } from '@/lib/LocaleProvider'
import { findNode } from '@/logic/macos/fileTree/fileTree'
import { runTerminalCommand } from '@/logic/macos/terminal/terminal'

type TerminalProps = { frame: WindowFrameProps }

type TerminalLine = { id: number; text: string; isCommand: boolean }

export default function Terminal({ frame }: TerminalProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].terminal
  const [lines, setLines] = useState<TerminalLine[]>([{ id: 0, text: texts.welcome, isCommand: false }])
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(1)
  const root = useMacFiles()
  const prompt = `${texts.host} ~ %`
  const withUser = (template: string) => template.replace('{user}', root.name)

  useEffect(() => {
    if (frame.isFocused) inputRef.current?.focus({ preventScroll: true })
  }, [frame.isFocused])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [lines])

  const submit = () => {
    const about = findNode(root, ABOUT_PATH)
    const aboutFiles = about?.kind === 'text' ? { [about.name]: about.content } : {}
    const result = runTerminalCommand(input, {
      userName: texts.whoami,
      workingDirectory: withUser(texts.workingDirectory),
      listing: [...root.children.map((node) => node.name), ...Object.keys(aboutFiles)],
      files: aboutFiles,
      texts,
    })
    const command = { id: nextId.current++, text: `${prompt} ${input}`, isCommand: true }
    setInput('')
    if (result.kind === 'clear') {
      setLines([])
      return
    }
    setLines((current) => [
      ...current,
      command,
      ...result.lines.map((text) => ({ id: nextId.current++, text, isCommand: false })),
    ])
  }

  return (
    <FinderWindow frame={frame} title={withUser(texts.title)} contentClassName="bg-(--macos-terminal-bg)">
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus({ preventScroll: true })}
        className="absolute inset-0 cursor-text overflow-y-auto px-[12px] py-[10px] font-sans text-[13px] tabular-nums leading-[1.5] text-(--macos-terminal-text)"
      >
        {lines.map((line) => (
          <p key={line.id} className="min-h-[1.5em] whitespace-pre-wrap select-text">
            {line.text}
          </p>
        ))}
        <form
          className="flex gap-[8px]"
          onSubmit={(event) => {
            event.preventDefault()
            submit()
          }}
        >
          <span className="shrink-0 text-(--macos-terminal-prompt)">{prompt}</span>
          <Input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            aria-label={texts.inputLabel}
            autoComplete="off"
            spellCheck={false}
            className="h-auto flex-1 rounded-none p-0 text-[13px] leading-[1.5] text-(--macos-terminal-text) caret-(--macos-terminal-prompt) outline-none! focus-visible:ring-0"
          />
        </form>
      </div>
    </FinderWindow>
  )
}
