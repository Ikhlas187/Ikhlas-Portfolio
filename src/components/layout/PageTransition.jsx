import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.4, ease: [0.65, 0, 0.35, 1] } },
};

export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Overlay noir de transition */}
        <motion.div
          initial={{ scaleY: 0 }}
          exit={{
            scaleY: [0, 1, 1, 0],
            transition: { duration: 0.8, times: [0, 0.4, 0.6, 1], ease: 'easeInOut' },
          }}
          style={{
            position: 'fixed', inset: 0,
            background: 'var(--color-black)',
            zIndex: 200,
            transformOrigin: 'bottom',
            pointerEvents: 'none',
          }}
        />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
