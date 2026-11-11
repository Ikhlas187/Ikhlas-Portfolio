import { describe, expect, it } from 'vitest'
import type { GiantSurMenu } from '@/data/giantSur'
import { withAppName } from '@/logic/macos/appMenu/appMenu'

describe('withAppName', () => {
  it("remplace {app} par le nom de l'app dans le titre et les entrées", () => {
    const appMenu: GiantSurMenu = {
      id: 'app',
      label: '{app}',
      items: [{ title: 'Quit {app}', hasSeparator: false, rightLabel: '⌘Q', action: null }],
    }

    const finderMenu = withAppName(appMenu, 'Finder')

    expect(finderMenu).toEqual({
      id: 'app',
      label: 'Finder',
      items: [{ title: 'Quit Finder', hasSeparator: false, rightLabel: '⌘Q', action: null }],
    })
  })
})
