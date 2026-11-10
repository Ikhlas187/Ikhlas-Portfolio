import { describe, expect, it } from 'vitest'
import { projectServices } from '@/logic/projects/projectServices/projectServices'

describe('projectServices', () => {
  it('garde ce qui suit le type de projet', () => {
    const eyebrow = 'Portfolio · Web app · Design'

    const services = projectServices(eyebrow)

    expect(services).toEqual(['Web app', 'Design'])
  })

  it('rend une liste vide sans séparateur', () => {
    const eyebrow = 'Portfolio'

    const services = projectServices(eyebrow)

    expect(services).toEqual([])
  })
})
