import wallpaperUrl from '@/assets/photo-1511300636408-a63a89df3482.avif'

export default function Wallpaper() {
  return (
    <img
      src={wallpaperUrl}
      alt=""
      draggable={false}
      className="pointer-events-none absolute inset-0 size-full object-cover"
    />
  )
}
