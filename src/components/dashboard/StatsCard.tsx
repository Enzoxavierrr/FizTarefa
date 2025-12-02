import { Card } from "@/components/ui/card"

interface StatsCardProps {
  value: string
  label: string
}

function StatsCard({ value, label }: StatsCardProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-6 bg-card border-border/50">
      <span className="text-4xl font-bold text-foreground">{value}</span>
      <span className="text-sm text-muted-foreground mt-1">{label}</span>
    </Card>
  )
}

export { StatsCard }

