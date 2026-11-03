import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import FinderWindow from '@/components/pages/Home/MacOS/FinderWindow'
import type { WindowFrameProps } from '@/components/pages/Home/MacOS/Window'
import { MACOS } from '@/data/macos'
import { SITE } from '@/data/site'
import { useLocale } from '@/lib/LocaleProvider'

type MailProps = { frame: WindowFrameProps }

const FIELD_ROW = 'flex h-[38px] items-center gap-[8px] border-b border-(--macos-separator) px-[18px]'

export default function Mail({ frame }: MailProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].mail
  const [subject, setSubject] = useState(texts.subjectValue)
  const [message, setMessage] = useState(texts.messageValue)

  // Le vrai envoi passe par le client mail du visiteur.
  const send = () => {
    const url = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener')
  }

  return (
    <FinderWindow
      frame={frame}
      title={MACOS[locale].appNames.mail}
      toolbar={
        <>
          <p className="ml-[4px] min-w-0 flex-1 truncate text-[15px] font-bold">{MACOS[locale].appNames.mail}</p>
          <Button
          size="sm"
          onClick={send}
          className="ml-auto bg-(--macos-selection) px-[12px] text-[12px] text-(--macos-icon-glyph) hover:bg-(--macos-selection)/85"
        >
          <Send data-icon="inline-start" />
            {texts.send}
          </Button>
        </>
      }
    >
      <div className="absolute inset-0 flex flex-col">
        <div className={FIELD_ROW}>
          <span className="text-(--macos-text-muted)">{texts.to}</span>
          <span className="rounded-[5px] bg-(--macos-selection-soft) px-[8px] py-[1px]">{SITE.email}</span>
        </div>
        <label className={FIELD_ROW}>
          <span className="text-(--macos-text-muted)">{texts.subject}</span>
          <Input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="h-full rounded-none px-0 py-0 text-[13px] text-(--macos-text) select-text outline-none! focus-visible:ring-0"
          />
        </label>
        <Textarea
          aria-label={texts.message}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="min-h-0 flex-1 rounded-none px-[18px] py-[14px] text-[14px] leading-[1.6] text-(--macos-text) select-text outline-none! focus-visible:ring-0"
        />
      </div>
    </FinderWindow>
  )
}
