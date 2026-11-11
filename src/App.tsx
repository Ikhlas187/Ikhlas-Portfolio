import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import LenisProvider from '@/lib/LenisProvider'
import LocaleProvider from '@/lib/LocaleProvider'
import MusicProvider from '@/lib/MusicProvider'
import PageTransition from '@/components/ui/PageTransition'
import CoinLoader from '@/components/ui/CoinLoader'
import MusicToggle from '@/components/ui/MusicToggle'
import HomePage from '@/components/pages/Home/HomePage'
import { ROUTES } from '@/data/routes'

// Hors accueil, chaque page est un fichier JS à part, chargé à la 1re visite.
const ProjectsPage = lazy(() => import('@/components/pages/Projects/ProjectsPage'))
const ProjectPage = lazy(() => import('@/components/pages/Project/ProjectPage'))
const CertificationsPage = lazy(() => import('@/components/pages/Certifications/CertificationsPage'))
const BookingPage = lazy(() => import('@/components/pages/Booking/BookingPage'))
const AboutPage = lazy(() => import('@/components/pages/About/AboutPage'))
const ContactPage = lazy(() => import('@/components/pages/Contact/ContactPage'))
const NotFoundPage = lazy(() => import('@/components/pages/NotFound/NotFoundPage'))

const PAGES: { path: string; page: ReactNode }[] = [
  { path: ROUTES.HOME, page: <HomePage /> },
  { path: ROUTES.PROJECTS, page: <ProjectsPage /> },
  { path: ROUTES.PROJECT, page: <ProjectPage /> },
  { path: ROUTES.CERTIFICATIONS, page: <CertificationsPage /> },
  { path: ROUTES.BOOKING, page: <BookingPage /> },
  { path: ROUTES.ABOUT, page: <AboutPage /> },
  { path: ROUTES.CONTACT, page: <ContactPage /> },
  { path: '*', page: <NotFoundPage /> },
]

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {PAGES.map(({ path, page }) => (
          <Route
            key={path}
            path={path}
            element={
              <PageTransition>
                <Suspense fallback={null}>{page}</Suspense>
              </PageTransition>
            }
          />
        ))}
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <LocaleProvider>
      <MusicProvider>
        <BrowserRouter>
          <LenisProvider>
            <AnimatedRoutes />
            <MusicToggle />
            <CoinLoader />
          </LenisProvider>
        </BrowserRouter>
      </MusicProvider>
    </LocaleProvider>
  )
}
