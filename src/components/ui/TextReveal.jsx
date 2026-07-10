import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * TextReveal — anime le texte au scroll
 * type: 'chars' | 'words' | 'lines'
 *
 * <TextReveal as="h1" type="chars" delay={0.2}>IKHLAS OLAMIDÉ</TextReveal>
 */
export default function TextReveal({
  children,
  as: Tag = 'div',
  type = 'lines',
  delay = 0,
  duration = 0.8,
  stagger = 0.04,
  trigger = true,
  className = '',
  style = {},
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const text = el.textContent;
    let units = [];

    if (type === 'chars') {
      el.innerHTML = text.split('').map((char) =>
        char === ' '
          ? '<span class="tr-char" style="display:inline-block;white-space:pre"> </span>'
          : `<span class="tr-char" style="display:inline-block;overflow:hidden"><span style="display:inline-block">${char}</span></span>`
      ).join('');
      units = el.querySelectorAll('.tr-char > span');
    } else if (type === 'words') {
      el.innerHTML = text.split(' ').map((word) =>
        `<span class="tr-word" style="display:inline-block;overflow:hidden"><span style="display:inline-block">${word}</span></span>`
      ).join(' ');
      units = el.querySelectorAll('.tr-word > span');
    } else {
      el.innerHTML = text.split('\n').map((line) =>
        `<span class="tr-line" style="display:block;overflow:hidden"><span style="display:block">${line}</span></span>`
      ).join('');
      units = el.querySelectorAll('.tr-line > span');
    }

    const tl = gsap.timeline({ paused: trigger, delay });
    tl.fromTo(units,
      { y: '110%', opacity: type === 'lines' ? 1 : 0 },
      { y: '0%', opacity: 1, duration, stagger, ease: 'power4.out' }
    );

    if (trigger) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => tl.play(),
        once: true,
      });
    } else {
      tl.play();
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [children, type, delay, duration, stagger, trigger]);

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
