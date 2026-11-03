import AppleLogo from '@/components/pages/Home/MacOS/AppleLogo'
import FinderWindow from '@/components/pages/Home/MacOS/FinderWindow'
import type { WindowFrameProps } from '@/components/pages/Home/MacOS/Window'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'

type AboutThisMacProps = { frame: WindowFrameProps; onMoreInfo: () => void }

export default function AboutThisMac({ frame, onMoreInfo }: AboutThisMacProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].about

  return (
    <FinderWindow frame={frame} title={texts.title} canZoom={false} toolbar={null}>
      <div className="absolute inset-0 flex flex-col items-center px-[26px] pb-[22px] text-center">
        <AppleLogo className="mt-[6px] h-[80px] w-[68px] text-(--macos-text) drop-shadow-(--macos-shadow-icon)" />
        <h2 className="mt-[14px] font-sans text-[22px] font-bold">{texts.name}</h2>
        <p className="text-[12px] text-(--macos-text-muted)">{texts.role}</p>
        <dl className="mt-[18px] grid w-full grid-cols-[auto_1fr] gap-x-[12px] gap-y-[5px] text-left text-[11.5px]">
          {texts.rows.map((row) => (
            <div key={row.label} className="contents">
              <dt className="text-right text-(--macos-text-muted)">{row.label}</dt>
              <dd className="select-text">{row.value}</dd>
            </div>
          ))}
        </dl>
        <button
          type="button"
          onClick={onMoreInfo}
          className="mt-auto h-[24px] cursor-pointer rounded-[6px] bg-(--macos-pressed) px-[14px] text-[12px] hover:bg-(--macos-hover)"
        >
          {texts.moreInfo}
        </button>
      </div>
    </FinderWindow>
  )
}
