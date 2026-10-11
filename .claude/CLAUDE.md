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
│   └── skills/               skills propres au repo (vide)
├── public/                   servi tel quel (polices display à déposer dans public/fonts/)
├── tools/                    hors app : manga.py, video/ (Remotion), sources/ (photos brutes, ignoré par git)
├── src/
│   ├── main.tsx              monte l'app et importe index.css. Rien d'autre.
│   ├── App.tsx               providers (Helmet, Router, Lenis) + MouseTrail + routes animées
│   ├── index.css             Tailwind + shadcn + reset (@layer base) + variables shadcn branchées sur les tokens
│   ├── tokens.css            toutes les CSS vars du portfolio (couleurs, typo, espacements, easings)
│   ├── components/
│   │   ├── ui/               générique, utilisé par toutes les routes
│   │   │   ├── button.tsx          shadcn (Base UI), kebab-case voulu
│   │   │   ├── PageTransition.tsx  fondu + volet noir entre routes
│   │   │   └── MouseTrail.tsx      traînée canvas « feutre », blend difference
│   │   └── pages/            un dossier par écran
│   │       ├── Home/         HomePage + ses morceaux, sections en .tsx + .css appairés
│   │       │   ├── MagneticButton.tsx   attraction curseur autour du CTA
│   │       │   ├── ScheduleButton       CTA pill (réf. verteal.com)
│   │       │   ├── Projects             pile de planches (réf. galerie Behance S. Baldeon)
│   │       │   ├── Interlude.tsx        intercalaire « Selected works » + ellipse dessinée
│   │       │   ├── ProjectBoard.tsx     une planche projet
│   │       │   ├── About                planche claire (réf. abhijitrout.in)
│   │       │   ├── CallWidget.tsx       widget « appel entrant » + formulaire de contact
│   │       │   ├── DedicatedTeam        roue elliptique de rôles + logos tech (Draggable)
│   │       │   ├── techIcons.ts         table techno vers { Icon, color }
│   │       │   ├── Services             4 rangées, révélation encre (réf. kaiseisadatoki-v4)
│   │       │   ├── Footer               plein écran, planches manga + nom géant (réf. juanmora.co)
│   │       │   └── Process              4 étapes, écrit mais PAS monté
│   │       ├── Projects/ Project/ About/ Contact/   coquilles vides
│   │       └── NotFound/     404
│   ├── lib/
│   │   ├── api/contact.ts    envoi du formulaire de contact (FormSubmit), seul code réseau du site
│   │   ├── LenisProvider.tsx smooth scroll Lenis branché sur gsap.ticker + ScrollTrigger
│   │   └── utils.ts          cn() de shadcn, ne pas déplacer
│   ├── data/                 tout le texte affiché : site, routes, home, about, projects, services, roles, process, footer
│   ├── logic/
│   │   ├── padIndex/         1 vers « 01 » (compteur de planches)
│   │   └── unsplashPhotoUrl/ URL Unsplash recadrée à une largeur
│   ├── types/                vide (contrat d'API avec portfolio-backend)
│   └── assets/               footer-plate-{desk,laptop,face}.webp, importés par Footer
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
Icônes       lucide-react · logos de marque tech via react-icons/si (logos, pas icônes)
Déploiement  Vercel
```

`pnpm dev` ouvre http://localhost:3000/. `pnpm build` lance `tsc -b` puis le build dans `build/`.

## Idéologie

- **Le découpage suit les couches** (`components`, `logic`, `lib`, `data`, `types`), pas les écrans. Détail dans `rules/architecture-frontend.md`.
- **Le texte affiché vit dans `data/`**, pas en tête de composant. Les timings et réglages d'animation restent dans le composant qui les utilise.
- **Un composant par fichier.** Un sous-composant nommé sort dans son propre fichier, dans le dossier de son écran.
- **Imports internes toujours en `@/`.**
- **Sections existantes** : elles gardent leur `.css` BEM appairé (`.about__call-pill`, `.bd-board`). On ne les migre pas en Tailwind.
- **Nouveau code** : Tailwind pour la mise en page, shadcn pour les composants d'interface, valeurs tirées de `tokens.css` (les tokens surchargent le thème Tailwind : `bg-black`, `text-sm`, `font-mono` donnent les valeurs du portfolio).

## Identité visuelle

Source unique : `src/tokens.css`.

```
Encre   --color-black #0A0A0A    Crème  --color-white #F5F2EE
Accent  --color-accent #E8530A   Alt    --color-accent-alt #00E5A0
Display --font-display Anton     Body   --font-body Poppins     Mono  --font-mono JetBrains Mono
```

Polices chargées par `@import` Google Fonts dans `index.css`. Une nouvelle famille va dans l'@import ET dans `tokens.css`.

## Règles de reproduction (IP)

```
1. Structure, mécanique, layout, espacement, timing : libres
2. Copie textuelle, images, polices sous licence, logo, identité de marque : jamais reproduits
3. Contenu : toujours le parcours d'Ikhlas, jamais la tagline ni les noms de la référence
4. Polices propriétaires : pile de repli libre (Google Fonts)
5. Images : Unsplash licence libre ou dégradés, tant qu'Ikhlas ne fournit pas d'asset
6. Logos tech : usage nominatif OK, jamais de logo client
```

Calibrage visuel : capture Brave headless (`--force-prefers-reduced-motion`) par bandes de ~2400 px via CDP, live et local côte à côte, section par section.

## État du chantier

```
Fait           ScheduleButton · Projects · About + CallWidget · DedicatedTeam · Services · Footer
               MouseTrail · MagneticButton · TextReveal · PageTransition · Lenis
Écrit, pas monté   Process
À faire        Menu (3 barres verticales) entre DedicatedTeam et Services
               CTA avant footer (réf. momdesign.fr)
               Pages /projects, /projects/:slug, /about, /contact
               Boutons de test de connexion au backend (ticket setup, RM4)
Dette          Polices display absentes : public/fonts/TheNightWatch.woff2 (Services),
               public/fonts/Goga-{Regular,Medium,SemiBold}.otf (Footer). @font-face déjà câblés.
               Process : copie encore calquée sur la référence (verteal), à réécrire avec le parcours d'Ikhlas
               DedicatedTeam : Draggable n'est créé qu'en reduced-motion (return anticipé du bloc de répulsion)
               Bundle JS de 650 Ko, pas de découpage par route
```
