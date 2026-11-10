import DesktopFooter from '@/components/ui/DesktopFooter'
import MobileFooter from '@/components/ui/MobileFooter'
import { MOBILE_QUERY, useMediaQuery } from '@/lib/useMediaQuery'

// Bureau : carte noire à encoche (réf. cosmoq.framer.website) ; mobile : bloc noir pleine largeur (réf. cashless.africa).
export default function Footer() {
  const isMobile = useMediaQuery(MOBILE_QUERY)
  return isMobile ? <MobileFooter /> : <DesktopFooter />
}
