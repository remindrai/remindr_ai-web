"use client"
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js"
import { Line } from "react-chartjs-2"

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export function RecentActivityChart() {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Activity",
        data: [8, 12, 15, 10, 20, 18, 14],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#2563eb",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
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
      <Line data={data} options={options} />
    </div>
  )
}
