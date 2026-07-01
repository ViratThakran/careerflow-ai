"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function Cursor() {
  const rawX = useMotionValue(-200)
  const rawY = useMotionValue(-200)
  const glowRef = useRef<HTMLDivElement>(null)

  const cfg = { stiffness: 180, damping: 22, mass: 0.5 }
  const x = useSpring(rawX, cfg)
  const y = useSpring(rawY, cfg)

  useEffect(() => {
    let raf: number
    let currentHue = 200

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
    }

    const tick = () => {
      currentHue = (currentHue + 0.8) % 360
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(circle, hsl(${currentHue}, 85%, 65%) 0%, hsl(${(currentHue + 40) % 360}, 80%, 60%) 40%, transparent 70%)`
      }
      raf = requestAnimationFrame(tick)
    }

    document.addEventListener("mousemove", onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      document.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [rawX, rawY])

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9998]"
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
    >
      <div
        ref={glowRef}
        className="w-12 h-12 rounded-full opacity-40 blur-md"
      />
    </motion.div>
  )
}
