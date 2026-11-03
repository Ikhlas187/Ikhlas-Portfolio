import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';

export const FPS = 12; // animation « sur deux », comme l'anime traditionnel
export const DURATION = 144; // 12 s, 3 plans de 4 s
const CROSS = 12; // 1 s de fondu enchaine

const SHOTS = [
  { src: 'plate-desk.jpg', zoom: 0.10, panX: -1.7, panY: 0.9 },
  { src: 'plate-laptop.jpg', zoom: 0.09, panX: 1.5, panY: -1.0 },
  { src: 'plate-face.jpg', zoom: 0.12, panX: -0.9, panY: 1.3 },
];

/* Echelle de depart. Doit rester au-dessus du deplacement maximal, sinon un
   bord de la planche entrerait dans le cadre pendant le panoramique. */
const BASE = 1.08;

const frac = (x) => x - Math.floor(x);

/* Progression periodique 0 -> 1 -> 0 sur une periode, sans rupture de pente.
   Garantit que l'image DURATION est identique a l'image 0. */
const wave = (p) => (1 - Math.cos(2 * Math.PI * p)) / 2;

/* Opacite du plan i. Le plan 0 se rallume en fin de boucle, ce qui referme le
   cycle exactement sur son etat de depart. */
const alpha = (i, t, n) => {
  const L = DURATION / n;
  let d = t - i * L;
  if (d >= DURATION - CROSS) d -= DURATION;
  if (d < -CROSS) return 0;
  if (d < 0) return (d + CROSS) / CROSS;
  if (d < L - CROSS) return 1;
  if (d < L) return (L - d) / CROSS;
  return 0;
};

export const MangaLoop = ({ invert = true }) => {
  const frame = useCurrentFrame();
  const n = SHOTS.length;

  return (
    <AbsoluteFill style={{ backgroundColor: invert ? '#000000' : '#FFFFFF' }}>
      {SHOTS.map((shot, i) => {
        /* Chaque plan avance pendant sa propre fenetre de visibilite. */
        const m = wave(frac(frame / DURATION - i / n));
        const scale = BASE + shot.zoom * m;
        const tx = shot.panX * m;
        const ty = shot.panY * m;

        return (
          <AbsoluteFill key={shot.src} style={{ opacity: alpha(i, frame, n) }}>
            <Img
              src={staticFile(shot.src)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${scale}) translate(${tx}%, ${ty}%)`,
                filter: invert
                  ? 'invert(1) brightness(0.86) contrast(1.05)'
                  : 'contrast(1.05)',
              }}
            />
          </AbsoluteFill>
        );
      })}

      {/* Vignettage : ramene les bords vers le noir pour que le texte du footer
          garde du contraste par-dessus. */}
      <AbsoluteFill
        style={{
          background: invert
            ? 'radial-gradient(120% 130% at 50% 42%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.42) 62%, rgba(0,0,0,0.82) 100%)'
            : 'radial-gradient(120% 130% at 50% 42%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.10) 70%, rgba(0,0,0,0.30) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
