export type BrowserPage =
  | { kind: 'about' }
  | { kind: 'project'; slug: string }
  // Recherche Google affichée dans la fenêtre ; une requête vide ouvre la page d'accueil de Google.
  | { kind: 'google'; query: string }
  | { kind: 'external'; url: string }
  | { kind: 'notFound'; address: string }

export type BrowserAddressContext = { host: string; projectSlugs: string[] }

export const GOOGLE_HOME: BrowserPage = { kind: 'google', query: '' }

const GOOGLE_HOST = 'google.com'
const GOOGLE_URL = 'https://www.google.com'

function stripProtocol(address: string) {
  return address.replace(/^https?:\/\//i, '').replace(/^www\./i, '')
}

function isGoogleHost(host: string) {
  return host.toLowerCase().split(':')[0] === GOOGLE_HOST
}

function googleQueryOf(bare: string) {
  const queryStart = bare.indexOf('?')
  if (queryStart === -1) return ''
  return new URLSearchParams(bare.slice(queryStart + 1)).get('q')?.trim() ?? ''
}

// Même règle que le Safari de MacOS-Web-Simulator : sans point ou avec une espace, c'est une recherche.
export function isSearchQuery(input: string): boolean {
  const address = input.trim()
  return address !== '' && (!address.includes('.') || /\s/.test(address))
}

export function isGoogleHome(page: BrowserPage): boolean {
  return page.kind === 'google' && page.query === ''
}

// Une saisie vide ne mène nulle part : la barre d'adresse l'ignore.
export function resolveBrowserAddress(input: string, context: BrowserAddressContext): BrowserPage | null {
  const address = input.trim()
  if (address === '') return null
  if (isSearchQuery(address)) return { kind: 'google', query: address }

  const bare = stripProtocol(address).replace(/\/+$/, '')
  const host = bare.split(/[/?#]/)[0]

  if (host.toLowerCase() === context.host) {
    const [section, slug] = bare
      .split('/')
      .slice(1)
      .map((segment) => segment.toLowerCase())
    if (!section || (section === 'about' && !slug)) return { kind: 'about' }
    if (section === 'projects' && slug && context.projectSlugs.includes(slug)) return { kind: 'project', slug }
    return { kind: 'notFound', address: bare }
  }

  if (isGoogleHost(host)) return { kind: 'google', query: googleQueryOf(bare) }
  return { kind: 'external', url: /^https?:\/\//i.test(address) ? address : `https://${address}` }
}

// igu=1 : seule variante de Google acceptée en iframe ; newwindow=1 ouvre les résultats (qui refusent l'iframe) dans un vrai onglet.
export function googleEmbedUrl(query: string, language: string): string {
  const params = new URLSearchParams({ igu: '1', hl: language, newwindow: '1' })
  if (query === '') return `${GOOGLE_URL}/webhp?${params}`
  params.set('q', query)
  return `${GOOGLE_URL}/search?${params}`
}

// Adresse ouverte dans un vrai onglet du navigateur du visiteur.
export function googlePublicUrl(query: string, language: string): string {
  const params = new URLSearchParams({ hl: language })
  if (query === '') return `${GOOGLE_URL}/?${params}`
  params.set('q', query)
  return `${GOOGLE_URL}/search?${params}`
}

// Adresse affichée dans la barre : vide sur l'accueil de Google, pour laisser voir le texte indicatif.
export function browserPageAddress(page: BrowserPage, host: string): string {
  switch (page.kind) {
    case 'about':
      return `https://${host}/about`
    case 'project':
      return `https://${host}/projects/${page.slug}`
    case 'google':
      return page.query === '' ? '' : `${GOOGLE_URL}/search?q=${encodeURIComponent(page.query)}`
    case 'external':
      return page.url
    case 'notFound':
      return `https://${page.address}`
  }
}
