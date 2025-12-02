import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

interface CalendarDay {
  day: number
  isCurrentMonth: boolean
  isToday: boolean
}

const calendarDays: CalendarDay[] = [
  { day: 30, isCurrentMonth: false, isToday: false },
  { day: 31, isCurrentMonth: false, isToday: false },
  { day: 1, isCurrentMonth: true, isToday: false },
  { day: 2, isCurrentMonth: true, isToday: false },
  { day: 3, isCurrentMonth: true, isToday: false },
  { day: 4, isCurrentMonth: true, isToday: false },
  { day: 5, isCurrentMonth: true, isToday: false },
  { day: 6, isCurrentMonth: true, isToday: false },
  { day: 7, isCurrentMonth: true, isToday: false },
  { day: 8, isCurrentMonth: true, isToday: false },
  { day: 9, isCurrentMonth: true, isToday: false },
  { day: 10, isCurrentMonth: true, isToday: false },
  { day: 11, isCurrentMonth: true, isToday: true },
  { day: 12, isCurrentMonth: true, isToday: false },
]

function Calendar() {
  return (
    <div className="space-y-4">
      {/* Date Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">April 11, 2021</p>
          <h3 className="text-2xl font-bold text-foreground">Today</h3>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((item, index) => (
          <button
            key={index}
            className={`
              text-center py-2 text-sm font-medium rounded-lg transition-colors
              ${!item.isCurrentMonth ? "text-muted-foreground/50" : "text-foreground"}
              ${item.isToday 
                ? "bg-primary text-primary-foreground font-bold" 
                : "hover:bg-accent"
              }
            `}
          >
            {item.day}
          </button>
        ))}
      </div>
    </div>
  )
}

export { Calendar }

