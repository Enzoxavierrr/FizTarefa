import { Card } from "@/components/ui/card"

interface StatsCardProps {
  value: string
  label: string
}

function StatsCard({ value, label }: StatsCardProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-4 sm:p-6 bg-card border-border/50">
      <span className="text-3xl sm:text-4xl font-bold text-foreground font-[Poppins]">{value}</span>
      <span className="text-xs sm:text-sm text-muted-foreground mt-1 text-center font-[Poppins]">{label}</span>
    </Card>
  )
}

export { StatsCard }

