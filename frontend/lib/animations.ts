"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// useScrollAnimation hook
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  animation: (element: T, ctx: gsap.Context) => void,
  deps: React.DependencyList = []
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!ref.current) return

    const ctx = gsap.context(() => {
      animation(ref.current!, ctx)
    }, ref)

    return () => ctx.revert()
  }, deps)

  return ref
}

// useInView hook
export function useInView<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.2,
  once = true
) {
  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setIsInView(false)
        }
      },
      { threshold }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold, once])

  return { ref, isInView }
}

// useMousePosition hook
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [normalizedPosition, setNormalizedPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setNormalizedPosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return { position, normalizedPosition }
}

// useCountUp hook
export function useCountUp(
  end: number,
  duration: number = 2,
  start: number = 0,
  decimals: number = 0
) {
  const [count, setCount] = useState(start)
  const countRef = useRef({ value: start })

  const startCounting = useCallback(() => {
    gsap.to(countRef.current, {
      value: end,
      duration,
      ease: "expo.out",
      onUpdate: () => {
        setCount(Number(countRef.current.value.toFixed(decimals)))
      },
    })
  }, [end, duration, decimals])

  const reset = useCallback(() => {
    gsap.killTweensOf(countRef.current)
    countRef.current.value = start
    setCount(start)
  }, [start])

  return { count, startCounting, reset }
}

// Framer Motion variants
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export const fadeInDown = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
}

export const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerContainerFast = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
}

// GSAP animation presets
export function createScrollTriggerFadeIn(
  element: gsap.TweenTarget,
  trigger?: string | Element
) {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: trigger || element,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    }
  )
}

export function createStaggeredReveal(
  elements: gsap.TweenTarget,
  trigger: string | Element,
  stagger = 0.1
) {
  return gsap.fromTo(
    elements,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger,
      ease: "power3.out",
      scrollTrigger: {
        trigger,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    }
  )
}

// Text scramble effect
export function scrambleText(
  element: HTMLElement,
  finalText: string,
  duration: number = 1.5
) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()"
  const originalText = finalText
  let iteration = 0
  const totalIterations = duration * 60 // 60fps approximation

  const interval = setInterval(() => {
    element.innerText = originalText
      .split("")
      .map((char, index) => {
        if (index < iteration / 3) {
          return originalText[index]
        }
        if (char === " ") return " "
        if (char === "\n") return "\n"
        return chars[Math.floor(Math.random() * chars.length)]
      })
      .join("")

    iteration++

    if (iteration >= totalIterations) {
      element.innerText = originalText
      clearInterval(interval)
    }
  }, (duration * 1000) / totalIterations)

  return () => clearInterval(interval)
}
