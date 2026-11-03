type BrowserLoadingProps = { label: string }

export default function BrowserLoading({ label }: BrowserLoadingProps) {
  return (
    <div
      role="status"
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-[12px] bg-(--macos-finder-window)"
    >
      <span
        aria-hidden="true"
        className="size-[32px] rounded-full border-[3px] border-(--macos-finder-accent) border-t-transparent motion-safe:animate-spin"
      />
      <span className="text-[13px] text-(--macos-finder-text-muted)">{label}</span>
    </div>
  )
}
