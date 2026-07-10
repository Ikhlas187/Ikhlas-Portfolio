import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion, useReducedMotion } from 'framer-motion';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/*
  Section projets — structure clonée de la galerie Behance de Sebastian Baldeon
  (gallery/220534229) : intercalaire → planches pleine largeur
  (colonne texte à gauche, mosaïque de visuels à droite), grain sur les aplats.

  Adaptations décidées avec l'utilisateur :
  - Recolorée dans la charte du site (encre #0A0A0A / crème #F5F2EE / orange
    #E8530A) — le périwinkle de la référence est banni par la charte web.
  - Pas de catégories : un seul intercalaire, les 5 planches alignées.
  - La zone visuelle reçoit de vraies photos (Unsplash, licence libre) choisies
    pour évoquer l'univers de chaque projet, + une tuile typographique à
    l'accent du projet, comme les tuiles logo de la référence.
*/

const photo = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const PROJECTS = [
  {
    name: 'NEVORA',
    eyebrow: 'Portfolio — E-commerce',
    description:
      "Boutique de mode inspirée des maisons de luxe : préchargeur d'images, scroll horizontal épinglé et fiches produit animées.",
    date: '2025',
    accent: '#FFB703',
    dark: '#4A3300',
    layout: 'a',
    photos: [
      { id: '1580478491436-fd6a937acc9e', alt: 'Éditorial mode — silhouette en mouvement' },
      { id: '1629511565591-a1d494ad6c58', alt: 'Portrait mode en studio' },
      { id: '1591892212776-a09de24dbe84', alt: 'Détail de vêtement haut de gamme' },
      { id: '1613915617430-8ab0fd7c6baf', alt: 'Accessoires de mode posés à plat' },
    ],
  },
  {
    name: 'DRIP',
    eyebrow: 'Portfolio — App mobile',
    description:
      "Application mobile de revente de sneakers Nike : accueil éditorial, catégories épinglées au scroll et parcours d'achat pensé mobile-first.",
    date: '2025',
    accent: '#06D6A0',
    dark: '#03352A',
    layout: 'b',
    photos: [
      { id: '1560769629-975ec94e6a86', alt: 'Sneaker rouge sur fond uni' },
      { id: '1552346154-21d32810aba3', alt: 'Paire de sneakers en l’air' },
      { id: '1600185365483-26d7a4cc7519', alt: 'Sneaker blanche de profil' },
      { id: '1595341888016-a392ef81b7de', alt: 'Collection de sneakers alignées' },
    ],
  },
  {
    name: 'MEDICASTOCK',
    eyebrow: 'Portfolio — App web',
    description:
      'Gestion de stock pharmaceutique : inventaire, alertes de péremption et tableaux de bord, avec des animations de navigation partagées.',
    date: '2025',
    accent: '#3B82F6',
    dark: '#0A2A5E',
    layout: 'a',
    photos: [
      { id: '1607619056574-7b8d3ee536b2', alt: 'Gélules colorées en gros plan' },
      { id: '1587854692152-cbe660dbde88', alt: 'Blisters de médicaments' },
      { id: '1576602976047-174e57a47881', alt: 'Comprimés sur fond coloré' },
      { id: '1562243061-204550d8a2c9', alt: 'Rayonnages d’une pharmacie' },
    ],
  },
  {
    name: 'ETUDOCS',
    eyebrow: 'Portfolio — Plateforme web',
    description:
      "Plateforme de gestion des actes administratifs étudiants : demandes en ligne, suivi de dossier et espace d'administration.",
    date: '2024',
    accent: '#0E7C86',
    dark: '#06343A',
    layout: 'b',
    photos: [
      { id: '1562654501-a0ccc0fc3fb1', alt: 'Documents administratifs sur un bureau' },
      { id: '1590012314607-cda9d9b699ae', alt: 'Bibliothèque universitaire' },
      { id: '1619418602850-35ad20aa1700', alt: 'Étudiant complétant un dossier' },
      { id: '1668092547528-62bdec358652', alt: 'Pile de dossiers classés' },
    ],
  },
  {
    name: 'COMUNIST',
    eyebrow: 'Portfolio — Plateforme web',
    description:
      "Recensement et valorisation des compétences locales d'une commune : annuaire des talents, profils et recherche par métier.",
    date: '2024',
    accent: '#FF7B00',
    dark: '#4A2400',
    layout: 'a',
    photos: [
      { id: '1597960194599-22929afc25b1', alt: 'Artisan au travail dans son atelier' },
      { id: '1426927308491-6380b6a9936f', alt: 'Mains d’un artisan sur l’établi' },
      { id: '1547609434-b732edfee020', alt: 'Outils d’atelier suspendus' },
      { id: '1611021061285-16c871740efa', alt: 'Céramiste façonnant une pièce' },
    ],
  },
];

/* Étoile 4 branches de la référence */
function Sparkle({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 0c1 6.5 4.5 10.5 12 12-7.5 1.5-11 5.5-12 12-1-6.5-4.5-10.5-12-12C7.5 10.5 11 6.5 12 0Z"
        fill={color}
      />
    </svg>
  );
}

/* Intercalaire unique (pas de catégories) : titre plein écran, entouré d'une
   ellipse tracée à la main qui se dessine à l'arrivée à l'écran
   (réf. hand-writing-text de KokonutUI, adaptée à la charte). */
function Interlude() {
  const reduceMotion = useReducedMotion();

  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2.5, ease: [0.43, 0.13, 0.23, 0.96] },
        opacity: { duration: 0.5 },
      },
    },
  };

  return (
    <div className="bd-interlude">
      <div className="bd-interlude__frame">
        <motion.svg
          viewBox="0 0 1200 600"
          className="bd-interlude__circle"
          initial={reduceMotion ? 'visible' : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          aria-hidden="true"
        >
          <motion.path
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
            variants={draw}
          />
        </motion.svg>
        <h2 className="bd-interlude__title">
          SELECTED
          <br />
          WORKS
        </h2>
      </div>
    </div>
  );
}

/* Planche projet : colonne texte (eyebrow / titre + description / date),
   mosaïque photos + tuile typographique à l'accent du projet.
   Deux gabarits (a/b) alternés pour retrouver le collage irrégulier
   de la référence. */
function Board({ project }) {
  return (
    <article
      className={`bd-board bd-board--${project.layout}`}
      style={{ '--accent': project.accent, '--accent-dark': project.dark }}
    >
      <div className="bd-board__info">
        <p className="bd-board__eyebrow">{project.eyebrow}</p>
        <div>
          <h3 className="bd-board__name">{project.name}</h3>
          <p className="bd-board__desc">{project.description}</p>
        </div>
        <p className="bd-board__date">Date: {project.date}</p>
      </div>

      <div className="bd-board__art">
        {project.photos.map((p, i) => (
          <figure className={`bd-photo bd-photo--${i + 1}`} key={p.id}>
            <img src={photo(p.id)} alt={p.alt} loading="lazy" />
          </figure>
        ))}
        <div className="bd-tile-name" aria-hidden="true">
          <span className="bd-tile-name__mark">
            {project.name.charAt(0)}
            <Sparkle size={14} />
          </span>
          <span className="bd-tile-name__label">{project.name}</span>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);

      /* Scroll horizontal épinglé (desktop, motion OK) : la bande de
         planches se déplace vers la droite au rythme du scroll vertical.
         Sous 900px ou en reduced-motion, flux vertical classique. */
      mm.add(
        { desktop: '(min-width: 900px)', motionOk: '(prefers-reduced-motion: no-preference)' },
        (ctx) => {
          if (!(ctx.conditions.desktop && ctx.conditions.motionOk)) return;

          const track = root.current.querySelector('.bd-track');
          const distance = () => track.scrollWidth - window.innerWidth;

          gsap.to(track, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: '.bd-horizontal',
              start: 'top top',
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });
        },
      );
    },
    { scope: root },
  );

  return (
    <section className="bd" ref={root}>
      <Interlude />
      <div className="bd-horizontal">
        <div className="bd-track">
          {PROJECTS.map((p) => (
            <Board key={p.name} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
