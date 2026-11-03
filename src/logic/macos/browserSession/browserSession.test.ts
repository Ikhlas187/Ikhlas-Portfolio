import { describe, expect, it } from 'vitest'
import {
  createBrowserSession,
  currentPage,
  goBackInSession,
  goForwardInSession,
  goHome,
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

  it('ramène à Google depuis un autre site en ajoutant une entrée à l’historique', () => {
    const sessionOnWikipedia = navigateTo(createBrowserSession(), wikipediaPage)

    const sessionBackHome = goHome(sessionOnWikipedia)

    expect(currentPage(sessionBackHome)).toEqual(googleHome)
    expect(sessionBackHome.history.entries).toHaveLength(3)
  })

  it('recharge Google au lieu de l’empiler quand on est déjà sur son accueil', () => {
    const freshSession = createBrowserSession()

    const sessionAfterHome = goHome(freshSession)

    expect(sessionAfterHome.history.entries).toHaveLength(1)
    expect(sessionAfterHome.reloadCount).toBe(1)
  })
})
