import { ContactShadows } from '@react-three/drei'

// Sol invisible sur fond crème : seule l'ombre douce du Mac se lit, sans halo qui teinterait le fond.
export default function FloorGlow() {
  return <ContactShadows position={[0, 0.0003, 0]} scale={0.7} resolution={512} blur={2.6} far={0.12} opacity={0.9} />
}
