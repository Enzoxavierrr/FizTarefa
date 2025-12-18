import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Bell, ChevronDown, Moon, Sun, Settings, Palette } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar } from "./Calendar"
import { TaskCard } from "./TaskCard"
import { CreateTaskCard } from "./CreateTaskCard"
import { useCalendarStore } from "@/stores/calendar-store"
import { useTasks } from "@/hooks/use-tasks"
import { useAuth } from "@/hooks/use-auth"
import { isSameDay, parseISO, format } from "date-fns"

function RightPanel() {
  const { selectedDate } = useCalendarStore()
  const { tasks, loading } = useTasks()
  const { getUserName } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
      if (savedTheme) {
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
        return savedTheme
      }
      // Se não houver tema salvo, verifica a preferência do sistema
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (prefersDark) {
        document.documentElement.classList.add("dark")
        return "dark"
      }
      return "light"
    }
    return "dark"
  })
  
  const userName = getUserName()
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U"
  
  useEffect(() => {
    // Observar mudanças no tema
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light")
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    
    return () => observer.disconnect()
  }, [])

  // Aplicar cor salva ao montar
  useEffect(() => {
    const savedColor = localStorage.getItem("accentColor")
    if (savedColor) {
      const colors: Record<string, string> = {
        yellow: "47.9 95.8% 53.1%",
        blue: "217.2 91.2% 59.8%",
        green: "142.1 76.2% 36.3%",
        purple: "258.3 89.5% 66.3%",
        pink: "330.4 81.2% 60.4%",
        orange: "24.6 95% 53.1%",
      }
      const hsl = colors[savedColor]
      if (hsl) {
        document.documentElement.style.setProperty("--primary", hsl)
        document.documentElement.style.setProperty("--sidebar-primary", hsl)
      }
    }
  }, [])
  
  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme)
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    // Salvar preferência no localStorage
    localStorage.setItem("theme", newTheme)
  }
  
  const handleSettingsClick = () => {
    navigate("/settings")
  }
  
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity cursor-pointer group outline-none"
              aria-label="Menu do usuário"
            >
              <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-primary/50 transition-all">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 font-[Poppins]">
            <DropdownMenuLabel className="font-semibold">{userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Tema */}
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal px-2 py-1.5">
              Tema
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup value={theme} onValueChange={(value) => handleThemeChange(value as "light" | "dark")}>
              <DropdownMenuRadioItem value="light" className="cursor-pointer">
                <Sun className="mr-2 h-4 w-4" />
                <span>Claro</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark" className="cursor-pointer">
                <Moon className="mr-2 h-4 w-4" />
                <span>Escuro</span>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            
            <DropdownMenuSeparator />
            
            {/* Configurações */}
            <DropdownMenuItem 
              onClick={handleSettingsClick}
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

