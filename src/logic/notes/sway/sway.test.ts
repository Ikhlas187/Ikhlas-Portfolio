import { describe, expect, it } from 'vitest'
import { noteSway } from '@/logic/notes/sway/sway'

describe('noteSway', () => {
  it('donne toujours le même balancement à la même note', () => {
    const noteId = 'welcome-1'

    expect(noteSway(noteId)).toEqual(noteSway(noteId))
  })

  it('donne un rythme différent à 2 notes différentes', () => {
    const firstNoteId = 'welcome-1'
    const secondNoteId = 'welcome-2'

    const durations = [noteSway(firstNoteId).durationS, noteSway(secondNoteId).durationS]

    expect(durations[0]).not.toBe(durations[1])
  })

  it('garde une durée entre 3,2 et 5,6 s', () => {
    const noteIds = Array.from({ length: 200 }, (_, i) => `note-${i}`)

    const durations = noteIds.map((id) => noteSway(id).durationS)

    expect(Math.min(...durations)).toBeGreaterThanOrEqual(3.2)
    expect(Math.max(...durations)).toBeLessThanOrEqual(5.6)
  })

  it('démarre chaque note à un instant de son propre cycle', () => {
    const noteIds = Array.from({ length: 200 }, (_, i) => `note-${i}`)

    const isDelayWithinCycle = noteIds.every((id) => {
      const { durationS, delayS } = noteSway(id)
      return delayS <= 0 && -delayS <= durationS
    })

    expect(isDelayWithinCycle).toBe(true)
  })
})
