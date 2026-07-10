import ScheduleButton from '../components/sections/ScheduleButton';
import DedicatedTeam from '../components/sections/DedicatedTeam';
import Projects from '../components/sections/Projects';
import About from '../components/sections/About';

export function HomePage() {
  return (
    <main style={{ backgroundColor: '#000000' }}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2.5rem 1.5rem' }}>
        <ScheduleButton />
      </div>
      <Projects />
      <About />
      <DedicatedTeam />
    </main>
  );
}

export function ProjectsPage() {
  return (
    <main>
      <section id="projects-grid" style={{ minHeight: '100vh', paddingTop: '8rem' }} />
    </main>
  );
}

export function ProjectPage() {
  return (
    <main>
      <section id="project-detail" style={{ minHeight: '100vh' }} />
    </main>
  );
}

export function AboutPage() {
  return (
    <main>
      <section id="about" style={{ minHeight: '100vh', paddingTop: '8rem' }} />
    </main>
  );
}

export function ContactPage() {
  return (
    <main>
      <section id="contact" style={{ minHeight: '100vh', paddingTop: '8rem' }} />
    </main>
  );
}

export function NotFoundPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginBottom: '1rem' }}>
          404
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)' }}>
          Page introuvable
        </h1>
      </div>
    </main>
  );
}
