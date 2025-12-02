import { Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

function CreateTaskCard() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between bg-sidebar text-sidebar-foreground rounded-2xl p-5 w-full">
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-lg font-[Poppins]">Criar Tarefa</h4>
        <p className="text-sm text-sidebar-foreground/70 font-[Poppins]">Criar uma nova tarefa</p>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate('/tasks/new')}
        className="h-12 w-12 rounded-xl bg-background text-foreground hover:bg-accent shrink-0 ml-4"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}

export { CreateTaskCard }
