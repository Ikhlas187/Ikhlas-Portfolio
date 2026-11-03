import { describe, expect, it } from 'vitest'
import { runTerminalCommand } from '@/logic/macos/terminal/terminal'

const context = {
  userName: 'ikhlas',
  workingDirectory: '/Users/ikhlas',
  listing: ['Desktop', 'Documents', 'about.txt'],
  files: { 'about.txt': 'Hello\nWorld', 'À propos.txt': 'Bonjour' },
  texts: {
    help: ['help  list commands', 'ls  list files'],
    notFound: 'zsh: command not found: {command}',
    catUsage: 'usage: cat file',
    catMissing: 'cat: {file}: No such file or directory',
  },
}

describe('runTerminalCommand', () => {
  it('affiche l’aide', () => {
    const helpCommand = 'help'

    expect(runTerminalCommand(helpCommand, context)).toEqual({ kind: 'print', lines: context.texts.help })
  })

  it('liste les fichiers sur une seule ligne', () => {
    const lsCommand = 'ls'

    expect(runTerminalCommand(lsCommand, context)).toEqual({ kind: 'print', lines: ['Desktop  Documents  about.txt'] })
  })

  it('répond au nom d’utilisateur, espaces autour ignorés', () => {
    const paddedWhoami = '  whoami  '

    expect(runTerminalCommand(paddedWhoami, context)).toEqual({ kind: 'print', lines: ['ikhlas'] })
  })

  it('affiche un fichier ligne par ligne', () => {
    const catAbout = 'cat about.txt'

    expect(runTerminalCommand(catAbout, context)).toEqual({ kind: 'print', lines: ['Hello', 'World'] })
  })

  it('lit un fichier dont le nom contient une espace', () => {
    const catSpacedName = 'cat À propos.txt'

    expect(runTerminalCommand(catSpacedName, context)).toEqual({ kind: 'print', lines: ['Bonjour'] })
  })

  it('signale un fichier absent', () => {
    const catMissingFile = 'cat secrets.txt'

    expect(runTerminalCommand(catMissingFile, context)).toEqual({
      kind: 'print',
      lines: ['cat: secrets.txt: No such file or directory'],
    })
  })

  it('rappelle l’usage de cat sans argument', () => {
    const bareCat = 'cat'

    expect(runTerminalCommand(bareCat, context)).toEqual({ kind: 'print', lines: ['usage: cat file'] })
  })

  it('demande d’effacer l’écran', () => {
    const clearCommand = 'clear'

    expect(runTerminalCommand(clearCommand, context)).toEqual({ kind: 'clear' })
  })

  it('signale une commande inconnue', () => {
    const unknownCommand = 'sudo rm -rf /'

    expect(runTerminalCommand(unknownCommand, context)).toEqual({
      kind: 'print',
      lines: ['zsh: command not found: sudo'],
    })
  })

  it('n’affiche rien pour une ligne vide', () => {
    const emptyLine = '   '

    expect(runTerminalCommand(emptyLine, context)).toEqual({ kind: 'print', lines: [] })
  })
})
