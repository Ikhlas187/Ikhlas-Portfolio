import { useState } from 'react'
import BrowserAboutPage from '@/components/pages/Home/MacOS/Browser/BrowserAboutPage'
import BrowserFrame from '@/components/pages/Home/MacOS/Browser/BrowserFrame'
import BrowserLoading from '@/components/pages/Home/MacOS/Browser/BrowserLoading'
import BrowserNotFoundPage from '@/components/pages/Home/MacOS/Browser/BrowserNotFoundPage'
import BrowserProjectPage from '@/components/pages/Home/MacOS/Browser/BrowserProjectPage'
import BrowserToolbar from '@/components/pages/Home/MacOS/Browser/BrowserToolbar'
import Window, { type WindowFrameProps } from '@/components/pages/Home/MacOS/Window'
import { BROWSER_HOST, MACOS } from '@/data/macos'
import { PROJECTS } from '@/data/projects'
import { useLocale } from '@/lib/LocaleProvider'
import { projectSlug } from '@/logic/macos/projectSlug/projectSlug'
import {
  browserPageAddress,
  googleEmbedUrl,
  googlePublicUrl,
  resolveBrowserAddress,
  type BrowserPage,
} from '@/logic/macos/browserAddress/browserAddress'
import {
  createBrowserSession,
  currentPage,
  goBackInSession,
  goForwardInSession,
  goHome,
  navigateTo,
  reloadSession,
} from '@/logic/macos/browserSession/browserSession'
import { canGoBack, canGoForward } from '@/logic/macos/navigationHistory/navigationHistory'

type BrowserProps = { frame: WindowFrameProps }

const PROJECT_SLUGS = PROJECTS.en.map((project) => projectSlug(project.name))

export default function Browser({ frame }: BrowserProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].browser
  const [session, setSession] = useState(createBrowserSession)
  const [loadedKey, setLoadedKey] = useState<string | null>(null)
  const page = currentPage(session)

  const titleOf = (target: BrowserPage) => {
    switch (target.kind) {
      case 'about':
        return texts.aboutTitle
      case 'project':
        return PROJECTS[locale].find((project) => projectSlug(project.name) === target.slug)?.name ?? target.slug
      case 'google':
        return target.query === '' ? texts.google : texts.googleSearchTitle.replace('{query}', target.query)
      case 'external':
        return new URL(target.url).hostname.replace(/^www\./, '')
      case 'notFound':
        return texts.notFoundTitle
    }
  }

  // Chaque navigation ou rechargement remonte l'iframe, qui reste « en chargement » jusqu'à son onLoad.
  const pageKey = `${session.history.index}-${session.reloadCount}-${locale}`
  const frameUrl =
    page.kind === 'google' ? googleEmbedUrl(page.query, locale) : page.kind === 'external' ? page.url : undefined
  const externalUrl =
    page.kind === 'google' ? googlePublicUrl(page.query, locale) : page.kind === 'external' ? page.url : undefined
  const isLoading = frameUrl !== undefined && loadedKey !== pageKey

  return (
    <Window
      {...frame}
      title={titleOf(page)}
      toolbar={
        <BrowserToolbar
          address={browserPageAddress(page, BROWSER_HOST)}
          isLoading={isLoading}
          externalUrl={externalUrl}
          canGoBack={canGoBack(session.history)}
          canGoForward={canGoForward(session.history)}
          onBack={() => setSession(goBackInSession)}
          onForward={() => setSession(goForwardInSession)}
          onReload={() => setSession(reloadSession)}
          onHome={() => setSession(goHome)}
          onSubmitAddress={(address) => {
            const target = resolveBrowserAddress(address, { host: BROWSER_HOST, projectSlugs: PROJECT_SLUGS })
            if (target) setSession((current) => navigateTo(current, target))
          }}
        />
      }
      className="border-(--macos-finder-window-border) bg-(--macos-finder-window) text-(--macos-finder-text)"
      titleBarClassName="border-(--macos-finder-separator) bg-(--macos-finder-window) pr-[12px] pl-[14px]"
    >
      <div className="absolute inset-0 overflow-hidden overscroll-contain">
        {frameUrl !== undefined ? (
          <>
            {isLoading && <BrowserLoading label={texts.loading} />}
            <BrowserFrame
              key={pageKey}
              src={frameUrl}
              title={titleOf(page)}
              onFocus={frame.onFocus}
              onLoad={() => setLoadedKey(pageKey)}
            />
          </>
        ) : (
          <div key={pageKey} className="h-full overflow-y-auto overscroll-contain">
            {page.kind === 'about' && <BrowserAboutPage />}
            {page.kind === 'project' && <BrowserProjectPage slug={page.slug} />}
            {page.kind === 'notFound' && <BrowserNotFoundPage />}
          </div>
        )}
      </div>
    </Window>
  )
}
