import { describe, expect, it } from 'vitest'
import { commitInput, EMPTY_SCREEN, writeOutput } from '@/logic/macos/terminalScreen/terminalScreen'

describe('writeOutput', () => {
  it('garde la fin sans retour à la ligne comme ligne en cours', () => {
    const menu = '===== CONNEXION =====\n1. Administrateur\nChoix: '

    expect(writeOutput(EMPTY_SCREEN, menu)).toEqual({ lines: ['===== CONNEXION =====', '1. Administrateur'], partial: 'Choix: ' })
  })

  it('complète la ligne en cours avec la sortie suivante', () => {
    const screen = { lines: [], partial: 'Log' }

    expect(writeOutput(screen, 'in: \r\n')).toEqual({ lines: ['Login: '], partial: '' })
  })
})

describe('commitInput', () => {
  it('ajoute la saisie à l’invite et passe à la ligne', () => {
    const screen = { lines: ['1. Administrateur'], partial: 'Choix: ' }

    expect(commitInput(screen, '1')).toEqual({ lines: ['1. Administrateur', 'Choix: 1'], partial: '' })
  })
})
