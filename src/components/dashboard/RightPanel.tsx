import { useState, useMemo } from "react"
import { Search, Bell, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "./Calendar"
import { TaskCard } from "./TaskCard"
import { CreateTaskCard } from "./CreateTaskCard"
import { useCalendarStore } from "@/stores/calendar-store"
import { useTasks } from "@/hooks/use-tasks"
import { isSameDay, parseISO, format } from "date-fns"

function RightPanel() {
  const { selectedDate } = useCalendarStore()
  const { tasks, loading } = useTasks()
  const [searchQuery, setSearchQuery] = useState("")
  
  // Filtrar tarefas do dia selecionado e pela busca
  const dayTasks = useMemo(() => {
    if (!selectedDate) return []
    
    let filtered = tasks.filter((task) => {
      const taskDate = task.start_date ? parseISO(task.start_date) : null
      if (!taskDate) return false
      return isSameDay(taskDate, selectedDate)
    })

    // Aplicar filtro de busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((task) => {
        return (
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
        )
      })
    }

    // Ordenar por horário
    return filtered.sort((a, b) => {
      const dateA = a.start_date ? parseISO(a.start_date) : new Date(a.created_at)
      const dateB = b.start_date ? parseISO(b.start_date) : new Date(b.created_at)
      return dateA.getTime() - dateB.getTime()
    })
  }, [tasks, selectedDate, searchQuery])

  // Converter tarefas para o formato do TaskCard
  const formattedTasks = useMemo(() => {
    return dayTasks.map((task) => {
      const taskDate = task.start_date ? parseISO(task.start_date) : new Date(task.created_at)
      
      return {
        title: task.title,
        description: task.description || "",
        time: format(taskDate, "HH:mm"),
        isCompleted: task.completed,
        taskId: task.id,
      }
    })
  }, [dayTasks])
  return (
    <div className="w-[340px] flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar tarefas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring font-[Poppins]"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative shrink-0">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=enzo" />
            <AvatarFallback>EN</AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Create Task */}
      <div className="w-full">
        <CreateTaskCard />
      </div>

      {/* Calendar */}
      <div className="w-full">
        <Calendar />
      </div>

      {/* Tasks Timeline */}
      <div className="relative pl-8 space-y-4 w-full">
        {/* Timeline line */}
        <div className="absolute left-[5px] top-0 bottom-0 w-px bg-border" />
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        ) : formattedTasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground font-[Poppins]">
              {searchQuery.trim() 
                ? "Nenhuma tarefa encontrada" 
                : "Nenhuma tarefa para este dia"}
            </p>
          </div>
        ) : (
          formattedTasks.map((task, index) => (
            <TaskCard key={task.taskId || index} {...task} />
          ))
        )}
      </div>
    </div>
  )
}

export { RightPanel }

