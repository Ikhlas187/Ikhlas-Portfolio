import type { ReactNode } from 'react'
import type { CvContent } from '@/data/cv'

type CvDocumentProps = { cv: CvContent }

const headingClass =
  'border-b border-(--macos-paper-line) pb-[3px] font-sans text-[8.5px] font-bold tracking-[0.14em] uppercase'

// Le CV d'Ikhlas mis en page comme une feuille A4 : colonne latérale (contact, compétences, certifications, langues) et colonne principale.
export default function CvDocument({ cv }: CvDocumentProps) {
  const { headings } = cv

  const section = (heading: string, children: ReactNode) => (
    <section className="flex flex-col gap-[6px]">
      <h2 className={headingClass}>{heading}</h2>
      {children}
    </section>
  )

  return (
    <article className="mx-auto flex aspect-[210/297] w-[600px] shrink-0 flex-col bg-(--macos-paper) px-[36px] py-[34px] text-(--macos-paper-ink) shadow-(--macos-shadow-window)">
      <header className="flex items-end justify-between gap-[24px] border-b-2 border-(--macos-paper-ink) pb-[12px]">
        <div>
          <h1 className="font-sans text-[26px] leading-none font-bold tracking-[-0.02em]">{cv.name}</h1>
          <p className="mt-[6px] text-[11px] font-medium text-(--color-accent)">{cv.headline}</p>
        </div>
        <ul className="flex flex-col items-end gap-[1px] text-[8.5px] leading-[1.45]">
          {cv.contacts.map((contact) => (
            <li key={contact.label}>{contact.value}</li>
          ))}
        </ul>
      </header>

      <div className="mt-[16px] grid flex-1 grid-cols-[168px_1fr] gap-[26px] text-[9px] leading-[1.5]">
        <aside className="flex flex-col gap-[14px]">
          {section(
            headings.skills,
            cv.skillGroups.map((group) => (
              <div key={group.id}>
                <p className="font-semibold">{group.name}</p>
                <p>{group.skills.join(', ')}</p>
              </div>
            )),
          )}
          {section(
            headings.certifications,
            <ul className="flex flex-col gap-[3px]">
              {cv.certifications.map((certification) => (
                <li key={certification.id}>
                  <span className="font-semibold">{certification.title}</span> · {certification.issuer}
                </li>
              ))}
            </ul>,
          )}
          {section(
            headings.languages,
            <ul>
              {cv.languages.map((language) => (
                <li key={language.name}>
                  <span className="font-semibold">{language.name}</span> · {language.level}
                </li>
              ))}
            </ul>,
          )}
          {section(headings.interests, <p>{cv.interests.join(', ')}</p>)}
        </aside>

        <div className="flex flex-col gap-[14px]">
          {section(headings.profile, <p className="text-pretty">{cv.profile}</p>)}
          {section(
            headings.experience,
            cv.experiences.map((experience) => (
              <div key={experience.company}>
                <div className="flex items-baseline justify-between gap-[12px]">
                  <p>
                    <span className="font-semibold">{experience.role}</span> · {experience.company}
                  </p>
                  <p className="shrink-0 text-[8.5px] opacity-70">{experience.period}</p>
                </div>
                <ul className="mt-[2px] list-disc pl-[12px]">
                  {experience.tasks.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
              </div>
            )),
          )}
          {section(
            headings.projects,
            <ul className="flex flex-col gap-[3px]">
              {cv.projects.map((project) => (
                <li key={project.name}>
                  <span className="font-semibold">{project.name}</span> · {project.summary}
                  {project.stack && <span className="opacity-70"> ({project.stack})</span>}
                </li>
              ))}
            </ul>,
          )}
          {section(
            headings.education,
            cv.education.map((entry) => (
              <div key={entry.degree} className="flex items-baseline justify-between gap-[12px]">
                <p>
                  <span className="font-semibold">{entry.degree}</span>
                  {entry.school && ` · ${entry.school}`}
                </p>
                <p className="shrink-0 text-[8.5px] opacity-70">{entry.period}</p>
              </div>
            )),
          )}
        </div>
      </div>
    </article>
  )
}
