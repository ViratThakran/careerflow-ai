"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import * as THREE from "three"

function NeuralNetwork() {
  const ref = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  
  const { positions, connections, colors } = useMemo(() => {
    const nodeCount = 200
    const pos = new Float32Array(nodeCount * 3)
    const cols = new Float32Array(nodeCount * 3)
    
    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 2 + Math.random() * 2
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = radius * Math.cos(phi)
      
      // Random colors: cyan, violet, or white
      const colorChoice = Math.random()
      if (colorChoice < 0.4) {
        cols[i * 3] = 0; cols[i * 3 + 1] = 0.94; cols[i * 3 + 2] = 1 // Cyan
      } else if (colorChoice < 0.7) {
        cols[i * 3] = 0.545; cols[i * 3 + 1] = 0.361; cols[i * 3 + 2] = 0.965 // Violet
      } else {
        cols[i * 3] = 1; cols[i * 3 + 1] = 1; cols[i * 3 + 2] = 1 // White
      }
    }
    
    // Generate connections
    const connectionPositions: number[] = []
    const connectionThreshold = 1.3
    
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = pos[i * 3] - pos[j * 3]
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1]
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2]
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
        
        if (distance < connectionThreshold && Math.random() > 0.6) {
          connectionPositions.push(
            pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
            pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
          )
        }
      }
    }
    
    return { 
      positions: pos, 
      connections: new Float32Array(connectionPositions),
      colors: cols
    }
  }, [])
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.05
      linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1
    }
  })

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(connections, 3))
    return geometry
  }, [connections])

  return (
    <group>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
        <bufferAttribute
          attach="geometry-attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </Points>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  )
}

function FloatingOrbs() {
  const ref = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.children.forEach((child, i) => {
        child.position.x = Math.sin(state.clock.elapsedTime * 0.2 + i * 2) * 3
        child.position.y = Math.cos(state.clock.elapsedTime * 0.15 + i * 2) * 2
      })
    }
  })

  return (
    <group ref={ref}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[i * 2 - 2, 0, -2]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshBasicMaterial
            color={i === 0 ? "#00F0FF" : i === 1 ? "#8B5CF6" : "#F43F5E"}
            transparent
            opacity={0.08}
          />
        </mesh>
      ))}
    </group>
  )
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <NeuralNetwork />
        <FloatingOrbs />
      </Canvas>
      {/* Radial gradient glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 70% 40%, rgba(0, 240, 255, 0.12) 0%, transparent 70%)'
        }}
      />
    </div>
  )
}
