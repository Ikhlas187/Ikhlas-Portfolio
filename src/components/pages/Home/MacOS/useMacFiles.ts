import { useMemo } from 'react'
import { useMacRepos } from '@/components/pages/Home/MacOS/MacReposProvider'
import { CV } from '@/data/cv'
import { FILE_TREE_YEAR, MAC_FILE_TEXTS } from '@/data/macos'
import { ROLES } from '@/data/roles'
import { useLocale } from '@/lib/LocaleProvider'
import { buildFileTree } from '@/logic/macos/buildFileTree/buildFileTree'

// Arborescence du Finder dans la langue du site, recalculée quand la langue change ou qu'un repo se charge.
export function useMacFiles() {
  const { locale } = useLocale()
  const { index, trees } = useMacRepos()
  return useMemo(
    () =>
      buildFileTree({
        texts: MAC_FILE_TEXTS[locale],
        repos: index.map((summary) => ({ summary, tree: trees[summary.name] ?? null })),
        roles: ROLES[locale],
        cv: CV[locale],
        year: FILE_TREE_YEAR,
      }),
    [locale, index, trees],
  )
}
