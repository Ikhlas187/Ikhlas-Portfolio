import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import Draggable from 'gsap/Draggable';
import { TECH } from './techIcons';
import './DedicatedTeam.css';

gsap.registerPlugin(Draggable);

/* Rôles d'Ikhlas Agbeti (Software Engineer) + stacks tirées du CV. */
const ROLES = [
  { name: 'Frontend Developer',   color: '#3B82F6', rot: 2,  stack: ['React', 'TypeScript', 'Tailwind', 'Vite', 'Framer Motion'] },
  { name: 'Backend Developer',    color: '#06D6A0', rot: -1, stack: ['Node', 'Express', 'Django', 'PHP', 'REST API'] },
  { name: 'Full-Stack Developer', color: '#8338EC', rot: 1,  stack: ['React', 'Express', 'PostgreSQL', 'Laravel', 'MySQL'] },
  { name: 'Automation Engineer',  color: '#FF7B00', rot: -3, stack: ['Make', 'n8n', 'Webhooks', 'HTTP modules'] },
  { name: 'AI Agent Developer',   color: '#FB6F92', rot: 2,  stack: ['Relevance AI', 'Gemini', 'Claude', 'Make'] },
  { name: 'DevOps Engineer',      color: '#EF233C', rot: 1,  stack: ['Docker', 'GitHub Actions', 'Vercel', 'Linux / Ubuntu'] },
  { name: 'Database Developer',   color: '#FFB703', rot: 0,  stack: ['PostgreSQL', 'MySQL', 'SQLite', 'Supabase'] },
  { name: 'WordPress Developer',  color: '#FF4D6D', rot: 1,  stack: ['WordPress', 'Next.js', 'PHP'] },
];

const N = ROLES.length;
const STEP_ANGLE = 360 / N;   // écart angulaire entre deux pastilles
const TOP_ANGLE = 270;        // sommet de l'ellipse (sin = -1)
const LIGHT_MS = 650;         // durée d'allumage par logo
const HOLD_MS = 600;          // pause après le dernier logo
const ROTATE_S = 7.5;         // durée de rotation par cran
const START_DELAY = 1300;     // laisse jouer l'entrée avant de démarrer

export default function DedicatedTeam() {
  const root = useRef(null);
  const ctrl = useRef(null);
  const [openRole, setOpenRole] = useState(null);
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });
  const [activeIdx, setActiveIdx] = useState(0);
  const [manual, setManual] = useState(false);

  const closeCard = () => ctrl.current?.close();

  // Échap ferme le tooltip manuel
  useEffect(() => {
    if (!manual) return;
    const onKey = (e) => e.key === 'Escape' && closeCard();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [manual]);

  useEffect(() => {
    const stage = root.current.querySelector('.vt-team__stage');
    const slots = gsap.utils.toArray('.vt-slot', root.current);

    // Rayons de l'ellipse : grand à l'horizontale, petit à la verticale
    let rx = 0;
    let ry = 0;
    const measure = () => {
      const r = stage.getBoundingClientRect();
      rx = Math.min(r.width * 0.4, 470);
      ry = Math.min(r.height * 0.27, 205);
    };
    const place = (deg) => {
      for (let i = 0; i < N; i++) {
        const a = ((deg + STEP_ANGLE * i) * Math.PI) / 180;
        gsap.set(slots[i], { x: Math.cos(a) * rx, y: Math.sin(a) * ry });
      }
    };

    measure();
    let drift = { a: TOP_ANGLE }; // pastille 0 au sommet
    place(drift.a);
    window.addEventListener('resize', measure);

    let autoOn = true;
    let top = 0;              // index de la pastille au sommet
    let timers = [];
    let rotTween = null;
    const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

    // Ancre le tooltip au-dessus d'une pastille + lance l'allumage des logos
    const showStack = (index) => {
      const pill = slots[index].querySelector('.vt-pill');
      const r = pill.getBoundingClientRect();
      setAnchor({ x: r.left + r.width / 2, y: r.top });
      setActiveIdx(0);
      setOpenRole(ROLES[index]);
      const n = ROLES[index].stack.length;
      for (let k = 0; k < n; k++) {
        timers.push(setTimeout(() => setActiveIdx(k), k * LIGHT_MS));
      }
      return n * LIGHT_MS + HOLD_MS;
    };

    // Boucle auto : montre la pastille du sommet, puis tourne vers la suivante
    const runAuto = () => {
      if (!autoOn) return;
      const dur = showStack(top);
      timers.push(setTimeout(() => {
        setOpenRole(null);
        top = (top - 1 + N) % N;
        rotTween = gsap.to(drift, {
          a: drift.a + STEP_ANGLE, // sens horaire (comme l'orbite d'origine)
          duration: ROTATE_S,
          ease: 'power2.inOut',
          onUpdate: () => place(drift.a),
          onComplete: runAuto,
        });
      }, dur));
    };

    ctrl.current = {
      // clic sur une pastille : ouvre son tooltip, met l'auto en pause
      manualOpen(index) {
        autoOn = false;
        clearTimers();
        rotTween?.kill();
        setManual(true);
        showStack(index);
      },
      close() {
        clearTimers();
        setManual(false);
        setOpenRole(null);
        if (!autoOn) { autoOn = true; runAuto(); }
      },
      pause() {
        autoOn = false;
        clearTimers();
        rotTween?.kill();
      },
      resume() {
        if (!autoOn) { autoOn = true; runAuto(); }
      },
    };

    const ctx = gsap.context(() => {
      // Entrée : chute + rebond en cascade
      gsap.from('.vt-enter', {
        opacity: 0,
        scale: 0.5,
        y: -120,
        duration: 1.1,
        ease: 'elastic.out(1, 0.6)',
        stagger: { each: 0.08, from: 'random' },
      });

      // Flottement continu
      gsap.utils.toArray('.vt-float').forEach((el, i) => {
        gsap.to(el, {
          y: gsap.utils.random(-8, -14),
          duration: gsap.utils.random(2.2, 3.4),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.15,
        });
      });

      // Drag & drop : pause l'auto, snap-back + reprise
      Draggable.create('.vt-drag', {
        type: 'x,y',
        onPress() {
          ctrl.current.pause();
          setManual(false);
          setOpenRole(null);
          gsap.set(this.target.closest('.vt-slot'), { zIndex: 30 });
          gsap.to(this.target, { scale: 1.08, duration: 0.2 });
        },
        onClick() {
          const idx = slots.indexOf(this.target.closest('.vt-slot'));
          if (idx >= 0) ctrl.current.manualOpen(idx);
        },
        onRelease() {
          gsap.to(this.target, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
        },
        onDragEnd() {
          const slot = this.target.closest('.vt-slot');
          gsap.to(this.target, {
            x: 0, y: 0, duration: 1, ease: 'power3.inOut',
            onComplete: () => { slot.style.zIndex = ''; },
          });
          ctrl.current.resume();
        },
      });
    }, root);

    const startTimer = setTimeout(runAuto, START_DELAY);

    return () => {
      clearTimeout(startTimer);
      clearTimers();
      rotTween?.kill();
      window.removeEventListener('resize', measure);
      ctx.revert();
    };
  }, []);

  return (
    <section className="vt-team" ref={root}>
      <div className="vt-team__stage">
        <h2 className="vt-team__title">
          Skills
        </h2>

        <div className="vt-orbit">
          {ROLES.map((r) => (
            <div key={r.name} className="vt-slot">
              <div className="vt-drag" data-role={r.name}>
                <div className="vt-enter">
                  <div className="vt-float">
                    <span
                      className="vt-pill"
                      style={{ backgroundColor: r.color, rotate: `${r.rot}deg` }}
                    >
                      {r.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {openRole && (
        <>
          {manual && <div className="vt-cardback" onClick={closeCard} />}
          <div
            className="vt-tip"
            style={{ left: anchor.x, top: anchor.y, '--accent': openRole.color }}
          >
            <div className="vt-card__stack">
              {openRole.stack.map((t, idx) => {
                const item = TECH[t];
                const Icon = item?.Icon;
                return (
                  <div
                    className={`vt-tech${idx === activeIdx ? ' is-active' : ''}`}
                    key={t}
                    style={{ '--tc': item?.color || '#B8BEC8' }}
                  >
                    {Icon && <Icon className="vt-tech__ico" />}
                    <span className="vt-tech__tip">{t}</span>
                  </div>
                );
              })}
            </div>
            <span className="vt-tip__caret" />
          </div>
        </>
      )}
    </section>
  );
}
