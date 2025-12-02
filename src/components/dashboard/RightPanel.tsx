import { Search, Bell, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "./Calendar"
import { TaskCard } from "./TaskCard"
import { CreateTaskCard } from "./CreateTaskCard"

const tasks = [
  {
    title: "Daily Standup Call",
    description: "Discuss team tasks for the day.",
    time: "9:00 AM",
    avatars: [
      "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    ],
    isCompleted: true,
  },
  {
    title: "Brand Identity Meeting",
    description: "Discuss brand identity guidelines for the print media.",
    time: "11:00 AM",
    avatars: [
      "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=6",
    ],
    isCompleted: false,
    showActions: true,
  },
]

function RightPanel() {
  return (
    <div className="w-[340px] flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=enzo" />
            <AvatarFallback>EN</AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Create Task */}
      <CreateTaskCard />

      {/* Calendar */}
      <Calendar />

      {/* Tasks Timeline */}
      <div className="relative pl-8 space-y-4">
        {/* Timeline line */}
        <div className="absolute left-[5px] top-0 bottom-0 w-px bg-border" />
        
        {tasks.map((task, index) => (
          <TaskCard key={index} {...task} />
        ))}
      </div>
    </div>
  )
}

export { RightPanel }

