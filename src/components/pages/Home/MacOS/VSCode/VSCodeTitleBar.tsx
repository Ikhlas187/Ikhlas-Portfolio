import { ArrowLeft, ArrowRight, PanelBottom, PanelLeft, PanelRight, Search } from 'lucide-react'

type VSCodeTitleBarProps = { label: string }

const DECOR = 'size-[16px] text-(--macos-vscode-icon)'

export default function VSCodeTitleBar({ label }: VSCodeTitleBarProps) {
  return (
    <div
      data-window-drag
      className="relative flex h-[52px] shrink-0 items-center border-b border-(--macos-vscode-border) bg-(--macos-vscode-titlebar) pr-[12px] pl-[90px]"
    >
      <span aria-hidden="true" className="flex items-center gap-[10px]">
        <ArrowLeft strokeWidth={1.6} className={DECOR} />
        <ArrowRight strokeWidth={1.6} className={DECOR} />
      </span>
      <p className="absolute left-1/2 flex h-[24px] w-[38%] min-w-[220px] -translate-x-1/2 items-center justify-center gap-[6px] rounded-[6px] border border-(--macos-vscode-border) bg-(--macos-vscode-input) px-[8px] text-[12px] text-(--macos-vscode-muted)">
        <Search aria-hidden="true" strokeWidth={1.8} className="size-[13px]" />
        <span className="truncate">{label}</span>
      </p>
      <span aria-hidden="true" className="ml-auto flex items-center gap-[10px]">
        <PanelLeft strokeWidth={1.6} className={DECOR} />
        <PanelBottom strokeWidth={1.6} className={DECOR} />
        <PanelRight strokeWidth={1.6} className={DECOR} />
      </span>
    </div>
  )
}
