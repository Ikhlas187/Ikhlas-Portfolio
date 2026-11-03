import { useRef, useState } from 'react'
import BrowserAboutPage from '@/components/pages/Home/MacOS/Browser/BrowserAboutPage'
import BrowserBookmarks from '@/components/pages/Home/MacOS/Browser/BrowserBookmarks'
import BrowserFrame from '@/components/pages/Home/MacOS/Browser/BrowserFrame'
import BrowserFrameNotice from '@/components/pages/Home/MacOS/Browser/BrowserFrameNotice'
import BrowserLoading from '@/components/pages/Home/MacOS/Browser/BrowserLoading'
import BrowserNotFoundPage from '@/components/pages/Home/MacOS/Browser/BrowserNotFoundPage'
import BrowserProjectPage from '@/components/pages/Home/MacOS/Browser/BrowserProjectPage'
import BrowserTabStrip from '@/components/pages/Home/MacOS/Browser/BrowserTabStrip'
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
import { addBookmark, isBookmarked, type BrowserBookmark } from '@/logic/macos/browserBookmarks/browserBookmarks'
import { currentPage, goBackInSession, goForwardInSession, navigateTo, reloadSession } from '@/logic/macos/browserSession/browserSession'
import {
  activeTab,
  closeTab,
  createBrowserTabs,
  openTab,
  selectTab,
  updateActiveSession,
} from '@/logic/macos/browserTabs/browserTabs'
import { canGoBack, canGoForward } from '@/logic/macos/navigationHistory/navigationHistory'

type BrowserProps = { frame: WindowFrameProps }

const PROJECT_SLUGS = PROJECTS.en.map((project) => projectSlug(project.name))
const ADDRESS_CONTEXT = { host: BROWSER_HOST, projectSlugs: PROJECT_SLUGS }
const GOOGLE_ADDRESS = 'https://www.google.com'

// Contour copié du Safari de mihrimatrix/macos-clone-react (onglets, signets, bandeau), intérieur Google gardé.
export default function Browser({ frame }: BrowserProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].browser
  const nextTabId = useRef(1)
  const { url: requestedUrl, requestId } = frame.window.payload
  const [tabs, setTabs] = useState(() => {
    const initial = createBrowserTabs('tab-0')
    return requestedUrl ? updateActiveSession(initial, (active) => navigateTo(active, { kind: 'external', url: requestedUrl })) : initial
  })
  const [handledRequestId, setHandledRequestId] = useState(requestId)

  // Safari déjà ouvert et nouvelle URL demandée (clic droit « Voir dans le navigateur ») : elle s'ouvre dans un nouvel onglet.
  if (requestId !== handledRequestId) {
    setHandledRequestId(requestId)
    if (requestedUrl) {
      const opened = openTab(tabs, `tab-request-${requestId}`)
      setTabs(updateActiveSession(opened, (active) => navigateTo(active, { kind: 'external', url: requestedUrl })))
    }
  }
  const [addedBookmarks, setAddedBookmarks] = useState<BrowserBookmark[]>([])
  const [loadedKey, setLoadedKey] = useState<string | null>(null)
  const tab = activeTab(tabs)
  const session = tab.session
  const page = currentPage(session)
  const address = browserPageAddress(page, BROWSER_HOST)

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

  const defaultBookmarks: BrowserBookmark[] = [
    { title: texts.google, address: GOOGLE_ADDRESS },
    { title: texts.aboutTitle, address: browserPageAddress({ kind: 'about' }, BROWSER_HOST) },
    ...PROJECTS[locale].map((project) => ({
      title: project.name,
      address: browserPageAddress({ kind: 'project', slug: projectSlug(project.name) }, BROWSER_HOST),
    })),
  ]
  const bookmarks = addedBookmarks.reduce(addBookmark, defaultBookmarks)

  const goTo = (input: string) => {
    const target = resolveBrowserAddress(input, ADDRESS_CONTEXT)
    if (target) setTabs((current) => updateActiveSession(current, (active) => navigateTo(active, target)))
  }

  // Chaque navigation ou rechargement remonte l'iframe, qui reste « en chargement » jusqu'à son onLoad.
  const pageKey = `${tab.id}-${session.history.index}-${session.reloadCount}-${locale}`
  const frameUrl =
    page.kind === 'google' ? googleEmbedUrl(page.query, locale) : page.kind === 'external' ? page.url : undefined
  const externalUrl =
    page.kind === 'google' ? googlePublicUrl(page.query, locale) : page.kind === 'external' ? page.url : undefined
  const isLoading = frameUrl !== undefined && loadedKey !== pageKey

  return (
    <Window {...frame} title={titleOf(page)} hasToolbarRow={false}>
      <div className="absolute inset-0 flex flex-col bg-(--macos-frame-surface) font-(family-name:--font-macos-frame) tracking-[-0.006em] text-(--macos-frame-fg)">
        <BrowserToolbar
          address={address}
          isLoading={isLoading}
          isBookmarked={isBookmarked(bookmarks, address)}
          canGoBack={canGoBack(session.history)}
          canGoForward={canGoForward(session.history)}
          onBack={() => setTabs((current) => updateActiveSession(current, goBackInSession))}
          onForward={() => setTabs((current) => updateActiveSession(current, goForwardInSession))}
          onReload={() => setTabs((current) => updateActiveSession(current, reloadSession))}
          onBookmark={() =>
            setAddedBookmarks((current) => addBookmark(current, { title: titleOf(page), address }))
          }
          onNewTab={() => setTabs((current) => openTab(current, `tab-${nextTabId.current++}`))}
          onSubmitAddress={goTo}
        />
        {tabs.tabs.length > 1 && (
          <BrowserTabStrip
            tabs={tabs.tabs.map((item) => ({ id: item.id, title: titleOf(currentPage(item.session)) }))}
            activeId={tab.id}
            onSelect={(id) => setTabs((current) => selectTab(current, id))}
            onClose={(id) => {
              const remaining = closeTab(tabs, id)
              if (remaining) setTabs(remaining)
              else frame.onClose()
            }}
          />
        )}
        <BrowserBookmarks bookmarks={bookmarks} onOpen={goTo} />
        {externalUrl && <BrowserFrameNotice externalUrl={externalUrl} />}
        <div className="relative min-h-0 flex-1 overflow-hidden overscroll-contain">
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
      </div>
    </Window>
  )
}
