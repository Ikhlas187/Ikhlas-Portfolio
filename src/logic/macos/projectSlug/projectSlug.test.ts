import { describe, expect, it } from 'vitest'
import { projectSlug } from '@/logic/macos/projectSlug/projectSlug'

describe('projectSlug', () => {
  it('met le nom du projet en minuscules', () => {
    const projectName = 'NEVORA'

    expect(projectSlug(projectName)).toBe('nevora')
  })

  it('remplace les espaces par des tirets', () => {
    const projectNameWithSpaces = ' Drip Studio '

    expect(projectSlug(projectNameWithSpaces)).toBe('drip-studio')
  })
})
