// « Portfolio · E-commerce » : ce qui suit le 1er « · » donne les services du projet.
export function projectServices(eyebrow: string) {
  const [, ...services] = eyebrow.split('·').map((part) => part.trim())
  return services.filter(Boolean)
}
