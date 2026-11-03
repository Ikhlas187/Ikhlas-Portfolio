import type { FsFolder, FsImageFile, FsPdfFile, FsTextFile, MacFileTexts } from '@/data/macos'
import { projectSlug } from '@/logic/macos/projectSlug/projectSlug'

export type FileTreeProject = {
  name: string
  eyebrow: string
  description: string
  date: string
  photos: { id: string; alt: string }[]
}

export type FileTreeRole = { id: string; name: string; stack: string[] }

export type FileTreeSources = {
  texts: MacFileTexts
  projects: FileTreeProject[]
  roles: FileTreeRole[]
  dateLabel: string
  year: string
}

// Arborescence du Finder : Bureau (projets, compétences, présentation, CV), Documents, Téléchargements, Corbeille.
export function buildFileTree({ texts, projects, roles, dateLabel, year }: FileTreeSources): FsFolder {
  const cv: FsPdfFile = {
    kind: 'pdf',
    id: 'cv',
    name: texts.cv.name,
    date: year,
    document: { title: texts.cv.title, subtitle: texts.cv.subtitle, sections: texts.cv.sections },
  }
  const about: FsTextFile = {
    kind: 'text',
    id: 'about',
    name: texts.about.name,
    date: year,
    content: texts.about.lines.join('\n'),
  }

  const projectsFolder: FsFolder = {
    kind: 'folder',
    id: 'projects',
    name: texts.folders.projects,
    date: year,
    children: projects.map((project) => ({
      kind: 'folder',
      id: projectSlug(project.name),
      name: project.name,
      date: project.date,
      children: [
        {
          kind: 'text',
          id: 'readme',
          name: texts.readme,
          date: project.date,
          content: [project.name, project.eyebrow, `${dateLabel} ${project.date}`, '', project.description].join('\n'),
        },
        ...project.photos.map(
          (photo, index): FsImageFile => ({
            kind: 'image',
            id: `photo-${index + 1}`,
            name: `${texts.photo} ${index + 1}.jpg`,
            date: project.date,
            photoId: photo.id,
            alt: photo.alt,
          }),
        ),
      ],
    })),
  }

  const skills: FsFolder = {
    kind: 'folder',
    id: 'skills',
    name: texts.folders.skills,
    date: year,
    children: roles.map((role) => ({
      kind: 'text',
      id: role.id,
      name: `${role.name}.txt`,
      date: year,
      content: [role.name, '', ...role.stack.map((tool) => `· ${tool}`)].join('\n'),
    })),
  }

  const allTools = [...new Set(roles.flatMap((role) => role.stack))]

  return {
    kind: 'folder',
    id: 'home',
    name: texts.folders.home,
    date: year,
    children: [
      {
        kind: 'folder',
        id: 'desktop',
        name: texts.folders.desktop,
        date: year,
        children: [projectsFolder, skills, about, cv],
      },
      {
        kind: 'folder',
        id: 'documents',
        name: texts.folders.documents,
        date: year,
        children: [
          cv,
          {
            kind: 'text',
            id: 'stack',
            name: texts.stack.name,
            date: year,
            content: [texts.stack.heading, '', ...allTools.map((tool) => `· ${tool}`)].join('\n'),
          },
        ],
      },
      {
        kind: 'folder',
        id: 'downloads',
        name: texts.folders.downloads,
        date: year,
        children: [
          {
            kind: 'image',
            id: 'code',
            name: texts.downloadedPhoto.name,
            date: year,
            photoId: texts.downloadedPhoto.photoId,
            alt: texts.downloadedPhoto.alt,
          },
        ],
      },
      { kind: 'folder', id: 'trash', name: texts.folders.trash, date: year, children: [] },
    ],
  }
}
