import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Stat {
  label: string
  value: string
}

interface InfoCardProps {
  title: string
  description: string
  stats: Stat[]
}

export function InfoCard({ title, description, stats }: InfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
