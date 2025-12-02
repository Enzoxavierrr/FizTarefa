import { Check, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface TaskCardProps {
  title: string
  description: string
  time: string
  avatars: string[]
  isCompleted?: boolean
  showActions?: boolean
}

function TaskCard({
  title,
  description,
  time,
  avatars,
  isCompleted = false,
  showActions = false,
}: TaskCardProps) {
  return (
    <div className="relative">
      {/* Timeline dot */}
      <div className="absolute -left-8 top-1/2 -translate-y-1/2">
        <div className={`w-3 h-3 rounded-full border-2 ${
          isCompleted 
            ? "bg-primary border-primary" 
            : "bg-background border-muted-foreground"
        }`} />
      </div>

      <div className="bg-sidebar text-sidebar-foreground rounded-2xl p-5">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-semibold text-lg">{title}</h4>
          <span className="text-sm text-sidebar-foreground/70">{time}</span>
        </div>
        
        <p className="text-sm text-sidebar-foreground/70 mb-4">{description}</p>
        
        <div className="flex items-center justify-between">
          {/* Avatars */}
          <div className="flex -space-x-2">
            {avatars.map((avatar, index) => (
              <Avatar key={index} className="w-8 h-8 border-2 border-sidebar">
                <AvatarImage src={avatar} />
                <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                  U{index + 1}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>

          {/* Action buttons */}
          {showActions ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-background text-foreground hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-background text-foreground hover:bg-accent"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              size="icon"
              className="h-8 w-8 rounded-full bg-sidebar-primary text-sidebar-primary-foreground"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export { TaskCard }

