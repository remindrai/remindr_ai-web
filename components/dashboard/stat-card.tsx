import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  icon: string
  footer: string
  change: {
    value: string
    type: "positive" | "negative" | "neutral"
  }
}

export function StatCard({ title, value, icon, footer, change }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
          <span className="text-xl">{icon}</span>
        </div>
        <div className="text-3xl font-bold mb-4">{value}</div>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{footer}</span>
          <span
            className={`font-medium flex items-center ${
              change.type === "positive"
                ? "text-success"
                : change.type === "negative"
                  ? "text-destructive"
                  : "text-muted-foreground"
            }`}
          >
            {change.type === "positive" && <ArrowUp className="w-4 h-4 mr-1" />}
            {change.type === "negative" && <ArrowDown className="w-4 h-4 mr-1" />}
            {change.type === "neutral" && <Minus className="w-4 h-4 mr-1" />}
            {change.value}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
