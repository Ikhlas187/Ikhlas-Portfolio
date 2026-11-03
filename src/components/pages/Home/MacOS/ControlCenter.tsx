import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Bluetooth, Moon, Radio, Sun, SunMoon, Volume2, Wifi } from 'lucide-react'
import ControlCenterSlider from '@/components/pages/Home/MacOS/ControlCenterSlider'
import ControlCenterToggle from '@/components/pages/Home/MacOS/ControlCenterToggle'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import type { MacDisplay } from '@/lib/macDisplaySession'

export type ControlCenterSettings = {
  isWifiOn: boolean
  isBluetoothOn: boolean
  isAirDropOn: boolean
  isFocusOn: boolean
  volume: number
}

type ControlCenterProps = {
  display: MacDisplay
  settings: ControlCenterSettings
  onDisplayChange: (display: MacDisplay) => void
  onSettingsChange: (settings: ControlCenterSettings) => void
  onClose: () => void
}

const TILE = 'rounded-[14px] bg-(--macos-cc-tile) p-[10px]'

// Centre de contrôle Sequoia : panneau en verre ancré sous son icône, en haut à droite de la barre de menus.
export default function ControlCenter({
  display,
  settings,
  onDisplayChange,
  onSettingsChange,
  onClose,
}: ControlCenterProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].controlCenter
  const panelRef = useRef<HTMLDivElement>(null)
  const status = (isOn: boolean, onLabel = texts.on) => (isOn ? onLabel : texts.off)
  const toggle = (key: Exclude<keyof ControlCenterSettings, 'volume'>) =>
    onSettingsChange({ ...settings, [key]: !settings[key] })

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      const target = event.target as Element | null
      if (panelRef.current?.contains(target) || target?.closest('[data-control-center-toggle]')) return
      onClose()
    }
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    document.addEventListener('pointerdown', closeOutside, true)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside, true)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [onClose])

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-label={texts.label}
      initial={{ opacity: 0, scale: 0.9, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -4, transition: { duration: 0.14, ease: 'easeIn' } }}
      transition={{ type: 'spring', stiffness: 520, damping: 34, mass: 0.8 }}
      style={{ transformOrigin: '100% 0%' }}
      className="absolute top-[36px] right-[8px] z-50 flex w-[320px] flex-col gap-[10px] rounded-[20px] border border-(--macos-cc-border) bg-(--macos-cc-glass) p-[10px] font-sans text-[13px] text-(--macos-cc-text) shadow-(--macos-cc-shadow) backdrop-blur-2xl backdrop-saturate-[1.8]"
    >
      <div className="grid grid-cols-2 gap-[10px]">
        <div className={`${TILE} flex flex-col gap-[10px]`}>
          <ControlCenterToggle
            icon={Wifi}
            label={texts.wifi}
            status={status(settings.isWifiOn, texts.wifiOn)}
            isOn={settings.isWifiOn}
            onToggle={() => toggle('isWifiOn')}
          />
          <ControlCenterToggle
            icon={Bluetooth}
            label={texts.bluetooth}
            status={status(settings.isBluetoothOn)}
            isOn={settings.isBluetoothOn}
            onToggle={() => toggle('isBluetoothOn')}
          />
          <ControlCenterToggle
            icon={Radio}
            label={texts.airDrop}
            status={status(settings.isAirDropOn, texts.airDropOn)}
            isOn={settings.isAirDropOn}
            onToggle={() => toggle('isAirDropOn')}
          />
        </div>
        <div className="flex flex-col gap-[10px]">
          <div className={`${TILE} flex flex-1 items-center`}>
            <ControlCenterToggle
              icon={Moon}
              label={texts.focus}
              status={settings.isFocusOn ? texts.focusOn : undefined}
              isOn={settings.isFocusOn}
              onToggle={() => toggle('isFocusOn')}
            />
          </div>
          <div className={`${TILE} flex flex-1 items-center`}>
            <ControlCenterToggle
              icon={SunMoon}
              label={texts.darkMode}
              status={status(display.isDarkMode)}
              isOn={display.isDarkMode}
              onToggle={() => onDisplayChange({ ...display, isDarkMode: !display.isDarkMode })}
            />
          </div>
        </div>
      </div>
      <ControlCenterSlider
        icon={Sun}
        label={texts.display}
        value={display.brightness}
        onChange={(brightness) => onDisplayChange({ ...display, brightness })}
      />
      <ControlCenterSlider
        icon={Volume2}
        label={texts.sound}
        value={settings.volume}
        onChange={(volume) => onSettingsChange({ ...settings, volume })}
      />
    </motion.div>
  )
}
