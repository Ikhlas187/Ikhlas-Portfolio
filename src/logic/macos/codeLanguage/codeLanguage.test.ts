import { describe, expect, it } from 'vitest'
import { codeLanguage, fileIconKind } from '@/logic/macos/codeLanguage/codeLanguage'

describe('codeLanguage', () => {
  it.each([
    ['src/App.tsx', { label: 'TypeScript JSX', highlight: 'typescript' }],
    ['server/index.js', { label: 'JavaScript', highlight: 'javascript' }],
    ['index.html', { label: 'HTML', highlight: 'xml' }],
    ['Main.java', { label: 'Java', highlight: 'java' }],
    ['src/main.cpp', { label: 'C++', highlight: 'cpp' }],
    ['app.py', { label: 'Python', highlight: 'python' }],
  ])('déduit le langage de %s d’après son extension', (path, language) => {
    expect(codeLanguage(path)).toEqual(language)
  })

  it('ignore la casse de l’extension', () => {
    const upperCasePath = 'docs/README.MD'

    expect(codeLanguage(upperCasePath)).toEqual({ label: 'Markdown', highlight: 'markdown' })
  })

  it('reconnaît un Dockerfile à son nom de fichier', () => {
    const dockerfile = 'docker/Dockerfile'

    expect(codeLanguage(dockerfile)).toEqual({ label: 'Dockerfile', highlight: 'dockerfile' })
  })

  it('lit un .env.example comme un fichier de propriétés', () => {
    const envExample = '.env.example'

    expect(codeLanguage(envExample)).toEqual({ label: 'Properties', highlight: 'properties' })
  })

  it('retombe sur du texte brut, sans coloration, pour une extension inconnue ou absente', () => {
    const unknownPaths = ['LICENSE', 'notes.xyz']

    expect(unknownPaths.map(codeLanguage)).toEqual([
      { label: 'Plain Text', highlight: null },
      { label: 'Plain Text', highlight: null },
    ])
  })
})

describe('fileIconKind', () => {
  it.each([
    ['src/App.tsx', 'react'],
    ['src/main.ts', 'typescript'],
    ['server/index.js', 'script'],
    ['package.json', 'json'],
    ['styles/global.css', 'style'],
    ['README.md', 'markdown'],
    ['public/logo.png', 'image'],
    ['fonts/Inter.woff2', 'font'],
    ['.gitignore', 'config'],
    ['Main.java', 'code'],
    ['LICENSE', 'text'],
  ])('classe %s dans la famille %s', (path, kind) => {
    expect(fileIconKind(path)).toBe(kind)
  })
})
