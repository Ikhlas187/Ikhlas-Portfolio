import { describe, expect, it } from 'vitest'
import {
  activeTab,
  closeTab,
  createBrowserTabs,
  openTab,
  selectTab,
  updateActiveSession,
} from '@/logic/macos/browserTabs/browserTabs'
import { currentPage, navigateTo } from '@/logic/macos/browserSession/browserSession'

const googleHome = { kind: 'google' as const, query: '' }
const searchPage = { kind: 'google' as const, query: 'ikhlas agbeti' }

describe('browserTabs', () => {
  it('s’ouvre sur un seul onglet, actif, sur l’accueil de Google', () => {
    const freshTabs = createBrowserTabs('a')

    expect(freshTabs.tabs).toHaveLength(1)
    expect(activeTab(freshTabs).id).toBe('a')
    expect(currentPage(activeTab(freshTabs).session)).toEqual(googleHome)
  })

  it('active le nouvel onglet, ouvert lui aussi sur Google', () => {
    const singleTab = createBrowserTabs('a')

    const twoTabs = openTab(singleTab, 'b')

    expect(twoTabs.tabs.map((tab) => tab.id)).toEqual(['a', 'b'])
    expect(activeTab(twoTabs).id).toBe('b')
    expect(currentPage(activeTab(twoTabs).session)).toEqual(googleHome)
  })

  it('ne navigue que dans l’onglet actif', () => {
    const twoTabs = openTab(createBrowserTabs('a'), 'b')

    const tabsAfterSearch = updateActiveSession(twoTabs, (session) => navigateTo(session, searchPage))

    expect(currentPage(tabsAfterSearch.tabs[1].session)).toEqual(searchPage)
    expect(currentPage(tabsAfterSearch.tabs[0].session)).toEqual(googleHome)
  })

  it('ignore la sélection d’un onglet inconnu', () => {
    const twoTabs = openTab(createBrowserTabs('a'), 'b')

    expect(selectTab(twoTabs, 'z')).toBe(twoTabs)
  })

  it('active le dernier onglet restant quand on ferme l’onglet actif', () => {
    const threeTabsOnFirst = selectTab(openTab(openTab(createBrowserTabs('a'), 'b'), 'c'), 'a')

    const tabsAfterClosing = closeTab(threeTabsOnFirst, 'a')

    expect(tabsAfterClosing).toEqual({ tabs: threeTabsOnFirst.tabs.slice(1), activeId: 'c' })
  })

  it('garde l’onglet actif quand on en ferme un autre', () => {
    const twoTabsOnSecond = openTab(createBrowserTabs('a'), 'b')

    expect(closeTab(twoTabsOnSecond, 'a')?.activeId).toBe('b')
  })

  it('renvoie null quand on ferme le dernier onglet', () => {
    const singleTab = createBrowserTabs('a')

    expect(closeTab(singleTab, 'a')).toBeNull()
  })
})
