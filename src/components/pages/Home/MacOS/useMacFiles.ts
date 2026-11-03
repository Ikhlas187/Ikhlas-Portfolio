import { useMemo } from 'react'
import { FILE_TREE_YEAR, MAC_FILE_TEXTS } from '@/data/macos'
import { PROJECTS, PROJECTS_SECTION } from '@/data/projects'
import { ROLES } from '@/data/roles'
import { useLocale } from '@/lib/LocaleProvider'
import { buildFileTree } from '@/logic/macos/buildFileTree/buildFileTree'

// Arborescence du Finder dans la langue du site, recalculée seulement quand la langue change.
export function useMacFiles() {
  const { locale } = useLocale()
  return useMemo(
    () =>
      buildFileTree({
        texts: MAC_FILE_TEXTS[locale],
        projects: PROJECTS[locale],
        roles: ROLES[locale],
        dateLabel: PROJECTS_SECTION[locale].dateLabel,
        year: FILE_TREE_YEAR,
      }),
    [locale],
  )
}
