import { useMemo, useState } from 'react'
import { ChevronLeft, Image, LayoutGrid } from 'lucide-react'
import FinderWindow from '@/components/pages/Home/MacOS/FinderWindow'
import PhotosAlbumCard from '@/components/pages/Home/MacOS/Photos/PhotosAlbumCard'
import PhotosGrid from '@/components/pages/Home/MacOS/Photos/PhotosGrid'
import PhotosMemoryCard from '@/components/pages/Home/MacOS/Photos/PhotosMemoryCard'
import PhotosTab from '@/components/pages/Home/MacOS/Photos/PhotosTab'
import PhotoViewer from '@/components/pages/Home/MacOS/Photos/PhotoViewer'
import { useMacFiles } from '@/components/pages/Home/MacOS/useMacFiles'
import type { WindowFrameProps } from '@/components/pages/Home/MacOS/Window'
import { MACOS } from '@/data/macos'
import { PROJECTS } from '@/data/projects'
import { useLocale } from '@/lib/LocaleProvider'
import { collectImages, findNode } from '@/logic/macos/fileTree/fileTree'
import { groupByAlbum } from '@/logic/macos/photoAlbums/photoAlbums'

type PhotosProps = { frame: WindowFrameProps }

export type PhotoItem = { id: string; photoId: string; alt: string; album: string; fileName: string }

type OpenAlbum = { label: string; items: PhotoItem[] }

const SECTION_HEADING = 'mb-[8px] px-[4px] text-[13px] leading-normal font-semibold tracking-wide text-(--macos-photos-text-50) uppercase'

// Copie de l'app Photos de frvky.online : Photothèque, Albums (Souvenirs, Épinglés) et visionneuse.
export default function Photos({ frame }: PhotosProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].photos
  const root = useMacFiles()
  const [tab, setTab] = useState<'library' | 'albums'>('library')
  const [openAlbum, setOpenAlbum] = useState<OpenAlbum | null>(null)
  const [viewer, setViewer] = useState<{ items: PhotoItem[]; index: number } | null>(null)

  const library = useMemo((): PhotoItem[] => {
    const projectPhotos = PROJECTS[locale].flatMap((project) =>
      project.photos.map((photo, index) => ({
        id: `${project.name}-${photo.id}`,
        photoId: photo.id,
        alt: photo.alt,
        album: project.name,
        fileName: `${project.name.toLowerCase()}-${index + 1}.jpg`,
      })),
    )
    const finderPhotos = collectImages(root).map(({ path, node }) => ({
      id: path.join('/'),
      photoId: node.photoId,
      alt: node.alt,
      album: findNode(root, path.slice(0, -1))?.name ?? texts.library,
      fileName: node.name,
    }))
    // Les images du Finder reprennent souvent celles des projets : une seule entrée par photo.
    const finderOnly = finderPhotos.filter((photo) => !projectPhotos.some((item) => item.photoId === photo.photoId))
    return [...projectPhotos, ...finderOnly]
  }, [locale, root, texts.library])

  const albums = useMemo(() => groupByAlbum(library), [library])
  const memories = albums.filter(([album]) => texts.memoriesAlbums.includes(album))
  const pinned = albums.filter(([album]) => texts.pinnedAlbums.includes(album))
  const gridItems = openAlbum ? openAlbum.items : library
  const openViewer = (index: number) => setViewer({ items: gridItems, index })

  return (
    <FinderWindow frame={frame} title={MACOS[locale].appNames.photos}>
      <div className="absolute inset-0 flex flex-col bg-(--macos-photos-bg) font-(family-name:--font-macos-app) text-(--macos-photos-text) [&_:is(h1,h2)]:font-(family-name:--font-macos-app) [&_:is(h1,h2)]:tracking-normal">
        <div className="flex shrink-0 items-center border-b border-(--macos-photos-line) px-[16px] py-[12px]">
          {openAlbum ? (
            <button
              type="button"
              onClick={() => setOpenAlbum(null)}
              className="flex cursor-pointer items-center gap-[4px] text-[15px] font-medium text-(--macos-photos-link)"
            >
              <ChevronLeft strokeWidth={2.2} className="size-[20px]" /> {texts.albums}
            </button>
          ) : (
            <h1 className="text-[20px] leading-[30px] font-bold">{tab === 'library' ? texts.library : texts.albums}</h1>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-[12px]">
          {openAlbum || tab === 'library' ? (
            <PhotosGrid items={gridItems} emptyLabel={texts.empty} onSelect={openViewer} />
          ) : (
            <div className="space-y-[24px]">
              {memories.length > 0 && (
                <section>
                  <h2 className={SECTION_HEADING}>{texts.memories}</h2>
                  <div className="-mx-[12px] flex gap-[12px] overflow-x-auto px-[12px] pb-[4px] [scrollbar-width:none]">
                    {memories.map(([album, items]) => (
                      <PhotosMemoryCard
                        key={album}
                        album={album}
                        items={items}
                        countLabel={items.length === 1 ? texts.item : texts.items}
                        onOpen={() => setViewer({ items, index: 0 })}
                      />
                    ))}
                  </div>
                </section>
              )}
              {pinned.length > 0 && (
                <section>
                  <h2 className={SECTION_HEADING}>{texts.pinned}</h2>
                  <div className="grid grid-cols-2 gap-[16px]">
                    {pinned.map(([album, items]) => (
                      <PhotosAlbumCard
                        key={album}
                        label={album}
                        items={items}
                        onOpen={() => setOpenAlbum({ label: album, items })}
                      />
                    ))}
                  </div>
                </section>
              )}
              <section>
                <h2 className={SECTION_HEADING}>{texts.albums}</h2>
                <div className="grid grid-cols-2 gap-[16px]">
                  {albums.map(([album, items]) => (
                    <PhotosAlbumCard
                      key={album}
                      label={album}
                      items={items}
                      onOpen={() => setOpenAlbum({ label: album, items })}
                    />
                  ))}
                </div>
              </section>
              <section>
                <h2 className={SECTION_HEADING}>{texts.peopleAndPets}</h2>
                <p className="px-[4px] text-[13px] text-(--macos-photos-text-40)">{texts.peopleHint}</p>
              </section>
            </div>
          )}
        </div>
        {!openAlbum && (
          <div className="flex shrink-0 justify-around border-t border-(--macos-photos-line) bg-(--macos-photos-bar) py-[8px]">
            <PhotosTab label={texts.library} isActive={tab === 'library'} Icon={Image} onClick={() => setTab('library')} />
            <PhotosTab
              label={texts.albums}
              isActive={tab === 'albums'}
              Icon={LayoutGrid}
              onClick={() => setTab('albums')}
            />
          </div>
        )}
        {viewer && (
          <PhotoViewer
            items={viewer.items}
            index={viewer.index}
            onNavigate={(index) => setViewer({ items: viewer.items, index })}
            onClose={() => setViewer(null)}
          />
        )}
      </div>
    </FinderWindow>
  )
}
