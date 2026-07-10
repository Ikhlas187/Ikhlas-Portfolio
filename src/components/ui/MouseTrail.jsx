import { useEffect, useRef } from 'react';

/**
 * MouseTrail — trace le parcours réel de la souris.
 *
 * La ligne suit exactement le déplacement du curseur (pas d'inertie).
 * Style « feutre » (réf. trait hand-written KokonutUI) :
 * - Trait épais à largeur constante, bouts et jointures arrondis.
 * - Tracé lissé par courbes quadratiques (plus d'angles entre segments).
 * - Seule la fin de vie s'estompe : le corps du trait reste plein.
 * - Blend "difference" : la ligne blanche s'inverse d'elle-même — claire sur
 *   le noir du site, sombre sur les planches crème. Toujours visible.
 */
export default function MouseTrail({
  lifetime = 1400,  // durée avant effacement complet d'un point (ms)
  width = 6,        // épaisseur constante du feutre (px)
  minDist = 4,      // distance min entre deux points enregistrés (px)
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Respect de prefers-reduced-motion : pas de traînée.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf;
    const points = []; // { x, y, t }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const last = points[points.length - 1];
      if (last) {
        const dx = x - last.x;
        const dy = y - last.y;
        if (dx * dx + dy * dy < minDist * minDist) return;
      }
      points.push({ x, y, t: performance.now() });
      if (points.length > 400) points.shift();
    };

    const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

    const draw = () => {
      const now = performance.now();

      // Purge des points expirés.
      while (points.length && now - points[0].t > lifetime) {
        points.shift();
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (points.length > 2) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        /* Un seul chemin continu lissé aux courbes quadratiques : largeur
           constante façon feutre, aucune jointure visible. La queue se
           rétracte d'elle-même à mesure que les points expirent. */
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length - 1; i++) {
          const to = mid(points[i], points[i + 1]);
          ctx.quadraticCurveTo(points[i].x, points[i].y, to.x, to.y);
        }
        const last = points[points.length - 1];
        ctx.lineTo(last.x, last.y);
        ctx.lineWidth = width;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, [lifetime, width, minDist]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9998,
        mixBlendMode: 'difference',
      }}
    />
  );
}
