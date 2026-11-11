import type { GiantSurMenu } from '@/data/giantSur'

// Menu de l'app au premier plan : « {app} » remplacé par son nom, dans le titre et chaque entrée.
export function withAppName(menu: GiantSurMenu, appName: string): GiantSurMenu {
  const fill = (text: string) => text.replaceAll('{app}', appName)
  return { ...menu, label: fill(menu.label), items: menu.items.map((item) => ({ ...item, title: fill(item.title) })) }
}
