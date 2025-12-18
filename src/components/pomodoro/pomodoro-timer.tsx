import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui'
import { usePomodoro } from '@/hooks/use-pomodoro'
import { cn } from '@/lib/utils'
import { useTimerSettingsStore } from '@/stores/timer-settings-store'

export function PomodoroTimer() {
  const {
    phase,
    timeRemaining,
    isRunning,
    cyclesCompleted,
    start,
    pause,
    reset,
    skip,
    formatTime,
    getPhaseLabel,
    getPhaseColor,
    currentTask,
  } = usePomodoro()
  
  const getDurations = useTimerSettingsStore((state) => state.getDurations)
  const durations = getDurations()
  const totalTime = durations[phase]
  const progress = ((totalTime - timeRemaining) / totalTime) * 100

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* Current Task */}
      {currentTask && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Focando em:</p>
          <p className="text-lg font-medium">{currentTask.title}</p>
        </div>
      )}

      {/* Timer Circle */}
      <div className="relative">
        <svg className="w-64 h-64 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted/20"
          />
          {/* Progress circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
            className={cn('transition-all duration-1000', getPhaseColor())}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-6xl font-bold tabular-nums', getPhaseColor())}>
            {formatTime(timeRemaining)}
          </span>
          <span className="text-lg text-muted-foreground mt-2">
            {getPhaseLabel()}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={reset}
          className="h-12 w-12"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
        <Button
          size="lg"
          onClick={isRunning ? pause : start}
          className="h-16 w-16 rounded-full"
        >
          {isRunning ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-1" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={skip}
          className="h-12 w-12"
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>

      {/* Cycles Counter */}
      <div className="flex items-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              'h-3 w-3 rounded-full transition-colors',
              cyclesCompleted % 4 > i
                ? 'bg-primary'
                : 'bg-muted'
            )}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {cyclesCompleted} pomodoro{cyclesCompleted !== 1 ? 's' : ''} completo{cyclesCompleted !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}

