import { cn } from '@/lib/utils'
import { NOTE_COLOR_CLASSES } from '@/components/pages/Home/noteColorClasses'
import { NOTE_COLORS, type NoteColor } from '@/types/note'

type NoteColorPickerProps = {
  value: NoteColor
  onChange: (color: NoteColor) => void
  label: string
  colorNames: Record<NoteColor, string>
}

export default function NoteColorPicker({ value, onChange, label, colorNames }: NoteColorPickerProps) {
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-2">
      {NOTE_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          role="radio"
          aria-checked={value === color}
          aria-label={colorNames[color]}
          onClick={() => onChange(color)}
          className={cn(
            'size-6 cursor-pointer rounded-full transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black',
            NOTE_COLOR_CLASSES[color].swatch,
            value === color && 'shadow-[0_0_0_2px_var(--color-black)]',
          )}
        />
      ))}
    </div>
  )
}
