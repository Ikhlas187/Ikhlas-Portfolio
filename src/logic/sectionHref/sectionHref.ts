// Lien vers une section de la home (#about) : tel quel sur la home, /#about depuis une autre page.
export function sectionHref(href: string, isHome: boolean) {
  return href.startsWith('#') && !isHome ? `/${href}` : href
}
