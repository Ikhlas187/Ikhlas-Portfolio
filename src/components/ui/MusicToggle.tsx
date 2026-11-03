import { Button } from '@/components/ui/button'
import { MUSIC_TOGGLE } from '@/data/music'
import { useLocale } from '@/lib/LocaleProvider'
import { MUSIC_CONTROL_ATTRIBUTE, useMusic } from '@/lib/MusicProvider'
import { cn } from '@/lib/utils'

// Hauteur au repos et décalage de chaque barre de l'égaliseur.
const BARS = [
  { rest: 0.45, delay: '-0.4s' },
  { rest: 0.8, delay: '-0.1s' },
  { rest: 0.6, delay: '-0.7s' },
  { rest: 0.35, delay: '-0.25s' },
]

// Bouton son discret, fixe en bas à gauche : barres d'égaliseur animées pendant la lecture, immobiles quand c'est coupé.
export default function MusicToggle() {
  const { locale } = useLocale()
  const { isAvailable, isPlaying, toggle } = useMusic()
  const texts = MUSIC_TOGGLE[locale]

  if (!isAvailable) return null

  return (
    <Button
      variant="outline"
      size="icon"
      {...{ [MUSIC_CONTROL_ATTRIBUTE]: '' }}
      aria-label={isPlaying ? texts.mute : texts.unmute}
      aria-pressed={isPlaying}
      onClick={toggle}
      className="fixed bottom-5 left-5 z-[95] size-11 gap-[3px] rounded-full border-white/20 bg-black/80 text-white backdrop-blur hover:bg-white hover:text-black"
    >
      {BARS.map((bar, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={cn(
            'h-[14px] w-[2px] rounded-full bg-current transition-[scale,opacity] duration-300',
            isPlaying ? 'animate-music-bar motion-reduce:animate-none' : 'opacity-60',
          )}
          style={{ scale: `1 ${bar.rest}`, animationDelay: bar.delay }}
        />
      ))}
    </Button>
  )
}
