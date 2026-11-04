# Icônes : toujours `lucide-react`

Toute icône affichée dans l'interface vient du paquet `lucide-react`, sans exception. C'est la bibliothèque d'icônes déclarée dans `components.json` (`"iconLibrary": "lucide"`) et celle qu'utilisent les composants générés par shadcn/ui.

## Interdit

- Écrire un `<svg>` à la main dans un composant, même court, même « juste pour un chevron ».
- Utiliser un emoji ou un caractère pictographique comme icône (✅, ❌, ⚠️, →, ★…), que ce soit dans du JSX, un libellé de bouton ou le texte d'un toast.
- Ajouter une autre bibliothèque d'icônes (`react-icons`, `heroicons`, `@tabler/icons`, Font Awesome, une police d'icônes…).
- Importer un fichier `.svg` comme composant ou comme image pour servir d'icône.

## À faire

Importer l'icône depuis `lucide-react` et la styler avec les classes Tailwind du projet :

```tsx
import { CircleCheckIcon } from 'lucide-react'

<CircleCheckIcon className="size-4 text-emerald-600" />
```

Si l'icône voulue n'existe pas dans Lucide, ne pas la dessiner à la main : le dire et demander quoi faire (choisir l'icône Lucide la plus proche, ou décider ensemble d'une exception).

## Pourquoi

Une seule source d'icônes garde un rendu homogène (même grille, même épaisseur de trait, même façon de dimensionner avec `size-*`), évite de multiplier les dépendances qui font le même travail, et rend une icône remplaçable en changeant un import. Un emoji, lui, s'affiche différemment selon le système d'exploitation et ne se colore pas.

## Périmètre logo

Cette rule vise les **icônes** d'interface. Un logo ou une illustration n'est pas une icône : ces cas se discutent au moment où ils se présentent.

Cas déjà tranchés :

- **Logos de technos** (React, Docker, PostgreSQL…) dans `components/pages/Home/techIcons.ts` : `react-icons/si`, Lucide n'a pas de logos de marque.
- **Ellipse tracée à la main** de `Interlude.tsx` : illustration animée trait par trait (DrawSVG), le `<path>` reste inline car GSAP l'anime directement.
- **Logo Apple du faux macOS** (`MacOS/`) : fichier `src/assets/apple-logo.svg`, décision de l'utilisateur. Affiché par `AppleLogo.tsx` (masque CSS) dans la barre de menus et dans « À propos de ce Mac ».
- **Images du clone Giant Sur** (`public/giantsur/images/`) : icônes du Dock, reprises telles quelles, décision de l'utilisateur.
- **Icônes de fichiers du Finder et du bureau** (`MacOS/FileIcon.tsx`) : dossier et documents style Sequoia dessinés pour le projet, un SVG par fichier dans `src/assets/finder-*.svg`, affichés en `<img>`, décision de l'utilisateur. Les apps du dossier Applications reprennent les images du Dock Giant Sur.
- **Nom du hero et du footer** (`Home/NameMark.tsx`) : un `<svg>` avec un paragraphe dans un `<foreignObject>`, mis à l'échelle de la largeur comme la réf. C'est du texte, pas une icône, il reste inline.
- **Filtre d'encre** (`Home/Services.tsx`) : `<svg>` invisible qui ne contient que des `<filter>` (`feTurbulence`), utilisés en CSS par la section. Rien n'est affiché, il reste inline.
- **Logo LinkedIn du footer** (`Home/Footer.tsx`) : `react-icons/fa6` (`FaLinkedin`), comme le lien LinkedIn du footer de la réf. haufsess.com, Lucide n'a pas de logos de marque.
- **Logos GitHub et LinkedIn des liens du Dock** du faux macOS (`MacOS/dockLinkLogos.ts`) : `react-icons/si` pour GitHub, `react-icons/fa6` pour LinkedIn (absent de `si`), décision de l'utilisateur.
