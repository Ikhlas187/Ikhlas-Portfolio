import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';

import { LenisProvider }  from './context/LenisContext';
import PageTransition     from './components/layout/PageTransition';
import MouseTrail         from './components/ui/MouseTrail';

import {
  HomePage,
  ProjectsPage,
  ProjectPage,
  AboutPage,
  ContactPage,
  NotFoundPage,
} from './pages/index';

import { ROUTES } from './constants/index';
import './styles/global.css';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path={ROUTES.HOME}     element={<PageTransition><HomePage     /></PageTransition>} />
        <Route path={ROUTES.PROJECTS} element={<PageTransition><ProjectsPage /></PageTransition>} />
        <Route path={ROUTES.PROJECT}  element={<PageTransition><ProjectPage  /></PageTransition>} />
        <Route path={ROUTES.ABOUT}    element={<PageTransition><AboutPage    /></PageTransition>} />
        <Route path={ROUTES.CONTACT}  element={<PageTransition><ContactPage  /></PageTransition>} />
        <Route path="*"               element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <LenisProvider>
          <MouseTrail />
          <AnimatedRoutes />
        </LenisProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
