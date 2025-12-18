import { Card } from "@/components/ui/card"

interface WelcomeHeaderProps {
  userName: string
}

function WelcomeHeader({ userName }: WelcomeHeaderProps) {
  return (
    <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-card border-border/50 gap-4">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-[Poppins]">Olá, {userName}!</h2>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base font-[Poppins]">Que bom te ver de novo.</p>
      </div>
      
      {/* Decorative geometric pattern - oculto no mobile muito pequeno */}
      <div className="hidden sm:grid grid-cols-4 gap-1 shrink-0">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-md ${
              [0, 1, 4, 5, 6, 9, 10, 11, 14, 15].includes(i)
                ? i % 3 === 0
                  ? "bg-primary"
                  : "bg-primary/50"
                : "bg-muted"
            }`}
          />
        ))}
      </div>
    </Card>
  )
}

export { WelcomeHeader }

