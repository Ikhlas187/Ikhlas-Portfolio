// Segment d'URL d'un projet dans le navigateur du faux Mac (ikhlas.studio/projects/<slug>).
export function projectSlug(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, '-')
}
