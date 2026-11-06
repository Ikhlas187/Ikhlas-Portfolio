import { useState, type ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

// Photo qui apparaît en fondu une fois chargée, au lieu de surgir d'un coup.
export default function FadeInImage({ className, onLoad, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <img
      {...props}
      onLoad={(event) => {
        setIsLoaded(true)
        onLoad?.(event)
      }}
      ref={(image) => {
        if (image?.complete && image.naturalWidth > 0) setIsLoaded(true)
      }}
      className={cn('transition-opacity duration-700 ease-out', isLoaded ? 'opacity-100' : 'opacity-0', className)}
    />
  )
}
