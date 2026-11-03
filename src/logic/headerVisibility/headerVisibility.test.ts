import { describe, expect, it } from 'vitest'
import { shouldHideHeader } from '@/logic/headerVisibility/headerVisibility'

describe('shouldHideHeader', () => {
  it('cache le header quand on descend', () => {
    const scrollingDown = { previousScrollY: 100, scrollY: 140, isHidden: false }

    expect(shouldHideHeader(scrollingDown)).toBe(true)
  })

  it('réaffiche le header dès qu’on remonte, même loin du haut', () => {
    const scrollingUpFarDown = { previousScrollY: 900, scrollY: 860, isHidden: true }

    expect(shouldHideHeader(scrollingUpFarDown)).toBe(false)
  })

  it('garde le header visible tout en haut de la page', () => {
    const backAtTop = { previousScrollY: 0, scrollY: 0, isHidden: true }

    expect(shouldHideHeader(backAtTop)).toBe(false)
  })

  it('garde l’état courant quand la position ne bouge pas', () => {
    const stillWhileHidden = { previousScrollY: 400, scrollY: 400, isHidden: true }

    expect(shouldHideHeader(stillWhileHidden)).toBe(true)
  })
})
