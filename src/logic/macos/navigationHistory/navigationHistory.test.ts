import { describe, expect, it } from 'vitest'
import {
  isBackAvailable,
  isForwardAvailable,
  createHistory,
  currentEntry,
  goBack,
  goForward,
  pushEntry,
} from '@/logic/macos/navigationHistory/navigationHistory'

describe('navigationHistory', () => {
  it('démarre sur l’entrée initiale, sans retour ni suivant', () => {
    const freshHistory = createHistory('desktop')

    expect(currentEntry(freshHistory)).toBe('desktop')
    expect(isBackAvailable(freshHistory)).toBe(false)
    expect(isForwardAvailable(freshHistory)).toBe(false)
  })

  it('revient en arrière puis repart en avant', () => {
    const historyInProjects = pushEntry(createHistory('desktop'), 'projects')

    const historyAfterBack = goBack(historyInProjects)
    const historyAfterForward = goForward(historyAfterBack)

    expect(currentEntry(historyAfterBack)).toBe('desktop')
    expect(currentEntry(historyAfterForward)).toBe('projects')
  })

  it('efface les entrées suivantes quand on navigue après un retour', () => {
    const historyBackOnDesktop = goBack(pushEntry(createHistory('desktop'), 'projects'))

    const historyInDownloads = pushEntry(historyBackOnDesktop, 'downloads')

    expect(historyInDownloads.entries).toEqual(['desktop', 'downloads'])
    expect(isForwardAvailable(historyInDownloads)).toBe(false)
  })

  it('ne bouge pas quand on recule au début', () => {
    const freshHistory = createHistory('desktop')

    expect(goBack(freshHistory)).toBe(freshHistory)
  })
})
