// Classes du cadre de fenêtre repris du Safari de mihrimatrix/macos-clone-react (racine à 13 px : 1 unité Tailwind = 3,25 px).

// Bouton d'outil en capsule de verre posée sur la barre d'outils (.toolbar .tool).
export const FRAME_TOOL =
  'grid h-[26px] min-w-[26px] cursor-pointer place-items-center rounded-full bg-(--macos-frame-glass) px-[6.5px] text-(--macos-frame-fg) shadow-(--macos-frame-glass-shadow) backdrop-blur-[14px] backdrop-brightness-[1.04] backdrop-saturate-[1.9] hover:bg-(--macos-frame-hover) active:bg-(--macos-frame-selected) disabled:cursor-default disabled:opacity-30 [&_svg]:size-[17px]'

// Champ de recherche arrondi, même verre que les outils (.toolbar .search-field).
export const FRAME_SEARCH_FIELD =
  'flex h-[26px] min-w-[26px] items-center gap-[4.875px] rounded-full bg-(--macos-frame-glass) px-[8.125px] text-(--macos-frame-muted) shadow-(--macos-frame-glass-shadow) backdrop-blur-[14px] backdrop-brightness-[1.04] backdrop-saturate-[1.9] focus-within:shadow-[0_0_0_3px_var(--macos-frame-focus)]'

// Barre d'outils unifiée de 52 px, poignée de déplacement de la fenêtre.
export const FRAME_TOOLBAR = 'flex h-[52px] shrink-0 items-center gap-[8px] px-[12px]'

export const FRAME_ICON_STROKE = 1.75
