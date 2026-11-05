import Interlude from '@/components/pages/Home/Interlude'
import '@/components/pages/Home/Projects.css'

/* 1er écran de la section macOS : l'intercalaire « Selected works » dans un écran à cadre noir (réf. maquette Framer IFRI).
   Le cadre est dessiné par-dessus le contenu, à l'intérieur de la boîte, comme sur la maquette. */
export default function WorksScreen() {
  return (
    <div className="bd relative size-full overflow-hidden rounded-[28px] bg-white shadow-(--works-screen-shadow) after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-[10px] after:border-black [&_.bd-interlude]:h-full [&_.bd-interlude]:min-h-0 [&_.bd-interlude__frame]:w-[78%]">
      <Interlude />
    </div>
  )
}
