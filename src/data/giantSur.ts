import type { Localized } from '@/data/locale'
import { SITE } from '@/data/site'

// Ce que déclenche une entrée de menu ; null : entrée décorative, comme dans l'original.
export type MenuAction =
  | 'about'
  | 'settings'
  | 'quitApp'
  | 'restart'
  | 'shutDown'
  | 'logOut'
  | 'hideApp'
  | 'hideOthers'
  | 'showAll'
  | 'newFinderWindow'
  | 'newNote'
  | 'closeWindow'
  | 'goDesktop'
  | 'goDocuments'
  | 'goDownloads'
  | 'goProjects'
  | 'openTerminal'
  | 'minimize'
  | 'zoom'
  | 'bringAllToFront'
  | 'portfolioHelp'
  | 'viewAsIcons'
  | 'viewAsList'

export type GiantSurMenuItem = {
  title: string
  hasSeparator: boolean
  rightLabel: string
  action: MenuAction | null
}

export type GiantSurMenu = {
  id: string
  label: string
  items: GiantSurMenuItem[]
}

export type DockApp = 'finder' | 'browser' | 'messages' | 'music' | 'mail' | 'photos' | 'calendar' | 'notes' | 'settings'

export type DockLinkId = 'github' | 'linkedin'

export type DesktopTarget = { kind: 'finder'; path: string[] } | { kind: 'file'; path: string[] }

type GiantSurContent = {
  appleMenu: GiantSurMenu & { ariaLabel: string }
  // {app} est remplacé par le nom de l'app au premier plan.
  appMenu: GiantSurMenu
  appMenus: GiantSurMenu[]
  status: { battery: string; batteryLevel: string; wifi: string; search: string; controlCenter: string }
  desktopIconAlt: string
  desktopItems: { id: string; title: string; icon: string; target: DesktopTarget }[]
  dockLabel: string
  dockItems: { id: string; title: string; logo: string; app: DockApp }[]
  // Liens externes après le séparateur du Dock, comme sur frvky.online.
  dockLinks: { id: DockLinkId; title: string; href: string }[]
  // Locale Intl de l'horloge de la barre de menus.
  intlLocale: string
}

const IMAGES = '/giantsur/images'

export const GIANT_SUR: Localized<GiantSurContent> = {
  en: {
    appleMenu: {
      id: 'apple',
      label: 'Apple',
      ariaLabel: 'Apple menu',
      items: [
        { title: 'About This Mac', hasSeparator: true, rightLabel: '', action: 'about' },
        { title: 'System Preferences...', hasSeparator: false, rightLabel: '', action: 'settings' },
        { title: 'App Store...', hasSeparator: true, rightLabel: '8 updates', action: null },
        { title: 'Recent Items', hasSeparator: true, rightLabel: '', action: null },
        { title: 'Force Quit...', hasSeparator: true, rightLabel: '⌥⌘⎋', action: 'quitApp' },
        { title: 'Sleep', hasSeparator: false, rightLabel: '', action: null },
        { title: 'Restart...', hasSeparator: false, rightLabel: '', action: 'restart' },
        { title: 'Shut Down...', hasSeparator: true, rightLabel: '', action: 'shutDown' },
        { title: 'Lock Screen', hasSeparator: false, rightLabel: '^⌘Q', action: null },
        { title: 'Log Out Ikhlas Agbeti...', hasSeparator: false, rightLabel: '⇧⌘Q', action: 'logOut' },
      ],
    },
    appMenu: {
      id: 'app',
      label: '{app}',
      items: [
        { title: 'About {app}', hasSeparator: true, rightLabel: '', action: 'about' },
        { title: 'Preferences...', hasSeparator: true, rightLabel: '⌘ ,', action: 'settings' },
        { title: 'Empty Trash...', hasSeparator: true, rightLabel: '⇧⌘⌫', action: null },
        { title: 'Services', hasSeparator: true, rightLabel: '', action: null },
        { title: 'Hide {app}', hasSeparator: false, rightLabel: '⌘H', action: 'hideApp' },
        { title: 'Hide Others', hasSeparator: false, rightLabel: '⌥⌘H', action: 'hideOthers' },
        { title: 'Show All', hasSeparator: true, rightLabel: '', action: 'showAll' },
        { title: 'Quit {app}', hasSeparator: false, rightLabel: '⌘Q', action: 'quitApp' },
      ],
    },
    appMenus: [
      {
        id: 'file',
        label: 'File',
        items: [
          { title: 'New Finder Window', hasSeparator: false, rightLabel: '⌘N', action: 'newFinderWindow' },
          { title: 'New Note', hasSeparator: true, rightLabel: '', action: 'newNote' },
          { title: 'Close Window', hasSeparator: true, rightLabel: '⌘W', action: 'closeWindow' },
          { title: 'Desktop', hasSeparator: false, rightLabel: '⇧⌘D', action: 'goDesktop' },
          { title: 'Documents', hasSeparator: false, rightLabel: '⇧⌘O', action: 'goDocuments' },
          { title: 'Downloads', hasSeparator: false, rightLabel: '⌥⌘L', action: 'goDownloads' },
          { title: 'Projects', hasSeparator: true, rightLabel: '', action: 'goProjects' },
          { title: 'Terminal', hasSeparator: false, rightLabel: '⇧⌘U', action: 'openTerminal' },
        ],
      },
      {
        id: 'edit',
        label: 'Edit',
        items: [
          { title: 'Undo', hasSeparator: false, rightLabel: '⌘Z', action: null },
          { title: 'Redo', hasSeparator: true, rightLabel: '⇧⌘Z', action: null },
          { title: 'Cut', hasSeparator: false, rightLabel: '⌘X', action: null },
          { title: 'Copy', hasSeparator: false, rightLabel: '⌘C', action: null },
          { title: 'Paste', hasSeparator: false, rightLabel: '⌘V', action: null },
          { title: 'Select All', hasSeparator: false, rightLabel: '⌘A', action: null },
        ],
      },
      {
        id: 'view',
        label: 'View',
        items: [
          { title: 'as Icons', hasSeparator: false, rightLabel: '⌘1', action: 'viewAsIcons' },
          { title: 'as List', hasSeparator: true, rightLabel: '⌘2', action: 'viewAsList' },
          { title: 'Show Sidebar', hasSeparator: false, rightLabel: '^⌘S', action: null },
        ],
      },
      {
        id: 'window',
        label: 'Window',
        items: [
          { title: 'Minimize', hasSeparator: false, rightLabel: '⌘M', action: 'minimize' },
          { title: 'Zoom', hasSeparator: true, rightLabel: '', action: 'zoom' },
          { title: 'Bring All to Front', hasSeparator: false, rightLabel: '', action: 'bringAllToFront' },
        ],
      },
      {
        id: 'help',
        label: 'Help',
        items: [{ title: 'About Ikhlas', hasSeparator: false, rightLabel: '', action: 'portfolioHelp' }],
      },
    ],
    status: {
      battery: 'Battery',
      batteryLevel: '87%',
      wifi: 'Wi-Fi: connected',
      search: 'Search',
      controlCenter: 'Control Center',
    },
    desktopIconAlt: 'desktop item icon',
    desktopItems: [
      { id: '1', title: 'Macintosh HD', icon: `${IMAGES}/disk-icon.png`, target: { kind: 'finder', path: [] } },
      {
        id: '2',
        title: 'Giant Sur',
        icon: `${IMAGES}/folder-icon.png`,
        target: { kind: 'finder', path: ['desktop', 'projects'] },
      },
      { id: '3', title: 'Example.pdf', icon: `${IMAGES}/pdf-icon.png`, target: { kind: 'file', path: ['desktop', 'cv'] } },
    ],
    dockLabel: 'Dock',
    dockItems: [
      { id: 'finder', title: 'Finder', logo: `${IMAGES}/finder-logo.png`, app: 'finder' },
      { id: 'safari', title: 'Safari', logo: `${IMAGES}/safari-logo.png`, app: 'browser' },
      { id: 'messages', title: 'Messages', logo: `${IMAGES}/messages-logo.png`, app: 'messages' },
      { id: 'music', title: 'Music', logo: `${IMAGES}/music-logo.png`, app: 'music' },
      { id: 'mail', title: 'Mail', logo: `${IMAGES}/mail-logo.png`, app: 'mail' },
      { id: 'photos', title: 'Photos', logo: `${IMAGES}/photos-logo.png`, app: 'photos' },
      { id: 'calendar', title: 'Calendar', logo: `${IMAGES}/calendar-logo.png`, app: 'calendar' },
      { id: 'notes', title: 'Note', logo: `${IMAGES}/note-logo.png`, app: 'notes' },
      { id: 'settings', title: 'Settings', logo: `${IMAGES}/settings-logo.png`, app: 'settings' },
    ],
    dockLinks: [
      { id: 'github', title: 'GitHub', href: SITE.socials.github },
      { id: 'linkedin', title: 'LinkedIn', href: SITE.socials.linkedin },
    ],
    intlLocale: 'en-US',
  },
  fr: {
    appleMenu: {
      id: 'apple',
      label: 'Apple',
      ariaLabel: 'Menu Apple',
      items: [
        { title: 'À propos de ce Mac', hasSeparator: true, rightLabel: '', action: 'about' },
        { title: 'Préférences Système…', hasSeparator: false, rightLabel: '', action: 'settings' },
        { title: 'App Store…', hasSeparator: true, rightLabel: '8 mises à jour', action: null },
        { title: 'Éléments récents', hasSeparator: true, rightLabel: '', action: null },
        { title: 'Forcer à quitter…', hasSeparator: true, rightLabel: '⌥⌘⎋', action: 'quitApp' },
        { title: 'Suspendre l’activité', hasSeparator: false, rightLabel: '', action: null },
        { title: 'Redémarrer…', hasSeparator: false, rightLabel: '', action: 'restart' },
        { title: 'Éteindre…', hasSeparator: true, rightLabel: '', action: 'shutDown' },
        { title: 'Verrouiller l’écran', hasSeparator: false, rightLabel: '^⌘Q', action: null },
        { title: 'Fermer la session de Ikhlas Agbeti…', hasSeparator: false, rightLabel: '⇧⌘Q', action: 'logOut' },
      ],
    },
    appMenu: {
      id: 'app',
      label: '{app}',
      items: [
        { title: 'À propos de {app}', hasSeparator: true, rightLabel: '', action: 'about' },
        { title: 'Préférences…', hasSeparator: true, rightLabel: '⌘ ,', action: 'settings' },
        { title: 'Vider la corbeille…', hasSeparator: true, rightLabel: '⇧⌘⌫', action: null },
        { title: 'Services', hasSeparator: true, rightLabel: '', action: null },
        { title: 'Masquer {app}', hasSeparator: false, rightLabel: '⌘H', action: 'hideApp' },
        { title: 'Masquer les autres', hasSeparator: false, rightLabel: '⌥⌘H', action: 'hideOthers' },
        { title: 'Tout afficher', hasSeparator: true, rightLabel: '', action: 'showAll' },
        { title: 'Quitter {app}', hasSeparator: false, rightLabel: '⌘Q', action: 'quitApp' },
      ],
    },
    appMenus: [
      {
        id: 'file',
        label: 'Fichier',
        items: [
          { title: 'Nouvelle fenêtre Finder', hasSeparator: false, rightLabel: '⌘N', action: 'newFinderWindow' },
          { title: 'Nouvelle note', hasSeparator: true, rightLabel: '', action: 'newNote' },
          { title: 'Fermer la fenêtre', hasSeparator: true, rightLabel: '⌘W', action: 'closeWindow' },
          { title: 'Bureau', hasSeparator: false, rightLabel: '⇧⌘D', action: 'goDesktop' },
          { title: 'Documents', hasSeparator: false, rightLabel: '⇧⌘O', action: 'goDocuments' },
          { title: 'Téléchargements', hasSeparator: false, rightLabel: '⌥⌘L', action: 'goDownloads' },
          { title: 'Projets', hasSeparator: true, rightLabel: '', action: 'goProjects' },
          { title: 'Terminal', hasSeparator: false, rightLabel: '⇧⌘U', action: 'openTerminal' },
        ],
      },
      {
        id: 'edit',
        label: 'Édition',
        items: [
          { title: 'Annuler', hasSeparator: false, rightLabel: '⌘Z', action: null },
          { title: 'Rétablir', hasSeparator: true, rightLabel: '⇧⌘Z', action: null },
          { title: 'Couper', hasSeparator: false, rightLabel: '⌘X', action: null },
          { title: 'Copier', hasSeparator: false, rightLabel: '⌘C', action: null },
          { title: 'Coller', hasSeparator: false, rightLabel: '⌘V', action: null },
          { title: 'Tout sélectionner', hasSeparator: false, rightLabel: '⌘A', action: null },
        ],
      },
      {
        id: 'view',
        label: 'Présentation',
        items: [
          { title: 'Par icônes', hasSeparator: false, rightLabel: '⌘1', action: 'viewAsIcons' },
          { title: 'Par liste', hasSeparator: true, rightLabel: '⌘2', action: 'viewAsList' },
          { title: 'Afficher la barre latérale', hasSeparator: false, rightLabel: '^⌘S', action: null },
        ],
      },
      {
        id: 'window',
        label: 'Fenêtre',
        items: [
          { title: 'Placer dans le Dock', hasSeparator: false, rightLabel: '⌘M', action: 'minimize' },
          { title: 'Réduire/agrandir', hasSeparator: true, rightLabel: '', action: 'zoom' },
          { title: 'Tout ramener au premier plan', hasSeparator: false, rightLabel: '', action: 'bringAllToFront' },
        ],
      },
      {
        id: 'help',
        label: 'Aide',
        items: [{ title: 'À propos d’Ikhlas', hasSeparator: false, rightLabel: '', action: 'portfolioHelp' }],
      },
    ],
    status: {
      battery: 'Batterie',
      batteryLevel: '87 %',
      wifi: 'Wi-Fi : connecté',
      search: 'Rechercher',
      controlCenter: 'Centre de contrôle',
    },
    desktopIconAlt: 'icône du bureau',
    desktopItems: [
      { id: '1', title: 'Macintosh HD', icon: `${IMAGES}/disk-icon.png`, target: { kind: 'finder', path: [] } },
      {
        id: '2',
        title: 'Giant Sur',
        icon: `${IMAGES}/folder-icon.png`,
        target: { kind: 'finder', path: ['desktop', 'projects'] },
      },
      { id: '3', title: 'Example.pdf', icon: `${IMAGES}/pdf-icon.png`, target: { kind: 'file', path: ['desktop', 'cv'] } },
    ],
    dockLabel: 'Dock',
    dockItems: [
      { id: 'finder', title: 'Finder', logo: `${IMAGES}/finder-logo.png`, app: 'finder' },
      { id: 'safari', title: 'Safari', logo: `${IMAGES}/safari-logo.png`, app: 'browser' },
      { id: 'messages', title: 'Messages', logo: `${IMAGES}/messages-logo.png`, app: 'messages' },
      { id: 'music', title: 'Music', logo: `${IMAGES}/music-logo.png`, app: 'music' },
      { id: 'mail', title: 'Mail', logo: `${IMAGES}/mail-logo.png`, app: 'mail' },
      { id: 'photos', title: 'Photos', logo: `${IMAGES}/photos-logo.png`, app: 'photos' },
      { id: 'calendar', title: 'Calendar', logo: `${IMAGES}/calendar-logo.png`, app: 'calendar' },
      { id: 'notes', title: 'Note', logo: `${IMAGES}/note-logo.png`, app: 'notes' },
      { id: 'settings', title: 'Settings', logo: `${IMAGES}/settings-logo.png`, app: 'settings' },
    ],
    dockLinks: [
      { id: 'github', title: 'GitHub', href: SITE.socials.github },
      { id: 'linkedin', title: 'LinkedIn', href: SITE.socials.linkedin },
    ],
    intlLocale: 'fr-FR',
  },
}
