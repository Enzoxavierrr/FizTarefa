import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface ParticlesProps {
  className?: string
  quantity?: number
  staticity?: number
  ease?: number
  refresh?: boolean
  color?: string
}

export function Particles({
  className,
  quantity = 50,
  staticity = 50,
  ease = 50,
  color = "#ffffff",
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = canvasContainerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = container.offsetWidth
      canvas.height = container.offsetHeight
    }

    resizeCanvas()

    interface Particle {
      x: number
      y: number
      translateX: number
      translateY: number
      size: number
      alpha: number
      targetAlpha: number
      dx: number
      dy: number
      magnetism: number
    }

    const particles: Particle[] = []

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      translateX: 0,
      translateY: 0,
      size: Math.random() * 2 + 0.5,
      alpha: 0,
      targetAlpha: Math.random() * 0.6 + 0.1,
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2,
      magnetism: 0.1 + Math.random() * 4,
    })

    for (let i = 0; i < quantity; i++) {
      particles.push(createParticle())
    }

    let animationFrameId: number
    let mouse = { x: 0, y: 0 }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    container.addEventListener("mousemove", handleMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        // Fade in
        if (particle.alpha < particle.targetAlpha) {
          particle.alpha += 0.02
        }

        // Move
        particle.x += particle.dx
        particle.y += particle.dy

        // Mouse interaction
        const dx = mouse.x - particle.x
        const dy = mouse.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = staticity

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance
          particle.translateX += (dx / distance) * force * particle.magnetism * (ease / 100)
          particle.translateY += (dy / distance) * force * particle.magnetism * (ease / 100)
        } else {
          particle.translateX *= 0.98
          particle.translateY *= 0.98
        }

        // Wrap around
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw
        ctx.beginPath()
        ctx.arc(
          particle.x + particle.translateX,
          particle.y + particle.translateY,
          particle.size,
          0,
          Math.PI * 2
        )
        ctx.fillStyle = color
        ctx.globalAlpha = particle.alpha
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    window.addEventListener("resize", resizeCanvas)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", resizeCanvas)
      container.removeEventListener("mousemove", handleMouseMove)
    }
  }, [quantity, staticity, ease, color])

  return (
    <div ref={canvasContainerRef} className={cn("absolute inset-0", className)}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

