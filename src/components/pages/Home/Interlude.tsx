import { PROJECTS_SECTION } from '@/data/projects'

/* Intercalaire « Selected works » entouré d'une ellipse tracée à la main (réf. hand-writing-text de KokonutUI). */
export default function Interlude() {
  const [firstLine, secondLine] = PROJECTS_SECTION.interludeTitle

  return (
    <div className="bd-interlude">
      <div className="bd-interlude__frame">
        {/* Path inline : DrawSVG l'anime directement */}
        <svg viewBox="0 0 1200 600" className="bd-interlude__circle" aria-hidden="true">
          <path
            className="bd-interlude__path"
            d="M 950 90
               C 1250 300, 1050 480, 600 520
               C 250 520, 150 480, 150 300
               C 150 120, 350 80, 600 80
               C 850 80, 950 180, 950 180"
            fill="none"
            strokeWidth="12"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h2 className="bd-interlude__title">
          {firstLine}
          <br />
          {secondLine}
        </h2>
      </div>
    </div>
  )
}
