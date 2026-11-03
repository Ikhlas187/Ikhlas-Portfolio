import type { LanguageFn } from 'highlight.js'
import type { HighlightLanguage } from '@/logic/macos/codeLanguage/codeLanguage'

type LanguageModule = { default: LanguageFn }

// Le cœur de highlight.js et chaque grammaire ne sont téléchargés qu'au premier fichier qui en a besoin.
const LANGUAGES: Record<HighlightLanguage, () => Promise<LanguageModule>> = {
  typescript: () => import('highlight.js/lib/languages/typescript'),
  javascript: () => import('highlight.js/lib/languages/javascript'),
  xml: () => import('highlight.js/lib/languages/xml'),
  css: () => import('highlight.js/lib/languages/css'),
  scss: () => import('highlight.js/lib/languages/scss'),
  json: () => import('highlight.js/lib/languages/json'),
  markdown: () => import('highlight.js/lib/languages/markdown'),
  python: () => import('highlight.js/lib/languages/python'),
  java: () => import('highlight.js/lib/languages/java'),
  kotlin: () => import('highlight.js/lib/languages/kotlin'),
  c: () => import('highlight.js/lib/languages/c'),
  cpp: () => import('highlight.js/lib/languages/cpp'),
  csharp: () => import('highlight.js/lib/languages/csharp'),
  php: () => import('highlight.js/lib/languages/php'),
  ruby: () => import('highlight.js/lib/languages/ruby'),
  go: () => import('highlight.js/lib/languages/go'),
  rust: () => import('highlight.js/lib/languages/rust'),
  sql: () => import('highlight.js/lib/languages/sql'),
  bash: () => import('highlight.js/lib/languages/bash'),
  powershell: () => import('highlight.js/lib/languages/powershell'),
  yaml: () => import('highlight.js/lib/languages/yaml'),
  ini: () => import('highlight.js/lib/languages/ini'),
  properties: () => import('highlight.js/lib/languages/properties'),
  dockerfile: () => import('highlight.js/lib/languages/dockerfile'),
  makefile: () => import('highlight.js/lib/languages/makefile'),
}

const core = () => import('highlight.js/lib/core').then((module) => module.default)

// HTML échappé par highlight.js, avec des <span class="hljs-…"> pour chaque jeton.
export async function highlightCode(code: string, language: HighlightLanguage): Promise<string> {
  const [hljs, grammar] = await Promise.all([core(), LANGUAGES[language]()])
  if (!hljs.getLanguage(language)) hljs.registerLanguage(language, grammar.default)
  return hljs.highlight(code, { language, ignoreIllegals: true }).value
}
