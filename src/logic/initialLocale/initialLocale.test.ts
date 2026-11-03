import { describe, expect, it } from 'vitest'
import { isLocale, resolveInitialLocale } from '@/logic/initialLocale/initialLocale'

describe('resolveInitialLocale', () => {
  it('garde le choix enregistré, même si le navigateur parle une autre langue', () => {
    const storedFrench = 'fr'
    const englishBrowser = 'en-US'

    expect(resolveInitialLocale(storedFrench, englishBrowser)).toBe('fr')
  })

  it('passe en français quand le navigateur est en français et que rien n’est enregistré', () => {
    const nothingStored = null
    const canadianFrenchBrowser = 'fr-CA'

    expect(resolveInitialLocale(nothingStored, canadianFrenchBrowser)).toBe('fr')
  })

  it('reste en anglais pour une autre langue de navigateur', () => {
    const nothingStored = null
    const germanBrowser = 'de-DE'

    expect(resolveInitialLocale(nothingStored, germanBrowser)).toBe('en')
  })

  it('ignore une valeur enregistrée inconnue et retombe sur le navigateur', () => {
    const unknownStored = 'es'
    const frenchBrowser = 'FR'

    expect(resolveInitialLocale(unknownStored, frenchBrowser)).toBe('fr')
  })

  it('reste en anglais sans choix enregistré ni langue de navigateur', () => {
    const nothingStored = null
    const noBrowserLanguage = undefined

    expect(resolveInitialLocale(nothingStored, noBrowserLanguage)).toBe('en')
  })
})

describe('isLocale', () => {
  it.each(['en', 'fr'])('reconnaît %s', (supportedLocale) => {
    const candidate = supportedLocale

    expect(isLocale(candidate)).toBe(true)
  })

  it.each(['es', '', null, undefined, 42])('rejette %s', (unsupportedValue) => {
    const candidate = unsupportedValue

    expect(isLocale(candidate)).toBe(false)
  })
})
