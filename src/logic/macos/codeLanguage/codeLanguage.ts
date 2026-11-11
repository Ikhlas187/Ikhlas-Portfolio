// Grammaires de highlight.js chargées à la demande (lib/highlightCode.ts).
export type HighlightLanguage =
  | 'typescript'
  | 'javascript'
  | 'xml'
  | 'css'
  | 'scss'
  | 'json'
  | 'markdown'
  | 'python'
  | 'java'
  | 'kotlin'
  | 'c'
  | 'cpp'
  | 'csharp'
  | 'php'
  | 'ruby'
  | 'go'
  | 'rust'
  | 'sql'
  | 'bash'
  | 'powershell'
  | 'yaml'
  | 'ini'
  | 'properties'
  | 'dockerfile'
  | 'makefile'

// label null : texte brut, libellé traduit par l'app (data/macos.ts).
export type CodeLanguage = { label: string | null; highlight: HighlightLanguage | null }

// Famille d'icône de l'explorateur : chaque famille a son icône et sa couleur dans l'app VS Code.
export type FileIconKind =
  | 'react'
  | 'typescript'
  | 'script'
  | 'markup'
  | 'style'
  | 'json'
  | 'markdown'
  | 'code'
  | 'config'
  | 'image'
  | 'media'
  | 'font'
  | 'archive'
  | 'pdf'
  | 'text'

const PLAIN_TEXT: CodeLanguage = { label: null, highlight: null }

const BY_EXTENSION: Record<string, CodeLanguage> = {
  ts: { label: 'TypeScript', highlight: 'typescript' },
  mts: { label: 'TypeScript', highlight: 'typescript' },
  cts: { label: 'TypeScript', highlight: 'typescript' },
  tsx: { label: 'TypeScript JSX', highlight: 'typescript' },
  js: { label: 'JavaScript', highlight: 'javascript' },
  mjs: { label: 'JavaScript', highlight: 'javascript' },
  cjs: { label: 'JavaScript', highlight: 'javascript' },
  jsx: { label: 'JavaScript JSX', highlight: 'javascript' },
  html: { label: 'HTML', highlight: 'xml' },
  htm: { label: 'HTML', highlight: 'xml' },
  xml: { label: 'XML', highlight: 'xml' },
  svg: { label: 'SVG', highlight: 'xml' },
  vue: { label: 'Vue', highlight: 'xml' },
  css: { label: 'CSS', highlight: 'css' },
  scss: { label: 'SCSS', highlight: 'scss' },
  json: { label: 'JSON', highlight: 'json' },
  md: { label: 'Markdown', highlight: 'markdown' },
  mdx: { label: 'MDX', highlight: 'markdown' },
  py: { label: 'Python', highlight: 'python' },
  java: { label: 'Java', highlight: 'java' },
  kt: { label: 'Kotlin', highlight: 'kotlin' },
  c: { label: 'C', highlight: 'c' },
  h: { label: 'C', highlight: 'c' },
  cpp: { label: 'C++', highlight: 'cpp' },
  cc: { label: 'C++', highlight: 'cpp' },
  hpp: { label: 'C++', highlight: 'cpp' },
  cs: { label: 'C#', highlight: 'csharp' },
  php: { label: 'PHP', highlight: 'php' },
  rb: { label: 'Ruby', highlight: 'ruby' },
  go: { label: 'Go', highlight: 'go' },
  rs: { label: 'Rust', highlight: 'rust' },
  sql: { label: 'SQL', highlight: 'sql' },
  prisma: { label: 'Prisma', highlight: null },
  sh: { label: 'Shell Script', highlight: 'bash' },
  bash: { label: 'Shell Script', highlight: 'bash' },
  ps1: { label: 'PowerShell', highlight: 'powershell' },
  yml: { label: 'YAML', highlight: 'yaml' },
  yaml: { label: 'YAML', highlight: 'yaml' },
  toml: { label: 'TOML', highlight: 'ini' },
  ini: { label: 'Ini', highlight: 'ini' },
  properties: { label: 'Properties', highlight: 'properties' },
  txt: PLAIN_TEXT,
}

const BY_FILE_NAME: Record<string, CodeLanguage> = {
  dockerfile: { label: 'Dockerfile', highlight: 'dockerfile' },
  makefile: { label: 'Makefile', highlight: 'makefile' },
  '.gitignore': { label: 'Ignore', highlight: null },
  '.prettierrc': { label: 'JSON', highlight: 'json' },
  '.eslintrc': { label: 'JSON', highlight: 'json' },
}

function fileName(path: string) {
  return path.slice(path.lastIndexOf('/') + 1).toLowerCase()
}

function extensionOf(path: string) {
  const name = fileName(path)
  const dot = name.lastIndexOf('.')
  return dot > 0 ? name.slice(dot + 1) : ''
}

export function codeLanguage(path: string): CodeLanguage {
  const name = fileName(path)
  if (BY_FILE_NAME[name]) return BY_FILE_NAME[name]
  if (name.startsWith('.env')) return { label: 'Properties', highlight: 'properties' }
  return BY_EXTENSION[extensionOf(path)] ?? PLAIN_TEXT
}

const ICON_BY_EXTENSION: Record<string, FileIconKind> = {
  tsx: 'react',
  jsx: 'react',
  ts: 'typescript',
  mts: 'typescript',
  cts: 'typescript',
  js: 'script',
  mjs: 'script',
  cjs: 'script',
  html: 'markup',
  htm: 'markup',
  xml: 'markup',
  vue: 'markup',
  css: 'style',
  scss: 'style',
  json: 'json',
  md: 'markdown',
  mdx: 'markdown',
  yml: 'config',
  yaml: 'config',
  toml: 'config',
  ini: 'config',
  properties: 'config',
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  gif: 'image',
  webp: 'image',
  avif: 'image',
  ico: 'image',
  svg: 'image',
  mp3: 'media',
  mp4: 'media',
  wav: 'media',
  webm: 'media',
  mov: 'media',
  woff: 'font',
  woff2: 'font',
  ttf: 'font',
  otf: 'font',
  zip: 'archive',
  rar: 'archive',
  '7z': 'archive',
  gz: 'archive',
  tar: 'archive',
  jar: 'archive',
  pdf: 'pdf',
  txt: 'text',
}

export function fileIconKind(path: string): FileIconKind {
  const name = fileName(path)
  if (name.startsWith('.') || name === 'dockerfile' || name === 'makefile') return 'config'
  const extension = extensionOf(path)
  if (ICON_BY_EXTENSION[extension]) return ICON_BY_EXTENSION[extension]
  return BY_EXTENSION[extension] ? 'code' : 'text'
}
