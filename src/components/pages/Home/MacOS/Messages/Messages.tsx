import { useEffect, useRef, useState } from 'react'
import { ArrowUp, Search } from 'lucide-react'
import IAEmblem from '@/components/pages/Home/MacOS/IAEmblem'
import FinderWindow from '@/components/pages/Home/MacOS/FinderWindow'
import type { WindowFrameProps } from '@/components/pages/Home/MacOS/Window'
import { Input } from '@/components/ui/input'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'

type MessagesProps = { frame: WindowFrameProps }

type Bubble = { id: string; text: string; isFromVisitor: boolean }

const REPLY_DELAY_MS = 900

export default function Messages({ frame }: MessagesProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].messages
  const [sent, setSent] = useState<Bubble[]>([])
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)
  const bubbles = [...texts.conversation, ...sent]
  const lastBubble = bubbles.at(-1)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [sent])

  useEffect(() => {
    if (!lastBubble?.isFromVisitor) return
    const timeoutId = window.setTimeout(() => {
      setSent((current) => [...current, { id: `reply-${nextId.current++}`, text: texts.reply, isFromVisitor: false }])
    }, REPLY_DELAY_MS)
    return () => window.clearTimeout(timeoutId)
  }, [lastBubble, texts.reply])

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setSent((current) => [...current, { id: `sent-${nextId.current++}`, text, isFromVisitor: true }])
    setDraft('')
  }

  return (
    <FinderWindow
      frame={frame}
      title={texts.contactName}
      sidebarClassName="w-[240px]"
      sidebar={
        <div className="flex flex-col gap-[10px]">
          <p className="flex h-[26px] items-center gap-[6px] rounded-[6px] bg-(--macos-field) px-[8px] text-(--macos-text-muted)">
            <Search strokeWidth={2} className="size-[13px]" />
            {texts.search}
          </p>
          <div className="flex items-center gap-[10px] rounded-[8px] bg-(--macos-selection) px-[8px] py-[8px] text-(--macos-icon-glyph)">
            <span className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-linear-to-b from-(--color-accent) to-(--macos-icon-photos-to)">
              <IAEmblem className="text-[15px]" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-semibold">{texts.contactName}</span>
              <span className="block truncate text-[11px] opacity-80">{lastBubble?.text}</span>
            </span>
          </div>
        </div>
      }
      toolbar={
        <div className="flex flex-col">
          <p className="text-[14px] font-semibold">{texts.contactName}</p>
          <p className="text-[11px] text-(--macos-text-muted)">{texts.contactStatus}</p>
        </div>
      }
    >
      <div className="absolute inset-0 flex flex-col">
        <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-[6px] overflow-y-auto px-[18px] py-[16px]">
          {bubbles.map((bubble) => (
            <p
              key={bubble.id}
              className={cn(
                'max-w-[70%] rounded-[18px] px-[13px] py-[7px] text-[13px] leading-[1.4] select-text',
                bubble.isFromVisitor
                  ? 'self-end bg-(--macos-message-sent) text-(--macos-icon-glyph)'
                  : 'self-start bg-(--macos-message-received)',
              )}
            >
              {bubble.text}
            </p>
          ))}
        </div>
        <form
          className="flex shrink-0 items-center gap-[8px] px-[14px] pb-[14px]"
          onSubmit={(event) => {
            event.preventDefault()
            send()
          }}
        >
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={texts.inputPlaceholder}
            aria-label={texts.inputPlaceholder}
            autoComplete="off"
            className="h-[30px] flex-1 rounded-full border border-(--macos-separator) bg-transparent px-[14px] text-[13px] text-(--macos-text) select-text outline-none! focus-visible:ring-0"
          />
          <button
            type="submit"
            aria-label={texts.send}
            disabled={!draft.trim()}
            className="flex size-[26px] cursor-pointer items-center justify-center rounded-full bg-(--macos-message-sent) text-(--macos-icon-glyph) disabled:cursor-default disabled:opacity-40"
          >
            <ArrowUp strokeWidth={2.5} className="size-[15px]" />
          </button>
        </form>
      </div>
    </FinderWindow>
  )
}
