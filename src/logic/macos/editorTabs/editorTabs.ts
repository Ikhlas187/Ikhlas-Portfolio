export type EditorTabs = { paths: string[]; activePath: string | null }

export const NO_EDITOR_TABS: EditorTabs = { paths: [], activePath: null }

// Un fichier déjà ouvert est simplement réactivé ; un nouveau s'ajoute juste après l'onglet actif, comme dans VS Code.
export function openEditorTab(tabs: EditorTabs, path: string): EditorTabs {
  if (tabs.paths.includes(path)) return { ...tabs, activePath: path }
  const activeIndex = tabs.activePath === null ? -1 : tabs.paths.indexOf(tabs.activePath)
  const insertAt = activeIndex === -1 ? tabs.paths.length : activeIndex + 1
  return { paths: [...tabs.paths.slice(0, insertAt), path, ...tabs.paths.slice(insertAt)], activePath: path }
}

// Fermer l'onglet actif active son voisin de droite, sinon celui de gauche.
export function closeEditorTab(tabs: EditorTabs, path: string): EditorTabs {
  const index = tabs.paths.indexOf(path)
  if (index === -1) return tabs
  const paths = tabs.paths.filter((item) => item !== path)
  if (tabs.activePath !== path) return { paths, activePath: tabs.activePath }
  return { paths, activePath: paths[index] ?? paths[index - 1] ?? null }
}
