import { describe, expect, it } from 'vitest'
import { sectionHref } from '@/logic/sectionHref/sectionHref'

describe('sectionHref', () => {
  it('garde le lien tel quel sur la home', () => {
    const href = '#about'

    const hrefOnHome = sectionHref(href, true)

    expect(hrefOnHome).toBe('#about')
  })

  it('renvoie vers la home depuis une autre page', () => {
    const href = '#about'

    const hrefElsewhere = sectionHref(href, false)

    expect(hrefElsewhere).toBe('/#about')
  })

  it('ne touche pas aux liens externes', () => {
    const href = 'mailto:hello@example.com'

    const hrefElsewhere = sectionHref(href, false)

    expect(hrefElsewhere).toBe('mailto:hello@example.com')
  })
})
