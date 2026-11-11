import { NO_EDITOR_TABS, openEditorTab, type EditorTabs } from '@/logic/macos/editorTabs/editorTabs'
import { ancestorPaths } from '@/logic/macos/repoTree/repoTree'
import type { WindowPayload } from '@/logic/macos/windowManager/windowManager'

export type Workspace = { repo: string | null; tabs: EditorTabs; expanded: ReadonlySet<string> }

// Espace de travail d'une fenêtre VS Code : le fichier demandé ouvert en onglet, ses dossiers dépliés dans l'explorateur.
export function workspaceFor({ repo, file }: WindowPayload): Workspace {
  return {
    repo: repo ?? null,
    tabs: file ? openEditorTab(NO_EDITOR_TABS, file) : NO_EDITOR_TABS,
    expanded: new Set(file ? ancestorPaths(file) : []),
  }
}

export function fileName(path: string) {
  return path.slice(path.lastIndexOf('/') + 1)
}
