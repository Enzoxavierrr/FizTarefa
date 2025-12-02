import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoreHorizontal, Trash2, Edit2, Timer } from 'lucide-react'
import { Checkbox, Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useTasks } from '@/hooks/use-tasks'
import { usePomodoroStore } from '@/stores/pomodoro-store'
import type { Task } from '@/types'

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { toggleTaskComplete, deleteTask } = useTasks()
  const { setCurrentTask } = usePomodoroStore()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const handleToggleComplete = async () => {
    await toggleTaskComplete(task.id, !task.completed)
  }

  const handleDelete = async () => {
    await deleteTask(task.id)
    setShowMenu(false)
  }

  const handleStartFocus = () => {
    setCurrentTask(task.id)
    navigate('/focus')
  }

  return (
    <div
      className={cn(
        'group flex items-start gap-3 p-4 rounded-lg border border-border bg-card transition-colors hover:bg-accent/30',
        task.completed && 'opacity-60'
      )}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={handleToggleComplete}
        className="mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm font-medium',
            task.completed && 'line-through text-muted-foreground'
          )}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {task.description}
          </p>
        )}
        {task.pomodoros_completed > 0 && (
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <Timer className="h-3 w-3" />
            <span>{task.pomodoros_completed} pomodoro{task.pomodoros_completed !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setShowMenu(!showMenu)}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-full mt-1 z-50 w-40 rounded-lg border border-border bg-popover shadow-lg py-1">
              <button
                onClick={handleStartFocus}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent transition-colors"
              >
                <Timer className="h-4 w-4" />
                Iniciar foco
              </button>
              <button
                onClick={() => {
                  onEdit?.(task)
                  setShowMenu(false)
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-accent transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

