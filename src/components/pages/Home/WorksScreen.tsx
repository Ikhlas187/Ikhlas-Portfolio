import Interlude from '@/components/pages/Home/Interlude'
import '@/components/pages/Home/Projects.css'

/* 1er écran de la section macOS : l'intercalaire « Selected works » dans un écran à cadre noir (réf. maquette Framer IFRI). */
export default function WorksScreen() {
  return (
    <div className="bd size-full overflow-hidden rounded-[clamp(14px,2.2vw,28px)] border-[6px] border-black bg-white shadow-(--macos-screen-shadow) [&_.bd-interlude]:h-full [&_.bd-interlude]:min-h-0 [&_.bd-interlude__frame]:w-[78%]">
      <Interlude />
    </div>
  )
}
