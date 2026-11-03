import type { Localized } from '@/data/locale'
import type { Locale } from '@/data/locale'
import { PROJECTS } from '@/data/projects'
import { ROLES } from '@/data/roles'
import { SITE } from '@/data/site'

// Faux macOS de l'écran du MacBook 3D : textes des apps et de l'arborescence du Finder.

type FsBase = { id: string; name: string; date: string }

export type FsFolder = FsBase & { kind: 'folder'; children: FsNode[] }
export type FsTextFile = FsBase & { kind: 'text'; content: string }
export type FsImageFile = FsBase & { kind: 'image'; photoId: string; alt: string }
export type CvSection = { heading: string; lines: string[] }
export type FsPdfFile = FsBase & { kind: 'pdf'; document: { title: string; subtitle: string; sections: CvSection[] } }
export type FsFile = FsTextFile | FsImageFile | FsPdfFile
export type FsNode = FsFolder | FsFile

export type FinderLocation = { kind: 'folder'; path: string[] } | { kind: 'recents' } | { kind: 'applications' }

export type FinderFavorite = {
  id: 'recents' | 'applications' | 'desktop' | 'documents' | 'downloads' | 'projects'
  location: FinderLocation
}

export type FinderViewMode = 'icons' | 'list'

export type MeetingFormat = 'video' | 'phone' | 'inPerson'

export type NotesEntry = { id: string; folder: string | null; title: string; body: string[] }

export type CalendarEventKind = 'release' | 'meeting' | 'other'

export type CalendarEvent = {
  id: string
  monthOffset: number
  day: number
  name: string
  kind: CalendarEventKind
  kindLabel: string
  startTime: string
  endTime: string
  spansMidnight: boolean
  link: { label: string; href: string } | null
}

export type MacFileTexts = {
  folders: Record<'home' | 'desktop' | 'documents' | 'downloads' | 'projects' | 'skills' | 'trash', string>
  about: { name: string; lines: string[] }
  readme: string
  photo: string
  stack: { name: string; heading: string }
  downloadedPhoto: { name: string; alt: string; photoId: string }
  cv: { name: string; title: string; subtitle: string; sections: CvSection[] }
}

const GITHUB_HANDLE = 'github.com/Ikhlas187'

export const MAC_FILE_TEXTS: Localized<MacFileTexts> = {
  en: {
    folders: {
      home: 'ikhlas',
      desktop: 'Desktop',
      documents: 'Documents',
      downloads: 'Downloads',
      projects: 'Projects',
      skills: 'Skills',
      trash: 'Trash',
    },
    about: {
      name: 'About.txt',
      lines: [
        'Ikhlas Agbeti',
        'Software Engineer',
        '',
        'I build fast, readable products with character in every pixel: interfaces in React and TypeScript, APIs in Node and Django, and automations with Make and n8n.',
        '',
        'I studied software engineering at IFRI, worked as a developer at Comprint, then joined Socialoop as a junior developer to build automations and AI agents for a remote-first European team.',
        '',
        `Email: ${SITE.email}`,
        `GitHub: ${GITHUB_HANDLE}`,
      ],
    },
    readme: 'README.txt',
    photo: 'Photo',
    stack: { name: 'Stack.txt', heading: 'Every tool I work with' },
    downloadedPhoto: { name: 'code.jpg', alt: 'Lines of code on a dark screen', photoId: '1555066931-4365d14bab8c' },
    cv: {
      name: 'CV.pdf',
      title: 'Ikhlas Agbeti',
      subtitle: 'Software Engineer',
      sections: [
        {
          heading: 'Experience',
          lines: [
            'Socialoop · Junior developer: automations and AI agents for a remote-first European team',
            'Comprint · Developer: user interfaces up to a full Django application',
          ],
        },
        { heading: 'Education', lines: ['IFRI · Software engineering'] },
        {
          heading: 'Skills',
          lines: [
            'React, TypeScript, Tailwind, Framer Motion',
            'Node, Express, Django, Laravel, PHP',
            'PostgreSQL, MySQL, Supabase',
            'Make, n8n, AI agents, Docker, GitHub Actions',
          ],
        },
        { heading: 'Contact', lines: [SITE.email, GITHUB_HANDLE] },
      ],
    },
  },
  fr: {
    folders: {
      home: 'ikhlas',
      desktop: 'Bureau',
      documents: 'Documents',
      downloads: 'Téléchargements',
      projects: 'Projets',
      skills: 'Compétences',
      trash: 'Corbeille',
    },
    about: {
      name: 'À propos.txt',
      lines: [
        'Ikhlas Agbeti',
        'Software Engineer',
        '',
        'Je construis des produits rapides et lisibles, avec du caractère dans chaque pixel : des interfaces en React et TypeScript, des API en Node et Django, et des automatisations avec Make et n8n.',
        '',
        'J’ai étudié le génie logiciel à l’IFRI, travaillé comme développeur chez Comprint, puis rejoint Socialoop comme développeur junior pour construire des automatisations et des agents IA au sein d’une équipe européenne à distance.',
        '',
        `E-mail : ${SITE.email}`,
        `GitHub : ${GITHUB_HANDLE}`,
      ],
    },
    readme: 'LISEZMOI.txt',
    photo: 'Photo',
    stack: { name: 'Stack.txt', heading: 'Tous les outils avec lesquels je travaille' },
    downloadedPhoto: { name: 'code.jpg', alt: 'Lignes de code sur un écran sombre', photoId: '1555066931-4365d14bab8c' },
    cv: {
      name: 'CV.pdf',
      title: 'Ikhlas Agbeti',
      subtitle: 'Software Engineer',
      sections: [
        {
          heading: 'Expérience',
          lines: [
            'Socialoop · Développeur junior : automatisations et agents IA pour une équipe européenne à distance',
            'Comprint · Développeur : des interfaces utilisateur jusqu’à une application Django complète',
          ],
        },
        { heading: 'Formation', lines: ['IFRI · Génie logiciel'] },
        {
          heading: 'Compétences',
          lines: [
            'React, TypeScript, Tailwind, Framer Motion',
            'Node, Express, Django, Laravel, PHP',
            'PostgreSQL, MySQL, Supabase',
            'Make, n8n, agents IA, Docker, GitHub Actions',
          ],
        },
        { heading: 'Contact', lines: [SITE.email, GITHUB_HANDLE] },
      ],
    },
  },
}

export const FILE_TREE_YEAR = '2026'

export const DESKTOP_PATH = ['desktop']
export const CV_PATH = ['desktop', 'cv']
export const ABOUT_PATH = ['desktop', 'about']
export const PROJECTS_PATH = ['desktop', 'projects']

export const FINDER_FAVORITES: FinderFavorite[] = [
  { id: 'recents', location: { kind: 'recents' } },
  { id: 'applications', location: { kind: 'applications' } },
  { id: 'desktop', location: { kind: 'folder', path: ['desktop'] } },
  { id: 'documents', location: { kind: 'folder', path: ['documents'] } },
  { id: 'downloads', location: { kind: 'folder', path: ['downloads'] } },
  { id: 'projects', location: { kind: 'folder', path: ['desktop', 'projects'] } },
]

export const FINDER_LOCATIONS: FinderLocation[] = [{ kind: 'folder', path: [] }]

export const BROWSER_HOST = 'ikhlas.studio'

export type AppName =
  | 'finder'
  | 'browser'
  | 'notes'
  | 'terminal'
  | 'mail'
  | 'photos'
  | 'settings'
  | 'preview'
  | 'about'
  | 'messages'
  | 'music'
  | 'calendar'

type MacOSTexts = {
  appNames: Record<AppName, string>
  boot: { label: string }
  windowControls: { close: string; minimize: string; zoom: string }
  about: { title: string; name: string; role: string; rows: { label: string; value: string }[]; moreInfo: string }
  finder: {
    favorites: string
    locations: string
    back: string
    forward: string
    recents: string
    applications: string
    macintoshHd: string
    iconView: string
    listView: string
    changeView: string
    share: string
    tags: string
    search: string
    clearSearch: string
    columns: { name: string; size: string; kind: string; dateAdded: string }
    kinds: Record<FsNode['kind'] | 'app', string>
    sizeUnits: { bytes: string; kb: string; mb: string; decimal: string }
  }
  preview: { page: string }
  browser: {
    back: string
    forward: string
    reload: string
    home: string
    loading: string
    addressPlaceholder: string
    aboutTitle: string
    google: string
    // {query} est remplacé par la recherche.
    googleSearchTitle: string
    openInNewTab: string
    notFoundTitle: string
    notFoundBody: string
  }
  notes: {
    title: string
    folders: string
    folderNames: Record<string, string>
    testimonialsHint: string
    testimonialsEmpty: string
    // {name} est remplacé par l'auteur de la note.
    testimonialFrom: string
    anonymous: string
    newTestimonial: string
    cancel: string
    post: string
    posting: string
    composePlaceholder: string
    namePlaceholder: string
    postError: string
    entries: NotesEntry[]
  }
  terminal: {
    host: string
    // {user} est remplacé par le nom du dossier personnel.
    title: string
    workingDirectory: string
    welcome: string
    whoami: string
    inputLabel: string
    help: string[]
    notFound: string
    catUsage: string
    catMissing: string
  }
  mail: { to: string; subject: string; subjectValue: string; message: string; messageValue: string; send: string }
  photos: {
    library: string
    albums: string
    memories: string
    pinned: string
    peopleAndPets: string
    peopleHint: string
    empty: string
    item: string
    items: string
    done: string
    close: string
    share: string
    like: string
    info: string
    adjustments: string
    delete: string
    closeInfo: string
    album: string
    file: string
    pinnedAlbums: string[]
    memoriesAlbums: string[]
  }
  messages: {
    contactName: string
    contactStatus: string
    search: string
    inputPlaceholder: string
    send: string
    conversation: { id: string; text: string; isFromVisitor: boolean }[]
    reply: string
  }
  music: {
    library: string
    playlist: string
    playlistTitle: string
    playlistSubtitle: string
    play: string
    pause: string
    columns: { title: string; artist: string; time: string }
    tracks: { id: string; title: string; artist: string; duration: string }[]
  }
  calendar: {
    previous: string
    next: string
    // 0 : la semaine commence le dimanche, 1 : le lundi.
    weekStart: 0 | 1
    isHour12: boolean
    weekdays: string[]
    monthNames: string[]
    noEvents: string
    bookMeeting: string
    nextDay: string
    eventDone: string
    eventClose: string
    // Événements relatifs au mois courant : monthOffset 0 = ce mois-ci.
    events: CalendarEvent[]
    booking: {
      title: string
      cancel: string
      send: string
      sending: string
      done: string
      name: string
      namePlaceholder: string
      email: string
      emailPlaceholder: string
      date: string
      time: string
      // {timezone} est remplacé par le fuseau du visiteur.
      timezoneHint: string
      phone: string
      phonePlaceholder: string
      inPersonHint: string
      about: string
      aboutPlaceholder: string
      messagePlaceholder: string
      footnote: string
      error: string
      sentTitle: string
      // {date} et {time} sont remplacés par le créneau demandé.
      sentBody: string
      format: string
      formats: Record<MeetingFormat, string>
    }
  }
  settings: {
    title: string
    language: string
    languageHint: string
    appearance: string
    appearanceValue: string
    appearanceValueDark: string
    wallpaper: string
    wallpaperValue: string
  }
  controlCenter: {
    label: string
    wifi: string
    wifiOn: string
    bluetooth: string
    airDrop: string
    airDropOn: string
    on: string
    off: string
    focus: string
    focusOn: string
    darkMode: string
    display: string
    sound: string
  }
}

function event(
  id: string,
  monthOffset: number,
  day: number,
  name: string,
  kind: CalendarEventKind,
  kindLabel: string,
  startTime: string,
  endTime: string,
  link: CalendarEvent['link'] = null,
  spansMidnight = false,
): CalendarEvent {
  return { id, monthOffset, day, name, kind, kindLabel, startTime, endTime, spansMidnight, link }
}

const NOTES_INTRO: Localized<NotesEntry[]> = {
  en: [
    {
      id: 'what-i-do',
      folder: null,
      title: 'ikhlas / what i do',
      body: [
        'I’m Ikhlas Agbeti, a software engineer. I build interfaces in React and TypeScript, APIs in Node and Django, and automations with Make and n8n.',
        'I studied software engineering at IFRI, worked as a developer at Comprint, then joined Socialoop as a junior developer to build automations and AI agents for a remote-first European team.',
        `For projects, contracts or roles: ${SITE.email}. Tell me what you’re building, the scope, your timeline and your budget, and we can work out the next step.`,
      ],
    },
    { id: 'work-with-me', folder: null, title: 'work with me', body: [] },
    {
      id: 'how-i-work',
      folder: null,
      title: 'how i work',
      body: [
        'ship small, read the code twice. you learn more by shipping than by planning.',
        'fast and readable first, then character in every pixel. animations come last, never at the cost of the first load.',
      ],
    },
    {
      id: 'why-this-mac',
      folder: null,
      title: 'why build a mac inside a portfolio',
      body: [
        'got tired of portfolios that are just a list of cards. this one boots, has a finder, a terminal and apps you can actually use.',
        'built with: react, typescript, tailwind, three.js for the macbook, framer motion and gsap for the movement. hosted on vercel.',
      ],
    },
  ],
  fr: [
    {
      id: 'what-i-do',
      folder: null,
      title: 'ikhlas / ce que je fais',
      body: [
        'Je suis Ikhlas Agbeti, software engineer. Je construis des interfaces en React et TypeScript, des API en Node et Django, et des automatisations avec Make et n8n.',
        'J’ai étudié le génie logiciel à l’IFRI, travaillé comme développeur chez Comprint, puis rejoint Socialoop comme développeur junior pour construire des automatisations et des agents IA au sein d’une équipe européenne à distance.',
        `Pour un projet, une mission ou un poste : ${SITE.email}. Dites-moi ce que vous construisez, le périmètre, le calendrier et le budget, et on voit la suite ensemble.`,
      ],
    },
    { id: 'work-with-me', folder: null, title: 'travailler avec moi', body: [] },
    {
      id: 'how-i-work',
      folder: null,
      title: 'ma façon de travailler',
      body: [
        'livrer petit, relire le code 2 fois. on apprend plus en livrant qu’en planifiant.',
        'rapide et lisible d’abord, puis du caractère dans chaque pixel. les animations viennent en dernier, jamais au prix du 1er chargement.',
      ],
    },
    {
      id: 'why-this-mac',
      folder: null,
      title: 'pourquoi un mac dans un portfolio',
      body: [
        'marre des portfolios qui ne sont qu’une liste de cartes. celui-ci démarre, a un finder, un terminal et des apps qu’on peut vraiment utiliser.',
        'fait avec : react, typescript, tailwind, three.js pour le macbook, framer motion et gsap pour le mouvement. hébergé sur vercel.',
      ],
    },
  ],
}

// Notes hors dossier puis dossier Projects, tirées du parcours d'Ikhlas (roles.ts, projects.ts).
function notesEntries(locale: Locale): NotesEntry[] {
  const roles = ROLES[locale].map((role) => `${role.name}: ${role.stack.join(', ')}.`)
  const intro = NOTES_INTRO[locale].map((entry) => (entry.id === 'work-with-me' ? { ...entry, body: roles } : entry))
  const projects = PROJECTS[locale].map((project) => ({
    id: `project-${project.name.toLowerCase()}`,
    folder: 'projects',
    title: project.name.toLowerCase(),
    body: [project.description, `${project.eyebrow} · ${project.date}`],
  }))
  return [...intro, ...projects]
}

export const MACOS: Localized<MacOSTexts> = {
  en: {
    appNames: {
      finder: 'Finder',
      browser: 'Safari',
      notes: 'Notes',
      terminal: 'Terminal',
      mail: 'Mail',
      photos: 'Photos',
      settings: 'System Preferences',
      preview: 'Preview',
      about: 'About This Mac',
      messages: 'Messages',
      music: 'Music',
      calendar: 'Calendar',
    },
    boot: { label: 'Starting up' },
    windowControls: { close: 'Close', minimize: 'Minimize', zoom: 'Full screen' },
    about: {
      title: 'About This Mac',
      name: 'Ikhlas Agbeti',
      role: 'Software Engineer',
      rows: [
        { label: 'Education', value: 'Software engineering, IFRI' },
        { label: 'Experience', value: 'Socialoop, Comprint' },
        { label: 'Focus', value: 'Web apps, automations, AI agents' },
        { label: 'Email', value: SITE.email },
        { label: 'Website', value: BROWSER_HOST },
      ],
      moreInfo: 'More Info…',
    },
    finder: {
      favorites: 'Favorites',
      locations: 'Locations',
      back: 'Back',
      forward: 'Forward',
      recents: 'Recents',
      applications: 'Applications',
      macintoshHd: 'Macintosh HD',
      iconView: 'as Icons',
      listView: 'as List',
      changeView: 'Change the item view',
      share: 'Share',
      tags: 'Edit Tags',
      search: 'Search',
      clearSearch: 'Clear',
      columns: { name: 'Name', size: 'Size', kind: 'Kind', dateAdded: 'Date Added' },
      kinds: { folder: 'Folder', text: 'Plain Text', image: 'JPEG image', pdf: 'PDF document', app: 'Application' },
      sizeUnits: { bytes: 'bytes', kb: 'KB', mb: 'MB', decimal: '.' },
    },
    preview: { page: 'Page 1 of 1' },
    browser: {
      back: 'Back',
      forward: 'Forward',
      reload: 'Reload',
      home: 'Home',
      loading: 'Loading...',
      addressPlaceholder: 'Search Google or type a URL',
      aboutTitle: 'About Ikhlas',
      google: 'Google',
      googleSearchTitle: '{query} - Google Search',
      openInNewTab: 'Open in a new tab',
      notFoundTitle: 'Page not found',
      notFoundBody: 'This page doesn’t exist on ikhlas.studio.',
    },
    notes: {
      title: 'Notes',
      folders: 'Folders',
      folderNames: { testimonials: 'Testimonials', projects: 'Projects' },
      testimonialsHint: 'Notes from people who stopped by. Tap the pencil to leave one.',
      testimonialsEmpty: 'No notes yet. Be the first.',
      testimonialFrom: 'from {name}',
      anonymous: 'someone who stopped by',
      newTestimonial: 'New testimonial',
      cancel: 'Cancel',
      post: 'Post',
      posting: 'Posting…',
      composePlaceholder: 'Write something for Ikhlas… what you think of the site, a project, anything.',
      namePlaceholder: 'Your name or @ (optional)',
      postError: 'Couldn’t post that. Try again?',
      entries: notesEntries('en'),
    },
    terminal: {
      host: 'ikhlas@macbook',
      title: '{user} · zsh',
      workingDirectory: '/Users/{user}',
      welcome: 'Last login: today on console. Type help to get started.',
      whoami: 'ikhlas: Ikhlas Agbeti, Software Engineer',
      inputLabel: 'Terminal command',
      help: [
        'Available commands:',
        '  help            show this help',
        '  ls              list files',
        '  whoami          who uses this Mac',
        '  cat About.txt   read about Ikhlas',
        '  pwd, echo       the classics',
        '  clear           clear the screen',
      ],
      notFound: 'zsh: command not found: {command}',
      catUsage: 'usage: cat About.txt',
      catMissing: 'cat: {file}: No such file or directory',
    },
    mail: {
      to: 'To:',
      subject: 'Subject:',
      subjectValue: 'Hello Ikhlas',
      message: 'Message',
      messageValue: 'Hi Ikhlas,\n\nI saw your portfolio and I’d like to talk about…',
      send: 'Send',
    },
    photos: {
      library: 'Library',
      albums: 'Albums',
      memories: 'Memories',
      pinned: 'Pinned',
      peopleAndPets: 'People & Pets',
      peopleHint: 'Tag people when you add new photos to see them here.',
      empty: 'No media uploaded yet.',
      item: 'item',
      items: 'items',
      done: 'Done',
      close: 'Close',
      share: 'Share',
      like: 'Like',
      info: 'Info',
      adjustments: 'Adjustments',
      delete: 'Delete',
      closeInfo: 'Close info',
      album: 'Album',
      file: 'File',
      pinnedAlbums: ['NEVORA'],
      memoriesAlbums: ['NEVORA', 'DRIP', 'MEDICASTOCK'],
    },
    messages: {
      contactName: 'Ikhlas Agbeti',
      contactStatus: 'Usually replies within a day',
      search: 'Search',
      inputPlaceholder: 'iMessage',
      send: 'Send',
      conversation: [
        { id: 'hello', text: 'Hi! Welcome to my portfolio.', isFromVisitor: false },
        { id: 'offer', text: 'Ask me anything about my projects, or write to me with Mail.', isFromVisitor: false },
      ],
      reply: 'Thanks for the message! For a real answer, send me an email from the Mail app.',
    },
    music: {
      library: 'Library',
      playlist: 'Playlists',
      playlistTitle: 'Deep Work',
      playlistSubtitle: 'Ikhlas Agbeti · 6 songs',
      play: 'Play',
      pause: 'Pause',
      columns: { title: 'Title', artist: 'Artist', time: 'Time' },
      tracks: [
        { id: 'night-shift', title: 'Night Shift Commit', artist: 'Lo-fi Desk', duration: '3:12' },
        { id: 'clean-build', title: 'Clean Build', artist: 'The Linters', duration: '2:48' },
        { id: 'async', title: 'Async Await', artist: 'Promise Club', duration: '4:05' },
        { id: 'cotonou', title: 'Cotonou Sunset', artist: 'Lo-fi Desk', duration: '3:37' },
        { id: 'merge', title: 'Merge Without Conflict', artist: 'The Linters', duration: '2:59' },
        { id: 'deploy', title: 'Friday Deploy', artist: 'Promise Club', duration: '3:21' },
      ],
    },
    calendar: {
      previous: 'Previous month',
      next: 'Next month',
      weekStart: 0,
      isHour12: true,
      weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      noEvents: 'No events',
      bookMeeting: 'Book a meeting',
      nextDay: '(+1 day)',
      eventDone: 'Done',
      eventClose: 'Close',
      booking: {
        title: 'Book a meeting',
        cancel: 'Cancel',
        send: 'Send',
        sending: 'Sending…',
        done: 'Done',
        name: 'Name',
        namePlaceholder: 'Your name',
        email: 'Email',
        emailPlaceholder: 'you@email.com',
        date: 'Date',
        time: 'Time',
        timezoneHint: 'Times are in your time zone ({timezone}).',
        phone: 'Phone',
        phonePlaceholder: '+229…',
        inPersonHint: 'Ikhlas will confirm where to meet in Cotonou.',
        about: 'About',
        aboutPlaceholder: 'e.g. A landing page for my startup',
        messagePlaceholder: 'What would you like to talk about? Share any links, budget or timeline.',
        footnote:
          'This is a request, not a booking yet. Ikhlas will accept, decline or suggest another time by email. Your details are only used to reply.',
        error: 'That didn’t go through. Please try again.',
        sentTitle: 'Request sent',
        sentBody: '{date} at {time}. Ikhlas will look at it and confirm by email.',
        format: 'Format',
        formats: { video: 'Video call', phone: 'Phone call', inPerson: 'In person' },
      },
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      events: [
        event('launch', 0, 6, 'Portfolio v2 launch', 'release', 'Release', '18:00', '19:00', {
          label: 'Visit the site',
          href: SITE.url,
        }),
        event('workshop', 0, 14, 'n8n automation workshop', 'meeting', 'Workshop', '10:00', '13:00'),
        event('review', 0, 21, 'Code review: MEDICASTOCK', 'other', 'Review', '15:00', '16:00'),
        event('hackathon', 1, 9, 'Weekend hackathon', 'meeting', 'Hackathon', '20:00', '02:00', null, true),
      ],
    },
    settings: {
      title: 'System Preferences',
      language: 'Language',
      languageHint: 'Changes the language of the whole portfolio.',
      appearance: 'Appearance',
      appearanceValue: 'Light',
      appearanceValueDark: 'Dark',
      wallpaper: 'Wallpaper',
      wallpaperValue: 'Big Sur',
    },
    controlCenter: {
      label: 'Control Center',
      wifi: 'Wi-Fi',
      wifiOn: 'Ikhlas Studio',
      bluetooth: 'Bluetooth',
      airDrop: 'AirDrop',
      airDropOn: 'Contacts Only',
      on: 'On',
      off: 'Off',
      focus: 'Focus',
      focusOn: 'Do Not Disturb',
      darkMode: 'Dark Mode',
      display: 'Display',
      sound: 'Sound',
    },
  },
  fr: {
    appNames: {
      finder: 'Finder',
      browser: 'Safari',
      notes: 'Notes',
      terminal: 'Terminal',
      mail: 'Mail',
      photos: 'Photos',
      settings: 'Préférences Système',
      preview: 'Aperçu',
      about: 'À propos de ce Mac',
      messages: 'Messages',
      music: 'Musique',
      calendar: 'Calendrier',
    },
    boot: { label: 'Démarrage' },
    windowControls: { close: 'Fermer', minimize: 'Placer dans le Dock', zoom: 'Plein écran' },
    about: {
      title: 'À propos de ce Mac',
      name: 'Ikhlas Agbeti',
      role: 'Software Engineer',
      rows: [
        { label: 'Formation', value: 'Génie logiciel, IFRI' },
        { label: 'Expérience', value: 'Socialoop, Comprint' },
        { label: 'Domaines', value: 'Apps web, automatisations, agents IA' },
        { label: 'E-mail', value: SITE.email },
        { label: 'Site', value: BROWSER_HOST },
      ],
      moreInfo: 'Plus d’infos…',
    },
    finder: {
      favorites: 'Favoris',
      locations: 'Emplacements',
      back: 'Précédent',
      forward: 'Suivant',
      recents: 'Récents',
      applications: 'Applications',
      macintoshHd: 'Macintosh HD',
      iconView: 'par icônes',
      listView: 'par liste',
      changeView: 'Changer la présentation des éléments',
      share: 'Partager',
      tags: 'Modifier les tags',
      search: 'Rechercher',
      clearSearch: 'Effacer',
      columns: { name: 'Nom', size: 'Taille', kind: 'Type', dateAdded: 'Date d’ajout' },
      kinds: { folder: 'Dossier', text: 'Texte brut', image: 'Image JPEG', pdf: 'Document PDF', app: 'Application' },
      sizeUnits: { bytes: 'octets', kb: 'Ko', mb: 'Mo', decimal: ',' },
    },
    preview: { page: 'Page 1 sur 1' },
    browser: {
      back: 'Précédent',
      forward: 'Suivant',
      reload: 'Recharger',
      home: 'Accueil',
      loading: 'Chargement...',
      addressPlaceholder: 'Rechercher sur Google ou saisir une URL',
      aboutTitle: 'À propos d’Ikhlas',
      google: 'Google',
      googleSearchTitle: '{query} - Recherche Google',
      openInNewTab: 'Ouvrir dans un nouvel onglet',
      notFoundTitle: 'Page introuvable',
      notFoundBody: 'Cette page n’existe pas sur ikhlas.studio.',
    },
    notes: {
      title: 'Notes',
      folders: 'Dossiers',
      folderNames: { testimonials: 'Témoignages', projects: 'Projets' },
      testimonialsHint: 'Les mots des gens passés par ici. Touchez le crayon pour laisser le vôtre.',
      testimonialsEmpty: 'Aucune note pour l’instant. Soyez le premier.',
      testimonialFrom: 'de {name}',
      anonymous: 'quelqu’un de passage',
      newTestimonial: 'Nouveau témoignage',
      cancel: 'Annuler',
      post: 'Publier',
      posting: 'Publication…',
      composePlaceholder: 'Écrivez un mot pour Ikhlas… ce que vous pensez du site, d’un projet, de tout.',
      namePlaceholder: 'Votre nom ou @ (facultatif)',
      postError: 'Impossible de publier. On réessaie ?',
      entries: notesEntries('fr'),
    },
    terminal: {
      host: 'ikhlas@macbook',
      title: '{user} · zsh',
      workingDirectory: '/Users/{user}',
      welcome: 'Dernière connexion : aujourd’hui sur la console. Tapez help pour commencer.',
      whoami: 'ikhlas : Ikhlas Agbeti, Software Engineer',
      inputLabel: 'Commande du terminal',
      help: [
        'Commandes disponibles :',
        '  help              affiche cette aide',
        '  ls                liste les fichiers',
        '  whoami            qui utilise ce Mac',
        '  cat À propos.txt  lire la présentation d’Ikhlas',
        '  pwd, echo         les classiques',
        '  clear             efface l’écran',
      ],
      notFound: 'zsh: commande introuvable : {command}',
      catUsage: 'usage : cat À propos.txt',
      catMissing: 'cat: {file} : aucun fichier ou dossier de ce nom',
    },
    mail: {
      to: 'À :',
      subject: 'Objet :',
      subjectValue: 'Bonjour Ikhlas',
      message: 'Message',
      messageValue: 'Bonjour Ikhlas,\n\nJ’ai vu ton portfolio et j’aimerais te parler de…',
      send: 'Envoyer',
    },
    photos: {
      library: 'Photothèque',
      albums: 'Albums',
      memories: 'Souvenirs',
      pinned: 'Épinglés',
      peopleAndPets: 'Personnes et animaux',
      peopleHint: 'Identifiez des personnes en ajoutant des photos pour les voir ici.',
      empty: 'Aucun média pour l’instant.',
      item: 'élément',
      items: 'éléments',
      done: 'OK',
      close: 'Fermer',
      share: 'Partager',
      like: 'J’aime',
      info: 'Infos',
      adjustments: 'Réglages',
      delete: 'Supprimer',
      closeInfo: 'Fermer les infos',
      album: 'Album',
      file: 'Fichier',
      pinnedAlbums: ['NEVORA'],
      memoriesAlbums: ['NEVORA', 'DRIP', 'MEDICASTOCK'],
    },
    messages: {
      contactName: 'Ikhlas Agbeti',
      contactStatus: 'Répond en général sous 24 h',
      search: 'Rechercher',
      inputPlaceholder: 'iMessage',
      send: 'Envoyer',
      conversation: [
        { id: 'hello', text: 'Salut ! Bienvenue sur mon portfolio.', isFromVisitor: false },
        { id: 'offer', text: 'Pose-moi tes questions sur mes projets, ou écris-moi avec Mail.', isFromVisitor: false },
      ],
      reply: 'Merci pour ton message ! Pour une vraie réponse, envoie-moi un e-mail depuis l’app Mail.',
    },
    music: {
      library: 'Bibliothèque',
      playlist: 'Playlists',
      playlistTitle: 'Deep Work',
      playlistSubtitle: 'Ikhlas Agbeti · 6 morceaux',
      play: 'Lecture',
      pause: 'Pause',
      columns: { title: 'Titre', artist: 'Artiste', time: 'Durée' },
      tracks: [
        { id: 'night-shift', title: 'Night Shift Commit', artist: 'Lo-fi Desk', duration: '3:12' },
        { id: 'clean-build', title: 'Clean Build', artist: 'The Linters', duration: '2:48' },
        { id: 'async', title: 'Async Await', artist: 'Promise Club', duration: '4:05' },
        { id: 'cotonou', title: 'Cotonou Sunset', artist: 'Lo-fi Desk', duration: '3:37' },
        { id: 'merge', title: 'Merge Without Conflict', artist: 'The Linters', duration: '2:59' },
        { id: 'deploy', title: 'Friday Deploy', artist: 'Promise Club', duration: '3:21' },
      ],
    },
    calendar: {
      previous: 'Mois précédent',
      next: 'Mois suivant',
      weekStart: 1,
      isHour12: false,
      weekdays: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
      noEvents: 'Aucun événement',
      bookMeeting: 'Prendre rendez-vous',
      nextDay: '(+1 jour)',
      eventDone: 'OK',
      eventClose: 'Fermer',
      booking: {
        title: 'Prendre rendez-vous',
        cancel: 'Annuler',
        send: 'Envoyer',
        sending: 'Envoi…',
        done: 'OK',
        name: 'Nom',
        namePlaceholder: 'Votre nom',
        email: 'E-mail',
        emailPlaceholder: 'vous@email.com',
        date: 'Date',
        time: 'Heure',
        timezoneHint: 'Heures dans votre fuseau horaire ({timezone}).',
        phone: 'Tél.',
        phonePlaceholder: '+229…',
        inPersonHint: 'Ikhlas confirmera le lieu de rendez-vous à Cotonou.',
        about: 'Sujet',
        aboutPlaceholder: 'ex. Une landing page pour ma startup',
        messagePlaceholder: 'De quoi voulez-vous parler ? Partagez liens, budget ou calendrier.',
        footnote:
          'C’est une demande, pas encore une réservation. Ikhlas acceptera, déclinera ou proposera un autre créneau par e-mail. Vos coordonnées ne servent qu’à vous répondre.',
        error: 'L’envoi a échoué. Merci de réessayer.',
        sentTitle: 'Demande envoyée',
        sentBody: '{date} à {time}. Ikhlas va la regarder et confirmer par e-mail.',
        format: 'Format',
        formats: { video: 'Visio', phone: 'Téléphone', inPerson: 'En personne' },
      },
      monthNames: [
        'janvier',
        'février',
        'mars',
        'avril',
        'mai',
        'juin',
        'juillet',
        'août',
        'septembre',
        'octobre',
        'novembre',
        'décembre',
      ],
      events: [
        event('launch', 0, 6, 'Lancement du portfolio v2', 'release', 'Lancement', '18:00', '19:00', {
          label: 'Voir le site',
          href: SITE.url,
        }),
        event('workshop', 0, 14, 'Atelier automatisation n8n', 'meeting', 'Atelier', '10:00', '13:00'),
        event('review', 0, 21, 'Revue de code : MEDICASTOCK', 'other', 'Revue', '15:00', '16:00'),
        event('hackathon', 1, 9, 'Hackathon du week-end', 'meeting', 'Hackathon', '20:00', '02:00', null, true),
      ],
    },
    settings: {
      title: 'Préférences Système',
      language: 'Langue',
      languageHint: 'Change la langue de tout le portfolio.',
      appearance: 'Apparence',
      appearanceValue: 'Clair',
      appearanceValueDark: 'Sombre',
      wallpaper: 'Fond d’écran',
      wallpaperValue: 'Big Sur',
    },
    controlCenter: {
      label: 'Centre de contrôle',
      wifi: 'Wi-Fi',
      wifiOn: 'Ikhlas Studio',
      bluetooth: 'Bluetooth',
      airDrop: 'AirDrop',
      airDropOn: 'Contacts uniquement',
      on: 'Activé',
      off: 'Désactivé',
      focus: 'Concentration',
      focusOn: 'Ne pas déranger',
      darkMode: 'Mode sombre',
      display: 'Écran',
      sound: 'Son',
    },
  },
}
