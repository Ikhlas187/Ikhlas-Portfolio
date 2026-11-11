import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useMacRepos } from '@/components/pages/Home/MacOS/MacReposProvider'
import VSCodeActivityBar from '@/components/pages/Home/MacOS/VSCode/VSCodeActivityBar'
import VSCodeEditor from '@/components/pages/Home/MacOS/VSCode/VSCodeEditor'
import VSCodeExplorer from '@/components/pages/Home/MacOS/VSCode/VSCodeExplorer'
import VSCodeFileIcon from '@/components/pages/Home/MacOS/VSCode/VSCodeFileIcon'
import VSCodeStatusBar from '@/components/pages/Home/MacOS/VSCode/VSCodeStatusBar'
import VSCodeTabs from '@/components/pages/Home/MacOS/VSCode/VSCodeTabs'
import VSCodeTitleBar from '@/components/pages/Home/MacOS/VSCode/VSCodeTitleBar'
import VSCodeWelcome from '@/components/pages/Home/MacOS/VSCode/VSCodeWelcome'
import Window, { type WindowFrameProps } from '@/components/pages/Home/MacOS/Window'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { codeLanguage } from '@/logic/macos/codeLanguage/codeLanguage'
import { NO_EDITOR_TABS, closeEditorTab, openEditorTab } from '@/logic/macos/editorTabs/editorTabs'
import { ancestorPaths, findRepoNode } from '@/logic/macos/repoTree/repoTree'
import type { TextPosition } from '@/logic/macos/textPosition/textPosition'
import { fileName, workspaceFor } from '@/logic/macos/vscodeWorkspace/vscodeWorkspace'

type VSCodeProps = { frame: WindowFrameProps; onOpenInBrowser: (url: string) => void }

const START_POSITION: TextPosition = { line: 1, column: 1 }

// VS Code (thème Dark Modern) : explorateur du repo, onglets, éditeur coloré en lecture seule, barre d'état.
export default function VSCode({ frame, onOpenInBrowser }: VSCodeProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].vscode
  const repos = useMacRepos()
  const { requestRepo } = repos
  const payload = frame.window.payload
  const [workspace, setWorkspace] = useState(() => workspaceFor(payload))
  const [handledRequestId, setHandledRequestId] = useState(payload.requestId)
  const [cursor, setCursor] = useState<{ path: string; position: TextPosition } | null>(null)

  // Nouvelle demande pendant que la fenêtre est ouverte (clic droit, double-clic dans le Finder).
  if (payload.requestId !== handledRequestId) {
    setHandledRequestId(payload.requestId)
    if (payload.repo && payload.repo !== workspace.repo) setWorkspace(workspaceFor(payload))
    else if (payload.file) {
      const file = payload.file
      setWorkspace((current) => ({
        ...current,
        tabs: openEditorTab(current.tabs, file),
        expanded: new Set([...current.expanded, ...ancestorPaths(file)]),
      }))
    }
  }

  const { repo: repoName, tabs, expanded } = workspace

  useEffect(() => {
    if (repoName) requestRepo(repoName)
  }, [repoName, requestRepo])

  const tree = repoName ? (repos.trees[repoName] ?? null) : null
  const summary = repos.index.find((item) => item.name === repoName) ?? null
  const activePath = tabs.activePath
  const activeNode = tree && activePath ? findRepoNode(tree, activePath) : null
  const activeFile = activeNode?.kind === 'file' ? activeNode : null
  const language = activePath ? codeLanguage(activePath) : null
  const position = activePath ? (cursor?.path === activePath ? cursor.position : START_POSITION) : null

  const openRepo = (name: string) => setWorkspace({ repo: name, tabs: NO_EDITOR_TABS, expanded: new Set() })
  const openFile = (path: string) => setWorkspace((current) => ({ ...current, tabs: openEditorTab(current.tabs, path) }))
  const closeFile = (path: string) => setWorkspace((current) => ({ ...current, tabs: closeEditorTab(current.tabs, path) }))
  const toggleDir = (path: string) =>
    setWorkspace((current) => {
      const next = new Set(current.expanded)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return { ...current, expanded: next }
    })

  const title = activePath && repoName ? `${fileName(activePath)} — ${repoName}` : (repoName ?? texts.welcomeTitle)

  return (
    <Window {...frame} title={title} hasToolbarRow={false} contentClassName="bg-(--macos-vscode-editor)">
      <div className="absolute inset-0 flex flex-col font-(family-name:--font-macos-frame) text-[13px] text-(--macos-vscode-fg)">
        <VSCodeTitleBar label={repoName ?? texts.welcomeTitle} />
        <div className="flex min-h-0 flex-1">
          <VSCodeActivityBar />
          <VSCodeExplorer
            repoName={repoName}
            tree={tree}
            status={repoName ? repos.repoStatus(repoName) : null}
            expanded={expanded}
            activePath={activePath}
            onToggle={toggleDir}
            onOpen={openFile}
          />
          <main className="flex min-w-0 flex-1 flex-col bg-(--macos-vscode-editor)">
            {tabs.paths.length > 0 && (
              <>
                <VSCodeTabs paths={tabs.paths} activePath={activePath} onSelect={openFile} onClose={closeFile} />
                {activePath && (
                  <nav className="flex h-[22px] shrink-0 items-center gap-[2px] px-[14px] text-[12px] text-(--macos-vscode-muted)">
                    {activePath.split('/').map((segment, index, segments) => (
                      <span key={`${index}-${segment}`} className="flex items-center gap-[2px]">
                        {index === segments.length - 1 && <VSCodeFileIcon path={activePath} className="mr-[3px]" />}
                        {segment}
                        {index < segments.length - 1 && <ChevronRight aria-hidden="true" strokeWidth={1.8} className="size-[14px]" />}
                      </span>
                    ))}
                  </nav>
                )}
              </>
            )}
            <div className="relative min-h-0 flex-1">
              {!repoName ? (
                <VSCodeWelcome repos={repos.index} onOpenRepo={openRepo} />
              ) : activeFile && activeFile.content !== undefined && language ? (
                <VSCodeEditor
                  path={activeFile.path}
                  content={activeFile.content}
                  language={language.highlight}
                  position={position ?? START_POSITION}
                  onPositionChange={(next) => setCursor({ path: activeFile.path, position: next })}
                />
              ) : (
                <p className="absolute inset-0 flex items-center justify-center px-[48px] text-center text-[13px] leading-relaxed text-(--macos-vscode-muted)">
                  {activeFile ? texts.omitted[activeFile.omitted ?? 'binary'] : tree ? texts.noFileOpen : ''}
                </p>
              )}
            </div>
          </main>
        </div>
        <VSCodeStatusBar
          repo={summary}
          languageLabel={activeFile?.content !== undefined ? (language ? (language.label ?? texts.plainText) : null) : null}
          position={activeFile?.content !== undefined ? position : null}
          onOpenHomepage={onOpenInBrowser}
        />
      </div>
    </Window>
  )
}
