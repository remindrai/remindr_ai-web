"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AppLayout } from "@/components/layout/app-layout"
import { StatCard } from "@/components/dashboard/stat-card"
import { TaskOverviewChart } from "@/components/dashboard/task-overview-chart"
import { RecentActivityChart } from "@/components/dashboard/recent-activity-chart"
import { useSearchParams } from "next/navigation"
import { AIChatPage } from "@/components/ai-chat/ai-chat-page"

export function DashboardPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const searchParams = useSearchParams()
  const showAiChat = searchParams.get("showAiChat") === "true"

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <AppLayout>
      <div className="max-w-[1200px] mx-auto">
        {showAiChat ? (
          <AIChatPage />
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Executive Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, here's what's happening with your business today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Tasks"
                value="12"
                icon="📋"
                footer="3 due today"
                change={{ value: "+10%", type: "positive" }}
              />

              <StatCard
                title="Completed"
                value="8"
                icon="✅"
                footer="Completed today"
                change={{ value: "+15%", type: "positive" }}
              />

              <StatCard
                title="Team Members"
                value="5"
                icon="👥"
                footer="Active now"
                change={{ value: "+7%", type: "positive" }}
              />

              <StatCard
                title="Upcoming"
                value="7"
                icon="📅"
                footer="Next 7 days"
                change={{ value: "0%", type: "neutral" }}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Task Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <TaskOverviewChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentActivityChart />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
