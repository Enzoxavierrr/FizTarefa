import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

function CreateTaskCard() {
  return (
    <div className="flex items-center justify-between bg-sidebar text-sidebar-foreground rounded-2xl p-5">
      <div>
        <h4 className="font-semibold text-lg">Create Task</h4>
        <p className="text-sm text-sidebar-foreground/70">Create a new task</p>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="h-12 w-12 rounded-xl bg-background text-foreground hover:bg-accent"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}

export { CreateTaskCard }

