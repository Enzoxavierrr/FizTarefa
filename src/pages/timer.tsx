import { useCallback, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, RotateCcw, Coffee, Brain, Sparkles, Volume2, VolumeX } from "lucide-react"
import { Sidebar } from "@/components/dashboard"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { PomodoroPhase } from "@/types"
import { POMODORO_DURATIONS } from "@/types"
import { usePomodoroStore } from "@/stores/pomodoro-store"

const phaseConfig = {
  work: {
    label: "Foco",
    color: "from-amber-600 to-amber-800",
    bgColor: "bg-amber-900/20",
    icon: Brain,
    message: "Hora de focar! ☕",
  },
  "short-break": {
    label: "Pausa Curta",
    color: "from-emerald-500 to-emerald-700",
    bgColor: "bg-emerald-900/20",
    icon: Coffee,
    message: "Descanse um pouco! 🌿",
  },
  "long-break": {
    label: "Pausa Longa",
    color: "from-blue-500 to-blue-700",
    bgColor: "bg-blue-900/20",
    icon: Sparkles,
    message: "Você merece! ✨",
  },
}

// Componente da Xícara de Café
function CoffeeCup({ fillPercentage, phase }: { fillPercentage: number; phase: PomodoroPhase }) {
  // Bolhas de vapor
  const steamBubbles = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    delay: i * 0.3,
    x: -10 + Math.random() * 20,
  }))

  return (
    <div className="relative w-72 h-80 flex items-end justify-center">
      {/* Vapor (só aparece quando está cheio ou quase cheio) */}
      <AnimatePresence>
        {fillPercentage > 70 && (
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-20">
            {steamBubbles.map((bubble) => (
              <motion.div
                key={bubble.id}
                initial={{ opacity: 0, y: 20, x: bubble.x }}
                animate={{
                  opacity: [0, 0.6, 0],
                  y: [-10, -50],
                  x: [bubble.x, bubble.x + 10, bubble.x - 5],
                }}
                transition={{
                  duration: 2,
                  delay: bubble.delay,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute bottom-0 left-1/2 w-3 h-3 rounded-full bg-white/30 blur-sm"
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Xícara SVG */}
      <svg
        viewBox="0 0 200 180"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.3))" }}
      >
        {/* Definições de gradientes */}
        <defs>
          {/* Gradiente do líquido */}
          <linearGradient id="coffeeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={phase === "work" ? "#d97706" : phase === "short-break" ? "#10b981" : "#3b82f6"} />
            <stop offset="100%" stopColor={phase === "work" ? "#92400e" : phase === "short-break" ? "#047857" : "#1d4ed8"} />
          </linearGradient>
          
          {/* Gradiente da xícara */}
          <linearGradient id="cupGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5f5f5" />
            <stop offset="50%" stopColor="#e5e5e5" />
            <stop offset="100%" stopColor="#d4d4d4" />
          </linearGradient>

          {/* Sombra interna */}
          <linearGradient id="innerShadow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00000020" />
            <stop offset="50%" stopColor="#00000000" />
            <stop offset="100%" stopColor="#00000010" />
          </linearGradient>

          {/* Máscara para o líquido */}
          <clipPath id="cupClip">
            <path d="M 40 40 L 50 150 Q 100 165 150 150 L 160 40 Z" />
          </clipPath>

          {/* Brilho */}
          <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff00" />
            <stop offset="30%" stopColor="#ffffff40" />
            <stop offset="70%" stopColor="#ffffff00" />
          </linearGradient>
        </defs>

        {/* Prato/Base */}
        <ellipse cx="100" cy="165" rx="70" ry="12" fill="#d4d4d4" />
        <ellipse cx="100" cy="163" rx="65" ry="10" fill="#e5e5e5" />

        {/* Corpo da xícara - parte externa */}
        <path
          d="M 35 35 L 45 155 Q 100 175 155 155 L 165 35 Q 100 25 35 35"
          fill="url(#cupGradient)"
          stroke="#a3a3a3"
          strokeWidth="2"
        />

        {/* Alça da xícara */}
        <path
          d="M 160 50 Q 195 50 195 90 Q 195 130 160 130"
          fill="none"
          stroke="url(#cupGradient)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 160 50 Q 195 50 195 90 Q 195 130 160 130"
          fill="none"
          stroke="#a3a3a3"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Interior da xícara (sombra) */}
        <path
          d="M 42 40 L 50 145 Q 100 160 150 145 L 158 40 Q 100 30 42 40"
          fill="#f5f5f5"
        />
        <path
          d="M 42 40 L 50 145 Q 100 160 150 145 L 158 40 Q 100 30 42 40"
          fill="url(#innerShadow)"
        />

        {/* Líquido (café/chá) com animação */}
        <g clipPath="url(#cupClip)">
          <motion.rect
            x="40"
            width="120"
            height="120"
            fill="url(#coffeeGradient)"
            initial={{ y: 150 }}
            animate={{ y: 150 - (fillPercentage * 1.1) }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          
          {/* Ondulação do líquido */}
          <motion.path
            d={`M 40 ${150 - fillPercentage * 1.1} Q 70 ${145 - fillPercentage * 1.1} 100 ${150 - fillPercentage * 1.1} Q 130 ${155 - fillPercentage * 1.1} 160 ${150 - fillPercentage * 1.1} L 160 160 L 40 160 Z`}
            fill="url(#coffeeGradient)"
            animate={{
              d: [
                `M 40 ${150 - fillPercentage * 1.1} Q 70 ${145 - fillPercentage * 1.1} 100 ${150 - fillPercentage * 1.1} Q 130 ${155 - fillPercentage * 1.1} 160 ${150 - fillPercentage * 1.1} L 160 160 L 40 160 Z`,
                `M 40 ${150 - fillPercentage * 1.1} Q 70 ${155 - fillPercentage * 1.1} 100 ${150 - fillPercentage * 1.1} Q 130 ${145 - fillPercentage * 1.1} 160 ${150 - fillPercentage * 1.1} L 160 160 L 40 160 Z`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />

          {/* Espuma/Crema (só para café) */}
          {phase === "work" && fillPercentage > 10 && (
            <motion.ellipse
              cx="100"
              cy={148 - fillPercentage * 1.1}
              rx="50"
              ry="4"
              fill="#f5deb3"
              opacity={0.6}
              animate={{ ry: [4, 5, 4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </g>

        {/* Brilho na xícara */}
        <path
          d="M 50 45 L 55 140 Q 60 145 65 140 L 70 45"
          fill="url(#shine)"
          opacity={0.5}
        />

        {/* Borda superior */}
        <ellipse cx="100" cy="35" rx="65" ry="8" fill="#e5e5e5" stroke="#a3a3a3" strokeWidth="1" />
        <ellipse cx="100" cy="35" rx="60" ry="6" fill="#fafafa" />
      </svg>

      {/* Reflexo no prato */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full blur-sm" />
    </div>
  )
}

function TimerPage() {
  // Usar seletores individuais para melhor performance e reatividade
  const phase = usePomodoroStore((state) => state.phase)
  const timeRemaining = usePomodoroStore((state) => state.timeRemaining)
  const isRunning = usePomodoroStore((state) => state.isRunning)
  const cyclesCompleted = usePomodoroStore((state) => state.cyclesCompleted)
  const start = usePomodoroStore((state) => state.start)
  const pause = usePomodoroStore((state) => state.pause)
  const reset = usePomodoroStore((state) => state.reset)

  const [isMuted, setIsMuted] = useState(false)

  const totalTime = POMODORO_DURATIONS[phase]
  const fillPercentage = ((totalTime - timeRemaining) / totalTime) * 100
  const config = phaseConfig[phase]
  const PhaseIcon = config.icon

  // Formatar tempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Controles
  const toggleTimer = () => {
    if (isRunning) {
      pause()
    } else {
      start()
    }
  }
  
  const resetTimer = () => {
    reset()
  }

  // Selecionar fase manualmente
  const selectPhase = (newPhase: PomodoroPhase) => {
    // Atualiza o store com a nova fase
    usePomodoroStore.setState({
      phase: newPhase,
      timeRemaining: POMODORO_DURATIONS[newPhase],
      isRunning: false,
    })
  }

  return (
    <div className="min-h-screen bg-background p-4 flex gap-6">
      <Sidebar />
      
      <main className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-foreground font-[Poppins] mb-2">
            Pomodoro Timer
          </h1>
          <p className="text-muted-foreground font-[Poppins]">
            {config.message}
          </p>
        </motion.div>

        {/* Seletor de Fase */}
        <div className="flex gap-2 p-1 bg-sidebar rounded-2xl">
          {(Object.keys(phaseConfig) as PomodoroPhase[]).map((p) => (
            <button
              key={p}
              onClick={() => selectPhase(p)}
              className={cn(
                "px-6 py-3 rounded-xl font-medium font-[Poppins] transition-all",
                phase === p
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
              )}
            >
              {phaseConfig[p].label}
            </button>
          ))}
        </div>

        {/* Xícara e Timer */}
        <div className="relative flex flex-col items-center">
          {/* Glow effect */}
          <motion.div
            className={cn(
              "absolute inset-0 rounded-full blur-3xl opacity-30",
              `bg-gradient-to-b ${config.color}`
            )}
            animate={{
              scale: isRunning ? [1, 1.1, 1] : 1,
              opacity: isRunning ? [0.2, 0.4, 0.2] : 0.2,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Xícara */}
          <CoffeeCup fillPercentage={fillPercentage} phase={phase} />

          {/* Timer Display */}
          <motion.div
            className="mt-8 text-center"
            animate={{ scale: isRunning ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <span className="text-7xl font-bold text-foreground font-mono tracking-wider">
              {formatTime(timeRemaining)}
            </span>
          </motion.div>

          {/* Progress indicator */}
          <div className="mt-4 flex items-center gap-2">
            <PhaseIcon className={cn("w-5 h-5", phase === "work" ? "text-amber-500" : phase === "short-break" ? "text-emerald-500" : "text-blue-500")} />
            <span className="text-sm text-muted-foreground font-[Poppins]">
              {Math.round(fillPercentage)}% completo
            </span>
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={resetTimer}
            className="w-14 h-14 rounded-2xl"
          >
            <RotateCcw className="w-6 h-6" />
          </Button>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={toggleTimer}
              className={cn(
                "w-20 h-20 rounded-full text-xl font-bold shadow-xl",
                `bg-gradient-to-b ${config.color} hover:opacity-90`
              )}
            >
              {isRunning ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </Button>
          </motion.div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="w-14 h-14 rounded-2xl"
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-8 mt-4"
        >
          <div className="text-center">
            <p className="text-3xl font-bold text-primary font-[Poppins]">{cyclesCompleted}</p>
            <p className="text-sm text-muted-foreground font-[Poppins]">Pomodoros</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground font-[Poppins]">
              {Math.round((cyclesCompleted * 25) / 60 * 10) / 10}h
            </p>
            <p className="text-sm text-muted-foreground font-[Poppins]">Focado</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground font-[Poppins]">
              {Math.floor(cyclesCompleted / 4)}
            </p>
            <p className="text-sm text-muted-foreground font-[Poppins]">Ciclos</p>
          </div>
        </motion.div>

        {/* Dica */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-muted-foreground/60 font-[Poppins] text-center max-w-md"
        >
          💡 Dica: A cada 4 pomodoros de foco, você ganha uma pausa longa de 15 minutos!
        </motion.p>
      </main>
    </div>
  )
}

export { TimerPage }
