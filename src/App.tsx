import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AnimatePresence } from 'framer-motion'

import LenisProvider from '@/lib/LenisProvider'
import PageTransition from '@/components/ui/PageTransition'
import MouseTrail from '@/components/ui/MouseTrail'
import HomePage from '@/components/pages/Home/HomePage'
import ProjectsPage from '@/components/pages/Projects/ProjectsPage'
import ProjectPage from '@/components/pages/Project/ProjectPage'
import AboutPage from '@/components/pages/About/AboutPage'
import ContactPage from '@/components/pages/Contact/ContactPage'
import NotFoundPage from '@/components/pages/NotFound/NotFoundPage'
import { ROUTES } from '@/data/routes'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path={ROUTES.HOME}
          element={
            <PageTransition>
              <HomePage />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.PROJECTS}
          element={
            <PageTransition>
              <ProjectsPage />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.PROJECT}
          element={
            <PageTransition>
              <ProjectPage />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.ABOUT}
          element={
            <PageTransition>
              <AboutPage />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.CONTACT}
          element={
            <PageTransition>
              <ContactPage />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFoundPage />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  )
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
  )
}
