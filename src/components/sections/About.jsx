import { useState } from 'react';
import './About.css';

/*
  Section About — reproduction fidèle de abhijitrout.in/#about :
  planche claire, « Inside my little life » centré en haut, longue
  respiration, puis bloc éditorial poussé à gauche (label « About » +
  récit en corps de lecture ~17px), moitié droite laissée vide.
  Liens soulignés, citation en italique, aucune animation.

  Texte : même gabarit que la référence (4 paragraphes, liens, citation),
  réécrit avec le parcours réel d'Ikhlas — contenu à affiner ensuite.
*/

/* Widget « appel entrant » (réf. abhijitrout.in) : pastille sombre avec
   avatar, refuse (✕) / répond (📞). Le vert ouvre la prise de rendez-vous,
   le rouge raccroche (le widget se retire). */
function CallWidget() {
  const [declined, setDeclined] = useState(false);

  return (
    <div className={`about__call${declined ? ' about__call--off' : ''}`}>
      <span className="about__call-avatar" aria-hidden="true">IK</span>
      <span className="about__call-text">
        <span className="about__call-hey">Hey</span>
        <span className="about__call-name">I&rsquo;m Ikhlas</span>
      </span>
      <button
        type="button"
        className="about__call-btn about__call-btn--decline"
        aria-label="Refuser l'appel"
        onClick={() => setDeclined(true)}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M5 5l10 10M15 5L5 15" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </button>
      <a
        className="about__call-btn about__call-btn--accept"
        href="https://cal.com/verteal/15min"
        target="_blank"
        rel="noreferrer"
        aria-label="Répondre : réserver un appel"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4.5 5.5C4.5 4.4 5.4 3.5 6.5 3.5h1.6c.9 0 1.7.6 1.9 1.5l.6 2.2c.2.8-.1 1.6-.7 2.1l-.9.7c1 2 2.6 3.6 4.6 4.6l.7-.9c.5-.6 1.3-.9 2.1-.7l2.2.6c.9.2 1.5 1 1.5 1.9v1.6c0 1.1-.9 2-2 2C9.6 19.1 4.9 14.4 4.5 5.5Z"
            fill="#fff"
          />
        </svg>
      </a>
    </div>
  );
}

export default function About() {
  return (
    <section className="about" id="about">
      <p className="about__kicker">Inside my little life</p>

      <div className="about__row">
        <p className="about__label">About</p>

        <div className="about__body">
          <p>
            I first stumbled into code at 16, tinkering with HTML and small
            scripts between school assignments. Though I went on to study
            software engineering at IFRI, curiosity always had a quiet,
            persistent pull. I spent my evenings building side projects,
            chasing curiosity over convention.
          </p>
          <p>
            I then joined{' '}
            <a href="https://comprint.bj" target="_blank" rel="noreferrer">Comprint</a>{' '}
            as a developer, where I got to build across design and web —
            everything from user interfaces to a full Django application.
            Later I joined{' '}
            <a href="https://socialoop.eu" target="_blank" rel="noreferrer">Socialoop</a>{' '}
            as a junior developer, building automations and AI agents for a
            remote-first European team.
          </p>
          <p>
            Then automation changed how I work. With Make and n8n I started
            wiring CRM agents, LinkedIn publishing flows and personal
            assistants. Afterall, <em>&ldquo;You learn more by shipping than
            by planning.&rdquo;</em> Every project on this page comes from
            that habit. Now I&rsquo;m curious, pragmatic, and a little more
            patient.
          </p>
          <p>
            As I step further into work and life, I&rsquo;m not just asking
            what I want to build next, but how I want to build it — fast,
            readable, with character in every pixel.
          </p>
        </div>

        <CallWidget />
      </div>
    </section>
  );
}
