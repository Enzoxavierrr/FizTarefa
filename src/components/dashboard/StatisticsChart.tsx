import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

const chartData = [
  { day: "Sun", thisWeek: 1, lastWeek: 0.5 },
  { day: "Mon", thisWeek: 2, lastWeek: 1 },
  { day: "Tue", thisWeek: 7, lastWeek: 2 },
  { day: "Wed", thisWeek: 8, lastWeek: 3 },
  { day: "Thu", thisWeek: 7, lastWeek: 7 },
  { day: "Fri", thisWeek: 4, lastWeek: 8 },
  { day: "Sat", thisWeek: 9, lastWeek: 4 },
]

function StatisticsChart() {
  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Your statistics</CardTitle>
        </div>
        <div className="flex items-center gap-6 mt-2">
          <button className="text-sm font-medium text-primary border-b-2 border-primary pb-1">
            Working Hours
          </button>
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            My Courses
          </button>
          <div className="ml-auto">
            <select className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm font-medium">
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex items-center gap-6 mb-4 justify-end">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">This Week</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-muted-foreground/50" />
            <span className="text-sm text-muted-foreground">Last Week</span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="lastWeek"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                dot={false}
                opacity={0.5}
              />
              <Line
                type="monotone"
                dataKey="thisWeek"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export { StatisticsChart }

