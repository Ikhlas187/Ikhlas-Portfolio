import { useEffect, useRef, useState } from 'react'
import { extend, useFrame, useThree, type ThreeElement, type ThreeEvent } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { BallCollider, CuboidCollider, RigidBody, useRopeJoint, useSphericalJoint, type RapierRigidBody } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import { CatmullRomCurve3, Group, Mesh, Quaternion, Vector2, Vector3 } from 'three'
import type { MotionValue } from 'framer-motion'
import useBadgeTextures from '@/components/pages/Home/useBadgeTextures'
import { badgeIntro, cameraDistance, coverDistance } from '@/logic/badgeIntro/badgeIntro'
import badgeModelUrl from '@/assets/badge.glb?url'

extend({ MeshLineGeometry, MeshLineMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>
  }
}

type BadgeProps = {
  name: string
  introProgress: MotionValue<number>
  fov: number
  startDistance: number
}

type BadgeModel = {
  nodes: { card: Mesh; clip: Mesh; clamp: Mesh }
}

const SEGMENT = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 } as const
const MAX_SPEED = 50
const MIN_SPEED = 10
// Face visible du modèle à l'échelle 2,25.
const CARD_FACE = { width: 1.61, height: 2.25 }
const SETTLE_SPEED = 8

useGLTF.preload(badgeModelUrl)

export default function Badge({ name, introProgress, fov, startDistance }: BadgeProps) {
  const band = useRef<Mesh>(null)
  const face = useRef<Group>(null)
  const fixed = useRef<RapierRigidBody>(null!)
  const j1 = useRef<RapierRigidBody>(null!)
  const j2 = useRef<RapierRigidBody>(null!)
  const j3 = useRef<RapierRigidBody>(null!)
  const card = useRef<RapierRigidBody>(null!)
  const isIntroRunning = useRef(false)
  const settledHeight = useRef(0)
  const [isIntro, setIsIntro] = useState(false)
  const [dragOffset, setDragOffset] = useState<Vector3 | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [curve] = useState(() => new CatmullRomCurve3([new Vector3(), new Vector3(), new Vector3(), new Vector3()], false, 'chordal'))
  // Positions lissées des 2 maillons du milieu : le cordon ne tremble pas quand la carte bouge vite.
  const [lerped] = useState(() => ({ j1: null as Vector3 | null, j2: null as Vector3 | null }))
  const [vectors] = useState(() => ({
    pointer: new Vector3(),
    direction: new Vector3(),
    angular: new Vector3(),
    rotation: new Vector3(),
    upright: new Quaternion(),
    current: new Quaternion(),
  }))
  const { width, height } = useThree((state) => state.size)
  const { nodes } = useGLTF(badgeModelUrl) as unknown as BadgeModel
  const texture = useBadgeTextures(name)
  const lanyardColor = getComputedStyle(document.documentElement).getPropertyValue('--color-lanyard').trim()

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]])

  useEffect(() => {
    document.body.style.cursor = dragOffset ? 'grabbing' : isHovered && !isIntro ? 'grab' : ''
    return () => {
      document.body.style.cursor = ''
    }
  }, [dragOffset, isHovered, isIntro])

  useFrame((state, delta) => {
    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current || !band.current) return
    const intro = badgeIntro(introProgress.get())
    const hasIntroStarted = intro.flip > 0

    if (hasIntroStarted !== isIntroRunning.current) {
      isIntroRunning.current = hasIntroStarted
      setIsIntro(hasIntroStarted)
      if (hasIntroStarted) {
        settledHeight.current = card.current.translation().y
        setDragOffset(null)
      }
    }

    if (dragOffset && !hasIntroStarted) {
      vectors.pointer.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      vectors.direction.copy(vectors.pointer).sub(state.camera.position).normalize()
      vectors.pointer.add(vectors.direction.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((body) => body.current?.wakeUp())
      card.current.setNextKinematicTranslation({
        x: vectors.pointer.x - dragOffset.x,
        y: vectors.pointer.y - dragOffset.y,
        z: vectors.pointer.z - dragOffset.z,
      })
    }

    // Pendant l'intro, la carte se remet droite au centre pour qu'on puisse entrer dedans.
    if (hasIntroStarted) {
      const settle = 1 - Math.exp(-SETTLE_SPEED * delta)
      const position = card.current.translation()
      card.current.setNextKinematicTranslation({
        x: position.x * (1 - settle),
        y: position.y + (settledHeight.current - position.y) * settle,
        z: position.z * (1 - settle),
      })
      vectors.current.copy(card.current.rotation()).slerp(vectors.upright, settle)
      card.current.setNextKinematicRotation(vectors.current)
    }

    for (const key of ['j1', 'j2'] as const) {
      const body = key === 'j1' ? j1.current : j2.current
      const target = new Vector3().copy(body.translation())
      const previous = (lerped[key] ??= target.clone())
      const distance = Math.max(0.1, Math.min(1, previous.distanceTo(target)))
      previous.lerp(target, delta * (MIN_SPEED + distance * (MAX_SPEED - MIN_SPEED)))
    }

    curve.points[0].copy(j3.current.translation())
    curve.points[1].copy(lerped.j2!)
    curve.points[2].copy(lerped.j1!)
    curve.points[3].copy(fixed.current.translation())
    ;(band.current.geometry as MeshLineGeometry).setPoints(curve.getPoints(32))

    if (!hasIntroStarted) {
      vectors.angular.copy(card.current.angvel())
      vectors.rotation.copy(card.current.rotation())
      card.current.setAngvel({ x: vectors.angular.x, y: vectors.angular.y - vectors.rotation.y * 0.25, z: vectors.angular.z }, true)
    }

    if (face.current) face.current.rotation.y = intro.flip * Math.PI

    const cardCenter = card.current.translation()
    const centering = Math.min(1, intro.zoom * 2)
    const distance = cameraDistance(intro.zoom, startDistance, coverDistance(CARD_FACE, state.size, fov))
    state.camera.position.set(cardCenter.x * centering, cardCenter.y * centering, cardCenter.z * centering + distance)
  })

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    // Plusieurs meshes de la carte sont touchés par le même rayon : un seul appel.
    event.stopPropagation()
    if (isIntroRunning.current) return
    ;(event.target as Element).setPointerCapture(event.pointerId)
    setDragOffset(new Vector3().copy(event.point).sub(vectors.rotation.copy(card.current.translation())))
  }

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    ;(event.target as Element).releasePointerCapture(event.pointerId)
    setDragOffset(null)
  }

  const bodyType = dragOffset || isIntro ? 'kinematicPosition' : 'dynamic'

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...SEGMENT} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...SEGMENT}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...SEGMENT}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...SEGMENT}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...SEGMENT} type={bodyType}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            ref={face}
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => setIsHovered(true)}
            onPointerOut={() => setIsHovered(false)}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial key={texture?.uuid} map={texture} clearcoat={1} clearcoatRoughness={0.15} roughness={0.3} metalness={0.1} />
            </mesh>
            {/* Métal argenté clair, comme le mousqueton de drkst. */}
            <mesh geometry={nodes.clip.geometry}>
              <meshStandardMaterial color={lanyardColor} metalness={0.5} roughness={0.3} />
            </mesh>
            <mesh geometry={nodes.clamp.geometry}>
              <meshStandardMaterial color={lanyardColor} metalness={0.5} roughness={0.3} />
            </mesh>
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          args={[{ resolution: new Vector2(width, height) }]}
          color={lanyardColor}
          depthTest={false}
          resolution={new Vector2(width, height)}
          lineWidth={1}
        />
      </mesh>
    </>
  )
}
