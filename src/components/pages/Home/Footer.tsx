import plateDesk from '@/assets/footer-plate-desk.webp'
import plateLaptop from '@/assets/footer-plate-laptop.webp'
import plateFace from '@/assets/footer-plate-face.webp'
import { FOOTER } from '@/data/footer'
import { SITE } from '@/data/site'
import '@/components/pages/Home/Footer.css'

// Planches tirées des photos d'Ikhlas par tools/manga.py, animées en CSS : 1,17 Mo contre 6,5 Mo en mp4.
const PLATES = [plateDesk, plateLaptop, plateFace]

const LINKS = [
  { label: 'Email', href: `mailto:${SITE.email}`, isExternal: false },
  { label: 'LinkedIn', href: SITE.socials.linkedin, isExternal: true },
  { label: 'GitHub', href: SITE.socials.github, isExternal: true },
]

type FooterProps = {
  plates?: string[]
  video?: string | null
  poster?: string | null
}

/* Footer plein écran (réf. juanmora.co) : planches manga en fond, nom géant en bas. */
export default function Footer({ plates = PLATES, video = null, poster = null }: FooterProps) {
  return (
    <footer className="jmf">
      <div className="video-cont-footer" aria-hidden="true">
        {video ? (
          <video className="video-embed" src={video} poster={poster || undefined} muted autoPlay loop playsInline />
        ) : (
          plates.map((plate, i) => (
            <div key={plate} className={`jmf-plate jmf-plate--${i + 1}`} style={{ backgroundImage: `url(${plate})` }} />
          ))
        )}

        {/* Voile clair : sans lui, l'encre du nom géant se perd dans le papier blanc des planches. */}
        <div className="jmf-veil" />
      </div>

      <div className="main-wrapper-footer">
        <div className="wrapper-content-footer _1">
          <div className="wrapper-column">
            <p className="body-footer fade">{FOOTER.stackLabel}</p>
            <ul className="list-footer">
              {FOOTER.stack.map((item) => (
                <li className="wrapper-item-column" key={item}>
                  <span className="body-footer right">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="wrapper-column right">
            <p className="body-footer fade">{FOOTER.contactLabel}</p>
            <ul className="list-footer">
              {LINKS.map((link) => (
                <li className="wrapper-item-column" key={link.label}>
                  <a
                    className="footer-social-link"
                    href={link.href}
                    target={link.isExternal ? '_blank' : undefined}
                    rel={link.isExternal ? 'noopener noreferrer' : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="wrapper-content-footer _2">
          <p className="name-footer">{FOOTER.firstName}</p>
          <p className="name-footer right">{FOOTER.lastName}</p>
        </div>

        <div className="wrapper-content-footer">
          <p className="body-footer big">
            {FOOTER.roleLine} <span className="dim-role">{FOOTER.roleNote}</span>
          </p>
          <p className="body-footer big">
            {FOOTER.studioLine} <span className="dim-studio">{FOOTER.studioNote}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
