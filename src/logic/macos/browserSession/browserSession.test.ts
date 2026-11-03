import { describe, expect, it } from 'vitest'
import {
  createBrowserSession,
  currentPage,
  goBackInSession,
  goForwardInSession,
  navigateTo,
  reloadSession,
} from '@/logic/macos/browserSession/browserSession'

const googleHome = { kind: 'google' as const, query: '' }
const searchPage = { kind: 'google' as const, query: 'ikhlas agbeti' }
const wikipediaPage = { kind: 'external' as const, url: 'https://wikipedia.org' }

describe('browserSession', () => {
  it('s’ouvre directement sur l’accueil de Google', () => {
    const freshSession = createBrowserSession()

    expect(currentPage(freshSession)).toEqual(googleHome)
  })

  it('revient à la recherche puis repart vers le site visité ensuite', () => {
    const sessionOnWikipedia = navigateTo(navigateTo(createBrowserSession(), searchPage), wikipediaPage)

    const sessionBackOnSearch = goBackInSession(sessionOnWikipedia)
    const sessionForwardOnWikipedia = goForwardInSession(sessionBackOnSearch)

    expect(currentPage(sessionBackOnSearch)).toEqual(searchPage)
    expect(currentPage(sessionForwardOnWikipedia)).toEqual(wikipediaPage)
  })

  it('recharge sans toucher à l’historique', () => {
    const sessionOnSearch = navigateTo(createBrowserSession(), searchPage)

    const reloadedSession = reloadSession(sessionOnSearch)

    expect(reloadedSession.reloadCount).toBe(1)
    expect(reloadedSession.history).toEqual(sessionOnSearch.history)
  })
})
