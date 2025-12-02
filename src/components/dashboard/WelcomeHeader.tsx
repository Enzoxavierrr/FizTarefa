import { Card } from "@/components/ui/card"

interface WelcomeHeaderProps {
  userName: string
}

function WelcomeHeader({ userName }: WelcomeHeaderProps) {
  return (
    <Card className="flex items-center justify-between p-6 bg-card border-border/50">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Olá, {userName}!</h2>
        <p className="text-muted-foreground mt-1">Que bom te ver de novo.</p>
      </div>
      
      {/* Decorative geometric pattern */}
      <div className="grid grid-cols-4 gap-1">
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

