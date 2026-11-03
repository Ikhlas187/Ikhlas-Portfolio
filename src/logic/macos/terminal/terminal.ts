export type TerminalTexts = {
  help: string[]
  // {command} et {file} sont remplacés par la saisie de l'utilisateur.
  notFound: string
  catUsage: string
  catMissing: string
}

export type TerminalContext = {
  userName: string
  workingDirectory: string
  listing: string[]
  files: Record<string, string>
  texts: TerminalTexts
}

export type TerminalResult = { kind: 'clear' } | { kind: 'print'; lines: string[] }

function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)
}

export function runTerminalCommand(input: string, context: TerminalContext): TerminalResult {
  const [command = '', ...args] = input.trim().split(/\s+/).filter(Boolean)

  switch (command) {
    case '':
      return { kind: 'print', lines: [] }
    case 'clear':
      return { kind: 'clear' }
    case 'help':
      return { kind: 'print', lines: context.texts.help }
    case 'ls':
      return { kind: 'print', lines: [context.listing.join('  ')] }
    case 'whoami':
      return { kind: 'print', lines: [context.userName] }
    case 'pwd':
      return { kind: 'print', lines: [context.workingDirectory] }
    case 'echo':
      return { kind: 'print', lines: [args.join(' ')] }
    case 'cat': {
      const file = args.join(' ')
      if (!file) return { kind: 'print', lines: [context.texts.catUsage] }
      const content = context.files[file]
      if (content === undefined) return { kind: 'print', lines: [fill(context.texts.catMissing, { file })] }
      return { kind: 'print', lines: content.split('\n') }
    }
    default:
      return { kind: 'print', lines: [fill(context.texts.notFound, { command })] }
  }
}
