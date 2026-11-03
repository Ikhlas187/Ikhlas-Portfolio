import { describe, expect, it } from 'vitest'
import {
  browserPageAddress,
  googleEmbedUrl,
  googlePublicUrl,
  isGoogleHome,
  isSearchQuery,
  resolveBrowserAddress,
} from '@/logic/macos/browserAddress/browserAddress'

const context = { host: 'ikhlas.studio', projectSlugs: ['nevora', 'drip'] }

describe('resolveBrowserAddress', () => {
  it('ignore une saisie vide', () => {
    const blankAddress = '   '

    expect(resolveBrowserAddress(blankAddress, context)).toBeNull()
  })

  it.each([
    ['ikhlas.studio', { kind: 'about' }],
    ['https://www.ikhlas.studio/', { kind: 'about' }],
    ['ikhlas.studio/about', { kind: 'about' }],
    ['ikhlas.studio/projects/NEVORA', { kind: 'project', slug: 'nevora' }],
  ])('ouvre la page interne pour « %s »', (address, internalPage) => {
    expect(resolveBrowserAddress(address, context)).toEqual(internalPage)
  })

  it('renvoie une page introuvable pour un projet inconnu du site', () => {
    const unknownProject = 'ikhlas.studio/projects/unknown'

    expect(resolveBrowserAddress(unknownProject, context)).toEqual({
      kind: 'notFound',
      address: 'ikhlas.studio/projects/unknown',
    })
  })

  it('ajoute https à un site externe tapé sans protocole', () => {
    const externalSite = 'github.com/Ikhlas187'

    expect(resolveBrowserAddress(externalSite, context)).toEqual({
      kind: 'external',
      url: 'https://github.com/Ikhlas187',
    })
  })

  it('transforme une saisie qui n’est pas une adresse en recherche Google', () => {
    const searchTerms = 'react portfolio'

    expect(resolveBrowserAddress(searchTerms, context)).toEqual({ kind: 'google', query: 'react portfolio' })
  })

  it.each([
    ['google.com', ''],
    ['https://www.google.com/', ''],
    ['google.com/search?q=ikhlas+agbeti', 'ikhlas agbeti'],
  ])('ouvre Google dans la fenêtre pour « %s »', (address, query) => {
    expect(resolveBrowserAddress(address, context)).toEqual({ kind: 'google', query })
  })
})

describe('isSearchQuery', () => {
  it.each([
    ['react portfolio', true],
    ['portfolio', true],
    ['localhost:5175', true],
    ['https://localhost:5175', true],
    ['github.com/Ikhlas187', false],
    ['wikipedia.org', false],
    ['react.js tutorial', true],
    ['   ', false],
  ])('« %s » est une recherche : %s', (input, isSearch) => {
    expect(isSearchQuery(input)).toBe(isSearch)
  })
})

describe('googleEmbedUrl', () => {
  it('construit la recherche intégrable dans la langue du site, résultats dans un nouvel onglet', () => {
    const query = 'développeur & React'

    expect(googleEmbedUrl(query, 'fr')).toBe(
      'https://www.google.com/search?igu=1&hl=fr&newwindow=1&q=d%C3%A9veloppeur+%26+React',
    )
  })

  it('ouvre la page d’accueil intégrable de Google sans requête', () => {
    const emptyQuery = ''

    expect(googleEmbedUrl(emptyQuery, 'en')).toBe('https://www.google.com/webhp?igu=1&hl=en&newwindow=1')
  })
})

describe('googlePublicUrl', () => {
  it('construit la recherche à ouvrir dans un vrai onglet, sans igu', () => {
    const query = 'react portfolio'

    expect(googlePublicUrl(query, 'en')).toBe('https://www.google.com/search?hl=en&q=react+portfolio')
  })
})

describe('isGoogleHome', () => {
  it.each([
    [{ kind: 'google' as const, query: '' }, true],
    [{ kind: 'google' as const, query: 'react' }, false],
    [{ kind: 'about' as const }, false],
  ])('%o est l’accueil de Google : %s', (page, isHome) => {
    expect(isGoogleHome(page)).toBe(isHome)
  })
})

describe('browserPageAddress', () => {
  it('laisse la barre vide sur l’accueil de Google', () => {
    const googleHome = { kind: 'google' as const, query: '' }

    expect(browserPageAddress(googleHome, 'ikhlas.studio')).toBe('')
  })

  it('affiche une recherche Google comme son adresse publique, sans igu', () => {
    const searchPage = { kind: 'google' as const, query: 'ikhlas agbeti' }

    expect(browserPageAddress(searchPage, 'ikhlas.studio')).toBe('https://www.google.com/search?q=ikhlas%20agbeti')
  })

  it('affiche l’adresse complète d’une page projet', () => {
    const nevoraPage = { kind: 'project' as const, slug: 'nevora' }

    expect(browserPageAddress(nevoraPage, 'ikhlas.studio')).toBe('https://ikhlas.studio/projects/nevora')
  })

  it('affiche un site externe tel qu’il a été ouvert', () => {
    const wikipediaPage = { kind: 'external' as const, url: 'https://wikipedia.org' }

    expect(browserPageAddress(wikipediaPage, 'ikhlas.studio')).toBe('https://wikipedia.org')
  })
})
