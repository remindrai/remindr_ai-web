"use client"

import { useRef } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BarChartProps {
  data: Array<{ name: string; value: number }>
}

export function BarChartComponent({ data }: BarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  const exportToImage = () => {
    if (!chartRef.current) return

    // Use html2canvas or a similar library to capture the chart as an image
    // For this example, we'll just simulate the download
    alert("Chart would be downloaded as PNG")
  }

  return (
    <div className="rounded-md border p-4" ref={chartRef}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Data Visualization</h3>
        <Button variant="outline" size="sm" onClick={exportToImage}>
          <Download className="mr-2 h-4 w-4" />
          Export as PNG
        </Button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#3b82f6" name="Value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
