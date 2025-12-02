import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isToday, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useCalendarStore } from "@/stores/calendar-store"

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

interface CalendarDay {
  day: number
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
}

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const { selectedDate, setSelectedDate } = useCalendarStore()

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { locale: ptBR })
    const endDate = endOfWeek(monthEnd, { locale: ptBR })

    const days: CalendarDay[] = []
    let day = startDate

    while (day <= endDate) {
      days.push({
        day: day.getDate(),
        date: day,
        isCurrentMonth: isSameMonth(day, monthStart),
        isToday: isToday(day),
      })
      day = addDays(day, 1)
    }

    return days
  }, [currentMonth])

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const displayDate = selectedDate || new Date()
  const isSelectedToday = selectedDate && isToday(selectedDate)

  return (
    <div className="space-y-4 w-full">
      {/* Date Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground font-[Poppins]">
            {format(displayDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
          </p>
          <h3 className="text-2xl font-bold text-foreground font-[Poppins]">
            {isSelectedToday ? "Hoje" : format(displayDate, "EEEE", { locale: ptBR })}
          </h3>
        </div>
        <div className="flex gap-2 shrink-0 ml-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-9 w-9"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-9 w-9"
            onClick={goToNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 w-full">
        {/* Day Headers */}
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground py-2 font-[Poppins]"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((item, index) => {
          const isSelected = selectedDate && isSameDay(item.date, selectedDate)
          
          return (
            <button
              key={index}
              onClick={() => setSelectedDate(item.date)}
              className={`
                text-center py-2 text-sm font-medium rounded-lg transition-colors font-[Poppins]
                ${!item.isCurrentMonth ? "text-muted-foreground/50" : "text-foreground"}
                ${isSelected
                  ? "bg-primary text-primary-foreground font-bold" 
                  : item.isToday
                    ? "bg-primary/20 text-primary font-semibold"
                    : "hover:bg-accent"
                }
              `}
            >
              {item.day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { Calendar }
