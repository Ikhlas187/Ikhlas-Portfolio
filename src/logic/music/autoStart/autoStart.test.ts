import { describe, expect, it } from 'vitest'
import { shouldStartOnGesture } from '@/logic/music/autoStart/autoStart'

describe('shouldStartOnGesture', () => {
  it('lance la musique au 1er geste après le loader', () => {
    const firstGestureAfterLoader = { isLoaderRevealed: true, isMutedForSession: false, hasStartedOrChosen: false }

    expect(shouldStartOnGesture(firstGestureAfterLoader)).toBe(true)
  })

  it('attend la fin du loader', () => {
    const gestureDuringLoader = { isLoaderRevealed: false, isMutedForSession: false, hasStartedOrChosen: false }

    expect(shouldStartOnGesture(gestureDuringLoader)).toBe(false)
  })

  it('ne relance pas une musique coupée pendant la session', () => {
    const mutedVisitor = { isLoaderRevealed: true, isMutedForSession: true, hasStartedOrChosen: false }

    expect(shouldStartOnGesture(mutedVisitor)).toBe(false)
  })

  it('ne fait rien une fois la musique lancée ou choisie', () => {
    const alreadyStarted = { isLoaderRevealed: true, isMutedForSession: false, hasStartedOrChosen: true }

    expect(shouldStartOnGesture(alreadyStarted)).toBe(false)
  })
})
