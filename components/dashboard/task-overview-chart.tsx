"use client"
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { Bar } from "react-chartjs-2"

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function TaskOverviewChart() {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Tasks",
        data: [3, 7, 5, 8, 6, 4, 2],
        backgroundColor: "#2563eb",
        borderRadius: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#1e293b",
        bodyColor: "#1e293b",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        bodyFont: {
          family: "Inter",
        },
        titleFont: {
          family: "Inter",
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#e2e8f0",
        },
        border: {
          dash: [4, 4],
        },
        ticks: {
          font: {
            family: "Inter",
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "Inter",
          },
        },
      },
    },
  }

  return (
    <div className="h-[300px]">
      <Bar data={data} options={options} />
    </div>
  )
}
