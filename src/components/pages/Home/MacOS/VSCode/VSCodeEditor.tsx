import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { highlightCode } from '@/lib/highlightCode'
import type { HighlightLanguage } from '@/logic/macos/codeLanguage/codeLanguage'
import { lineCount, textPositionAt, type TextPosition } from '@/logic/macos/textPosition/textPosition'

type VSCodeEditorProps = {
  path: string
  content: string
  language: HighlightLanguage | null
  position: TextPosition
  onPositionChange: (position: TextPosition) => void
}

const LINE_HEIGHT = 18

// Couleurs Dark Modern posées sur les classes que highlight.js met sur chaque jeton.
const SYNTAX =
  '[&_.hljs-keyword]:text-(--macos-vscode-syntax-keyword) [&_.hljs-literal]:text-(--macos-vscode-syntax-keyword) [&_.hljs-meta]:text-(--macos-vscode-syntax-keyword) [&_.hljs-name]:text-(--macos-vscode-syntax-tag) [&_.hljs-tag]:text-(--macos-vscode-line-number) [&_.hljs-selector-tag]:text-(--macos-vscode-syntax-tag) [&_.hljs-built_in]:text-(--macos-vscode-syntax-type) [&_.hljs-type]:text-(--macos-vscode-syntax-type) [&_.hljs-title.class_]:text-(--macos-vscode-syntax-type) [&_.hljs-title]:text-(--macos-vscode-syntax-function) [&_.hljs-selector-class]:text-(--macos-vscode-syntax-function) [&_.hljs-selector-id]:text-(--macos-vscode-syntax-function) [&_.hljs-string]:text-(--macos-vscode-syntax-string) [&_.hljs-comment]:text-(--macos-vscode-syntax-comment) [&_.hljs-doctag]:text-(--macos-vscode-syntax-control) [&_.hljs-number]:text-(--macos-vscode-syntax-number) [&_.hljs-attr]:text-(--macos-vscode-syntax-attribute) [&_.hljs-attribute]:text-(--macos-vscode-syntax-attribute) [&_.hljs-property]:text-(--macos-vscode-syntax-variable) [&_.hljs-variable]:text-(--macos-vscode-syntax-variable) [&_.hljs-template-variable]:text-(--macos-vscode-syntax-variable) [&_.hljs-params]:text-(--macos-vscode-syntax-variable) [&_.hljs-symbol]:text-(--macos-vscode-syntax-constant) [&_.hljs-regexp]:text-(--macos-vscode-syntax-regexp) [&_.hljs-section]:font-bold [&_.hljs-section]:text-(--macos-vscode-syntax-heading) [&_.hljs-bullet]:text-(--macos-vscode-syntax-variable) [&_.hljs-link]:text-(--macos-vscode-syntax-string) [&_.hljs-emphasis]:italic [&_.hljs-strong]:font-bold [&_.hljs-subst]:text-(--macos-vscode-text)'

// Éditeur en lecture seule : gouttière des numéros de ligne, code coloré, ligne courante suivie au clic et au clavier.
export default function VSCodeEditor({ path, content, language, position, onPositionChange }: VSCodeEditorProps) {
  const codeRef = useRef<HTMLElement>(null)
  const [highlighted, setHighlighted] = useState<{ path: string; html: string } | null>(null)
  const lines = lineCount(content)

  useEffect(() => {
    if (!language) return
    let isCurrent = true
    highlightCode(content, language)
      .then((html) => isCurrent && setHighlighted({ path, html }))
      .catch(() => undefined)
    return () => {
      isCurrent = false
    }
  }, [path, content, language])

  const html = language && highlighted?.path === path ? highlighted.html : null

  const updatePosition = (node: Node, nodeOffset: number) => {
    const code = codeRef.current
    if (!code || !code.contains(node)) return
    const range = document.createRange()
    range.selectNodeContents(code)
    range.setEnd(node, nodeOffset)
    onPositionChange(textPositionAt(content, range.toString().length))
  }

  // Le caret vient du point cliqué : l'écran du MacBook 3D interdit la sélection de texte au-dessus de l'éditeur.
  const trackClick = (event: MouseEvent<HTMLElement>) => {
    const caret = document.caretRangeFromPoint?.(event.clientX, event.clientY)
    if (caret) updatePosition(caret.startContainer, caret.startOffset)
  }

  const trackKeys = () => {
    const selection = window.getSelection()
    if (selection?.focusNode) updatePosition(selection.focusNode, selection.focusOffset)
  }

  return (
    <div className="absolute inset-0 overflow-auto overscroll-contain bg-(--macos-vscode-editor) [scrollbar-color:var(--macos-vscode-selected)_transparent]">
      <div
        className="relative flex min-h-full w-max min-w-full pt-[4px] font-(family-name:--font-macos-code) text-[12px]"
        style={{ lineHeight: `${LINE_HEIGHT}px` }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 border-y-2 border-(--macos-vscode-line-current)"
          style={{ top: 4 + (position.line - 1) * LINE_HEIGHT, height: LINE_HEIGHT }}
        />
        <div
          aria-hidden="true"
          className="sticky left-0 z-10 shrink-0 bg-(--macos-vscode-editor) pr-[26px] pl-[18px] text-right text-(--macos-vscode-line-number) select-none"
        >
          {Array.from({ length: lines }, (_, index) => (
            <div key={index} className={index + 1 === position.line ? 'text-(--macos-vscode-fg)' : undefined}>
              {index + 1}
            </div>
          ))}
        </div>
        <pre className="relative m-0 flex-1 select-text pr-[40px] pb-[40px] font-[inherit] text-(--macos-vscode-text) selection:bg-(--macos-vscode-selection) [&_*]:selection:bg-(--macos-vscode-selection)">
          {html !== null ? (
            <code
              ref={codeRef}
              tabIndex={0}
              onMouseUp={trackClick}
              onKeyUp={trackKeys}
              className={`block outline-none ${SYNTAX}`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <code ref={codeRef} tabIndex={0} onMouseUp={trackClick} onKeyUp={trackKeys} className="block outline-none">
              {content}
            </code>
          )}
        </pre>
      </div>
    </div>
  )
}
