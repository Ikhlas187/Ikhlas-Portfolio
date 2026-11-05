# portfolio-frontend

Site vitrine d'Ikhlas Agbeti (Software Engineer) : sombre, éditorial, animé au scroll. Chaque section de la home reprend la mécanique d'un site de référence étudié, remplie avec le vrai parcours d'Ikhlas.

Lire ce fichier en premier à chaque session, puis les règles de `.claude/rules/`.

## Arborescence

```
portfolio-frontend/
├── .claude/
│   ├── CLAUDE.md             ce fichier
│   ├── launch.json           config « pnpm dev » pour l'aperçu
│   ├── rules/                règles du repo (architecture, fichiers, imports, ui, icônes, tests…)
│   └── skills/               31 skills front : design, UI, animation, a11y, shadcn, React, Remotion
├── public/                   servi tel quel
│   ├── giantsur/             images du clone Giant Sur (icônes du Dock, + vscode-logo.svg)
│   └── repos/                instantané des repos GitHub d'Ikhlas (index.json + <repo>.json), écrit par pnpm repos:snapshot
├── tools/                    hors app : manga.py, video/ (Remotion), sources/ (photos brutes, ignoré par git),
│                             repos/snapshot.mjs (instantané des repos, secrets filtrés, voir tools/README.md §4)
├── src/
│   ├── main.tsx              monte l'app et importe index.css. Rien d'autre.
│   ├── App.tsx               providers (Helmet, Locale, Music, Router, Lenis) + ContextCursor + routes animées + MusicToggle
│   ├── index.css             Tailwind + shadcn + reset (@layer base) + variables shadcn branchées sur les tokens
│   ├── tokens.css            toutes les CSS vars du portfolio (couleurs, typo, espacements, easings)
│   ├── components/
│   │   ├── ui/               générique, utilisé par toutes les routes
│   │   │   ├── button.tsx          shadcn (Base UI), kebab-case voulu
│   │   │   ├── select.tsx          shadcn (Base UI), restylé crème/noir (boîte du sélecteur de langue)
│   │   │   ├── textarea.tsx, input.tsx  shadcn, restylés sans bordure (champs de PinNote)
│   │   │   ├── PageTransition.tsx  fondu + volet noir entre routes
│   │   │   ├── ContextCursor.tsx   bulle crème à la place du curseur sur les zones data-cursor (planches projet)
│   │   │   ├── MusicToggle.tsx     bouton son fixe en bas à gauche (z-95) : barres d'égaliseur, coupe / relance la musique de fond
│   │   │   └── CoinLoader.tsx      écran de chargement : une seule chute de pièces IKHLAS / AGBETI / DEVELOPER, puis entrée automatique, sans bouton (+ CoinPile, FlatCoin, SolidCoin)
│   │   └── pages/            un dossier par écran
│   │       ├── Home/         HomePage + ses morceaux, sections en .tsx + .css appairés
│   │       │   ├── Hero.tsx             1er écran (réf. haufsess.com) : tagline + photo + nom géant
│   │       │   ├── HomeHeader.tsx       header fixe z-90, fondu au scroll, menu mobile < 810px
│   │       │   ├── NavPill.tsx          pill de nav, survol en ressort (--pill-hover)
│   │       │   ├── LanguageSelect.tsx   sélecteur English / Français (shadcn Select), boîte de la réf.
│   │       │   ├── BurgerButton.tsx     Menu / X lucide du header mobile
│   │       │   ├── HeroName.tsx         nom en SVG mis à l'échelle de la largeur, entrée en ressort
│   │       │   ├── Projects             pile de planches (réf. galerie Behance S. Baldeon)
│   │       │   ├── Interlude.tsx        intercalaire « Selected works » + ellipse dessinée
│   │       │   ├── ProjectBoard.tsx     une planche projet
│   │       │   ├── About                planche claire (réf. abhijitrout.in)
│   │       │   ├── CallWidget.tsx       widget « appel entrant » : le vert ouvre CallBooking (réservation Cal.com intégrée, lien SITE.calLink : Google Meet, agendas et mails gérés par Cal.com)
│   │       │   ├── CallSection.tsx      section du CallWidget, en fin de home sous PinNote
│   │       │   ├── Experience           expériences du CV après About, trait du titre animé (réf. haufsess.com)
│   │       │   ├── SectionHeading.tsx   titre de section de la réf. haufsess.com (trait animé + titre Plus Jakarta Sans), utilisé par Experience
│   │       │   ├── DedicatedTeam        roue elliptique de rôles + logos tech (Draggable)
│   │       │   ├── techIcons.ts         table techno vers { Icon, color }
│   │       │   ├── Services             4 rangées, révélation encre (réf. kaiseisadatoki-v4)
│   │       │   ├── PinNote.tsx          tableau de notes épinglées en fin de home (réf. tpdapson.com), Tailwind
│   │       │   ├── NoteForm.tsx         carte formulaire : note, prénom facultatif, couleur, bouton Pin note
│   │       │   ├── StickyNote.tsx       une note carrée inclinée + punaise lucide Pin
│   │       │   ├── NoteColorPicker.tsx  5 pastilles (radiogroup)
│   │       │   ├── RollingLabel.tsx     libellé de bouton qui roule au survol
│   │       │   ├── noteColorClasses.ts  table couleur de note vers classes Tailwind
│   │       │   ├── Footer.tsx           footer de la réf. haufsess.com : BookingCalendar (créneau = email pré-rempli), contact, LinkedIn, nom, copyright
│   │       │   ├── NameMark.tsx         nom géant en SVG (viewBox de la réf.), partagé par HeroName et Footer
│   │       │   ├── Process              4 étapes, écrit mais PAS monté
│   │       │   ├── MacOSSection.tsx     section macOS (réf. maquette Framer IFRI), sans sticky : l'écran « Selected works » (WorksScreen) rétrécit (1 à 0,5) et descend au scroll, en ressort, jusqu'à finir caché sous la dalle du Mac (cadre noir, encoche), centré dessus ; bouton Allumer après extinction
│   │       │   ├── WorksScreen.tsx      1er écran de MacOSSection : l'intercalaire « Selected works » dans un écran à cadre noir
│   │       │   └── MacOS/               faux macOS de l'écran (1512 × 982) : bureau Giant Sur affiché directement (pas d'écran de démarrage), fond et barre de menus du 1er macOS
│   │       │       ├── Desktop.tsx          bureau Giant Sur : icônes, fenêtres, barre de menus, Dock ; pilote les menus
│   │       │       ├── MenuBar*.tsx, useMinuteClock.ts   barre de menus du 1er macOS (logo Apple, menus de data/giantSur.ts)
│   │       │       ├── Wallpaper.tsx        fond d'écran (assets/photo-1511300636408-a63a89df3482.avif, Unsplash)
│   │       │       ├── Dock*.tsx                interface Giant Sur à l'identique
│   │       │       ├── DesktopIcons.tsx, DesktopItem.tsx   icônes du bureau tirées du dossier Bureau du Finder (Projets, Skills, Certifications, CV.pdf)
│   │       │       ├── MacReposProvider.tsx  repos GitHub du dossier Projets (useMacRepos) : liste au démarrage du bureau, arbre d'un repo à sa 1re ouverture
│   │       │       ├── RepoContextMenu.tsx   clic droit sur un dossier de repo : Ouvrir avec VS Code, Voir dans le navigateur, Voir sur GitHub (mention Privé)
│   │       │       ├── VSCode/              app VS Code (Dark Modern) : titre, barre d'activité, explorateur, onglets, éditeur coloré (highlight.js), barre d'état
│   │       │       ├── Window.tsx           cadre commun de toutes les fenêtres, copié du Safari de mihrimatrix/macos-clone-react : rayon 26 px, barre d'outils 52 px, pastilles 13 px à 21/21 px
│   │       │       ├── frameClasses.ts      classes du cadre partagées (outil en capsule de verre, champ de recherche, barre d'outils)
│   │       │       ├── useGenie.ts, dockTarget.ts   effet génie (fenêtre copiée en bandes trapézoïdales aspirées dans l'icône du Dock)
│   │       │       ├── ControlCenter*.tsx   centre de contrôle : bascules, luminosité (voile noir), son (volume du lecteur partagé), mode sombre ([data-macos-theme] dans tokens.css)
│   │       │       ├── FinderWindow.tsx     Window + palette claire du Finder pour l'intérieur des apps ; intérieurs de Calendrier et Photos copiés de frvky.online
│   │       │       ├── Browser/, Notes/     Safari (contour de mihrimatrix, intérieur Google) et Notes (copie de mihrimatrix, notes d'Ikhlas)
│   │       │       ├── DockLink.tsx, dockLinkLogos.ts   liens GitHub et LinkedIn après le séparateur du Dock
│   │       │       ├── AppleLogo.tsx, IAEmblem.tsx, TrafficLights.tsx, FileIcon.tsx, AboutThisMac.tsx, useMacFiles.ts
│   │       │       ├── Music/               app Musique : « Batman » de Bedry joué sur le lecteur partagé (progression, durée réelle), autres pistes en aperçu indisponible
│   │       │       └── Browser/ Calendar/ Finder/ Mail/ Messages/ Music/ Notes/ Photos/ Preview/ Settings/ Terminal/ VSCode/   une app par dossier
│   │       ├── Projects/ Project/ About/ Contact/   coquilles vides
│   │       └── NotFound/     404
│   ├── lib/
│   │   ├── api/contact.ts    envoi du formulaire de contact (FormSubmit)
│   │   ├── api/repos.ts      lecture de public/repos/ (index et instantané d'un repo), une requête par fichier et par session
│   │   ├── highlightCode.ts  coloration highlight.js : cœur et grammaires importés à la demande
│   │   ├── LenisProvider.tsx smooth scroll Lenis branché sur gsap.ticker + ScrollTrigger
│   │   ├── LocaleProvider.tsx locale en | fr partagée (useLocale), met à jour <html lang>
│   │   ├── MusicProvider.tsx un seul Audio pour tout le site (useMusic) : musique de fond au 1er geste après le loader + app Musique du Mac
│   │   ├── musicSession.ts   musique coupée ou non et volume, gardés pour la session (sessionStorage)
│   │   ├── localeStorage.ts  choix de langue gardé dans localStorage
│   │   ├── notesStore.ts     contrat NotesStore + localNotesStore (localStorage), à doubler d'un lib/api/notes.ts
│   │   ├── loaderSession.ts  page révélée par le loader (déclenche l'entrée du nom)
│   │   ├── callRingSession.ts  sonnerie du CallWidget déjà coupée dans la session (sessionStorage)
│   │   ├── notesBookStorage.ts  changements de l'app Notes du faux macOS (localStorage)
│   │   ├── macDisplaySession.ts  luminosité et mode sombre du faux macOS, gardés pour la session (sessionStorage)
│   │   └── utils.ts          cn() de shadcn, ne pas déplacer
│   ├── data/                 tout le texte affiché, en versions en / fr : locale (type Locale, Localized<T>), site, routes, home, hero, about, projects, experience, services, roles, process, loader, notes
│   │   ├── cv.ts             CV d'Ikhlas : CV.pdf de l'Aperçu, fichiers des dossiers Skills et Certifications
│   │   ├── cursor.ts         libellés de la bulle du curseur contextuel, par valeur de data-cursor
│   │   ├── macos.ts          fichiers du Finder, textes des apps macOS (Terminal, Mail, Notes, Messages, Musique, Calendrier…)
│   │   ├── giantSur.ts       menus de la barre de menus et apps du Dock
│   │   ├── macbook.ts        libellés de la section macOS (aria-label, Allumer)
│   │   └── music.ts          aria-label du bouton son (Couper / Mettre la musique)
│   ├── logic/
│   │   ├── coinRain/         ordre de chute, keyframes et instant de révélation du loader
│   │   ├── experiencePeriod/ période d'une expérience écrite selon la langue
│   │   ├── cursorKind/       valeur de data-cursor vers type de bulle (view, scroll), inconnue = pas de bulle
│   │   ├── headerVisibility/ cacher ou non le header selon le sens du scroll
│   │   ├── initialLocale/    langue de départ : choix enregistré, sinon navigateur fr*, sinon en
│   │   ├── macos/            repoTree (arbre trié d'un repo), codeLanguage (langage et icône d'après l'extension), editorTabs, textPosition (Ln/Col),
│   │   │                     contextMenu (position du menu), buildFileTree (Projets = un dossier par repo), fileTree, projectSlug, windowManager, windowBounds, browserSession, browserAddress, browserTabs, browserBookmarks,
│   │   │                     navigationHistory, terminal, calendar (Calendrier : grille, horaires, rendez-vous), clock (horloge de la barre de menus),
│   │   │                     finderItems (tri, recherche), finderLocation, fileSize, recents (Finder), notesBook (Notes), photoAlbums (Photos),
│   │   │                     genie (bandes de l'effet génie), brightness (voile de luminosité)
│   │   ├── giantSur/         largeurs du Dock, rebond des icônes au lancement (dockBounce)
│   │   ├── music/            trackTime (3:07, --:-- si inconnu), trackProgress (part écoulée), autoStart (démarrage au 1er geste)
│   │   ├── screenDock/       échelle et descente de WorksScreen selon l'avancée du scroll, écart entre 2 centres
│   │   ├── scrollCapture/    une fenêtre macOS peut-elle encore défiler (sinon la page défile)
│   │   ├── booking/          bookableDay (jours ouvrés à venir), bookingMail (mailto du footer)
│   │   ├── notes/            draft (100 caractères max, nom facultatif), page (« See more »), textSize, sway (balancement stable par note)
│   │   ├── padIndex/         1 vers « 01 » (compteur de planches)
│   │   └── unsplashPhotoUrl/ URL Unsplash recadrée à une largeur
│   ├── types/                contrat d'API avec portfolio-backend : note.ts (PinnedNote, NoteColor) ; repo.ts : format de public/repos/ (écrit par tools/repos)
│   └── assets/               pièces du loader (coin-{flat,solid}.svg), apple-logo.svg, icônes Sequoia du Finder (finder-*.svg) et fond d'écran (.avif) du faux macOS, background-music.m4a (musique de fond)
├── components.json           config shadcn (base-nova, Base UI, lucide)
├── vite.config.ts            react + tailwindcss + tsconfigPaths, port 3000, outDir build
├── tsconfig*.json            TypeScript 6 strict, alias @/ vers src/
└── vercel.json               rewrites SPA, build via pnpm
```

## Stack

```
Build        Vite 6 · TypeScript 6 · pnpm
UI           React 19 · react-router-dom 7 · react-helmet-async
Styling      CSS par section (sections existantes) · Tailwind v4 + shadcn/ui Base UI (tout nouveau code)
Animations   gsap 3 + @gsap/react (useGSAP) · framer-motion 12 · Lenis
Tests        Vitest (pnpm test)
Icônes       lucide-react · logos de marque tech via react-icons/si (logos, pas icônes)
Code         highlight.js (cœur + grammaires en import dynamique) pour l'app VS Code du faux macOS
Déploiement  Vercel
```

`pnpm dev` ouvre http://localhost:3000/. `pnpm build` lance `tsc -b` puis le build dans `build/`.

## Idéologie

- **Le découpage suit les couches** (`components`, `logic`, `lib`, `data`, `types`), pas les écrans. Détail dans `rules/architecture-frontend.md`.
- **Le texte affiché vit dans `data/`**, pas en tête de composant. Les timings et réglages d'animation restent dans le composant qui les utilise.
- **Un composant par fichier.** Un sous-composant nommé sort dans son propre fichier, dans le dossier de son écran.
- **Imports internes toujours en `@/`.**
- **Sections existantes** : elles gardent leur `.css` BEM appairé (`.about__call-pill`, `.bd-board`). On ne les migre pas en Tailwind.
- **Nouveau code** : Tailwind pour la mise en page, shadcn pour les composants d'interface, valeurs tirées de `tokens.css` (les tokens surchargent le thème Tailwind : `bg-black`, `text-sm`, `font-sans` donnent les valeurs du portfolio).

## Identité visuelle

Source unique : `src/tokens.css`.

```
Encre   --color-black #0A0A0A    Crème  --color-white #F5F2EE
Notes   --color-note-{pink,yellow,orange,green,blue} (+ -ink), réservés aux notes de PinNote
Accent  --color-accent #E8530A   Alt    --color-accent-alt #00E5A0
Display --font-display Plus Jakarta Sans 400 (nom du hero, titres de section : Experiences, services…), comme haufsess.com
Body    --font-body Inter 500 (tout le reste)
```

2 familles, celles de haufsess.com : Plus Jakarta Sans pour les titres, Inter pour le texte. Un titre de section fait 28 / 36 / 40 px (paliers 810 et 1200), comme Experiences. Espace entre 2 sections : `--section-gap` (48 px, comme la réf.), en padding-top de chaque section. Couleurs : noir et crème du loader partout, via les tokens (jamais de hex en dur dans un composant) ; l'orange reste un accent ponctuel.

Langue du site : anglais et français, via le sélecteur du header. Tout texte affiché (data/, alt, aria-label) existe dans les 2 langues : chaque export de `data/` est un `Localized<T>` (`{ en, fr }`), lu dans un composant par `useLocale()` puis `DATA[locale]`. L'anglais fait référence ; `index.html` reste en anglais. Pièces du loader (IKHLAS / AGBETI / métiers) et noms propres identiques dans les 2 langues.

Polices chargées par `@import` Google Fonts en tête de `index.css`. Une nouvelle famille va dans l'@import ET dans `tokens.css`.

## Règles de reproduction (IP)

```
1. Structure, mécanique, layout, espacement, timing : libres
2. Copie textuelle, images, polices sous licence, logo, identité de marque : jamais reproduits
3. Contenu : toujours le parcours d'Ikhlas, jamais la tagline ni les noms de la référence
4. Polices propriétaires : pile de repli libre (Google Fonts)
5. Images : Unsplash licence libre ou dégradés, tant qu'Ikhlas ne fournit pas d'asset
6. Logos tech : usage nominatif OK, jamais de logo client
Exception      Faux macOS (components/pages/Home/MacOS/) : logo Apple, apparence macOS et images Giant Sur autorisés à cet endroit, décision de l'utilisateur
```

Calibrage visuel : capture Brave headless (`--force-prefers-reduced-motion`) par bandes de ~2400 px via CDP, live et local côte à côte, section par section.

## État du chantier

```
Fait           Hero + HomeHeader · Projects · About · Experience · DedicatedTeam · Services · PinNote · CallSection · CoinLoader · Footer
               ContextCursor · PageTransition · Lenis
               Faux macOS : dossier Projets = repos GitHub (pnpm repos:snapshot), clic droit, app VS Code
Écrit, pas monté   Process
À faire        Menu (3 barres verticales) entre DedicatedTeam et Services
               Footer, puis CTA de fin (réf. momdesign.fr)
               Pages /projects, /projects/:slug, /about, /contact
               Boutons de test de connexion au backend (ticket setup, RM4)
               PinNote : partager les notes entre visiteurs via portfolio-backend (NotesStore prêt, API à écrire)
Dette          Process : copie encore calquée sur la référence (verteal), à réécrire avec le parcours d'Ikhlas
               Bundle JS de 650 Ko, pas de découpage par route
```
